import { useState, useContext, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { listItemTypes } from "../types/interface";
import SortableItem from "../components/SortableItem";
import CreateItem from "../components/CreateItem";
import { ThemeModeContext } from "../context/themeContext";
import Header from "../components/Header";
import ThemeSwitch from "../components/ThemeSwitch";
import SortableFilter from "../components/SortableFilter";
import { API_URL } from "../constants";

function Root() {
  const contextValue = useContext(ThemeModeContext);
  const [items, setItems] = useState<listItemTypes[]>([]);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    fetch(API_URL)
      .then(res => {
        if (!res.ok) {
          throw new Error(`Request failed with status: ${res.status}`);
        }

        return res.json();
      })
      .then(data => {
        setItems(data);
      })
      .catch(error => {
        console.error("Fetch error:", error.message);
      });
  }, [setItems]);

  if (!contextValue) return null;
  const { themeMode } = contextValue;

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (active.id !== over?.id && over) {
      setItems((prevItems: listItemTypes[]) => {
        const oldIndex = prevItems.findIndex(
          item => item._id.valueOf().toString() === active.id.toString()
        );
        const newIndex = prevItems.findIndex(
          item => item._id.valueOf().toString() === over.id.toString()
        );

        const updatedItems = arrayMove(prevItems, oldIndex, newIndex);

        return updatedItems.map(item => ({
          ...item,
          _id: (item._id as string).valueOf().toString(),
        }));
      });
    }
  }

  console.log(items);

  return (
    <div id="content" className={themeMode ? "dark" : "light"}>
      <div className={themeMode ? "darkBg" : "lightBg"}>
        <Header>
          <ThemeSwitch />
        </Header>
        <main className="main">
          <CreateItem setItems={setItems} />
          <ul className="list">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={items}
                strategy={verticalListSortingStrategy}
              >
                {items.map(({ id, _id, note, active }) => (
                  <SortableItem
                    key={_id}
                    id={id}
                    note={note}
                    active={active}
                    setItems={setItems}
                  />
                ))}
              </SortableContext>
            </DndContext>
            <SortableFilter items={items} setItems={setItems} />
          </ul>
          <p className={themeMode ? "bottom-txt-dark" : "bottom-txt-light"}>
            Drag and drop to reorder list
          </p>
        </main>
      </div>
    </div>
  );
}

export default Root;

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

        if (!res.headers.get("content-length")) {
          throw new Error("Empty response");
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
      setItems(items => {
        const oldIndex = items.findIndex(item => item._id === active.id);
        const newIndex = items.findIndex(item => item._id === over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }

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
                items={items.map(item => item._id)}
                strategy={verticalListSortingStrategy}
              >
                {items.map(({ _id, note, active }, i) => (
                  <SortableItem
                    key={`${_id}-${i}`}
                    _id={_id}
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

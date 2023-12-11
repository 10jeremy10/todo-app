import { useState, useContext } from "react";
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
import { list } from "../data/list.json";
import { listItemTypes } from "../types/interface";
import SortableItem from "../components/SortableItem";
import CreateItem from "../components/CreateItem";
import { ThemeModeContext } from "../context/themeContext";
import Header from "../components/Header";
import ThemeSwitch from "../components/ThemeSwitch";
import SortableFilter from "../components/SortableFilter";

function Root() {
  const contextValue = useContext(ThemeModeContext);
  const [items, setItems] = useState<listItemTypes[]>(list);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  if (!contextValue) return null;
  const { themeMode } = contextValue;

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (active.id !== over?.id && over) {
      setItems(items => {
        const oldIndex = items.findIndex(item => item.id === active.id);
        const newIndex = items.findIndex(item => item.id === over.id);

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
          <CreateItem />
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
                {items.map(({ id, note, active }) => (
                  <SortableItem
                    key={id}
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
        </main>
      </div>
    </div>
  );
}

export default Root;

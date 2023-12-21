import { useState, useContext, useEffect } from "react";
import axios from "axios";
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
  const [filteredItems, setFilteredItems] = useState<listItemTypes[]>([]);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error(`Request failed with status: ${response.status}`);
        }

        if (!response.headers.get("content-length")) {
          throw new Error("Empty response");
        }

        const data: listItemTypes[] = await response.json();
        setItems(data);

        switch (selectedFilter) {
          case "all":
            setFilteredItems(data);
            break;
          case "active":
            setFilteredItems(
              data.filter((item: { active: boolean }) => item.active)
            );
            break;
          case "completed":
            setFilteredItems(
              data.filter((item: { active: boolean }) => !item.active)
            );
            break;
          default:
            break;
        }
      } catch (error) {
        console.error("Fetch error:", (error as Error).message);
      }
    };

    fetchData();
  }, [selectedFilter, setItems]);

  if (!contextValue) return null;
  const { themeMode } = contextValue;

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (active.id !== over?.id && over) {
      setFilteredItems(prevItems => {
        const updatedItems = arrayMove(
          prevItems,
          prevItems.findIndex(item => item._id === active.id),
          prevItems.findIndex(item => item._id === over.id)
        );

        // Update the index property for each item
        const itemsWithIndex = updatedItems.map((item, index) => ({
          ...item,
          index,
        }));

        // Send a request to the backend to update the index in the database
        axios.put(`${API_URL}/updateIndex`, {
          items: itemsWithIndex,
        });

        return itemsWithIndex;
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
          <CreateItem setFilteredItems={setFilteredItems} />
          <ul className="list">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={filteredItems.map(filteredItem => filteredItem._id)}
                strategy={verticalListSortingStrategy}
              >
                {filteredItems
                  .sort((a, b) => a.index - b.index)
                  .map(({ _id, note, active }: listItemTypes, i: number) => (
                    <SortableItem
                      key={`${_id}-${i}`}
                      _id={_id}
                      note={note}
                      active={active}
                      setFilteredItems={setFilteredItems}
                    />
                  ))}
              </SortableContext>
            </DndContext>
            <SortableFilter
              items={items}
              selectedFilter={selectedFilter}
              setSelectedFilter={setSelectedFilter}
              filteredItems={filteredItems}
              setFilteredItems={setFilteredItems}
            />
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

import { useContext, useState } from "react";
import { ThemeModeContext } from "../context/themeContext";
import { listItemTypes } from "../types/interface";
import s from "./css/SortableFilter.module.css";

interface SortableFilterProps {
  items: listItemTypes[];
  setItems: React.Dispatch<React.SetStateAction<listItemTypes[]>>;
}

function SortableFilter({ items, setItems }: SortableFilterProps) {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const contextValue = useContext(ThemeModeContext);
  if (!contextValue) return null;
  const { themeMode } = contextValue;

  const activeItems = items.filter(item => item.active);

  const handleFilter = (filter: string) => {
    setSelectedFilter(filter);

    switch (filter) {
      case "all":
        setItems(items);
        break;
      case "active":
        setItems(items.filter(item => item.active));
        break;
      case "completed":
        setItems(items.filter(item => !item.active));
        break;
      default:
        break;
    }
  };

  const handleClearCompleted = () => {
    setItems(items => {
      const updatedItems = items.filter(item => item.active);
      return updatedItems;
    });
  };

  return (
    <div className={themeMode ? `${s.containerDark}` : `${s.containerLight}`}>
      <p>{activeItems.length} items left</p>
      <div className={themeMode ? `${s.flexboxDark}` : `${s.flexboxLight}`}>
        <button
          aria-selected={selectedFilter === "all" ? "true" : "false"}
          className={themeMode ? `${s.btnDark}` : `${s.btnLight}`}
          onClick={() => handleFilter("all")}
        >
          All
        </button>
        <button
          aria-selected={selectedFilter === "active" ? "true" : "false"}
          className={themeMode ? `${s.btnDark}` : `${s.btnLight}`}
          onClick={() => handleFilter("active")}
        >
          Active
        </button>
        <button
          aria-selected={selectedFilter === "completed" ? "true" : "false"}
          className={themeMode ? `${s.btnDark}` : `${s.btnLight}`}
          onClick={() => handleFilter("completed")}
        >
          Completed
        </button>
      </div>
      <button
        aria-selected="false"
        className={themeMode ? `${s.btnDark}` : `${s.btnLight}`}
        onClick={handleClearCompleted}
      >
        Clear Completed
      </button>
    </div>
  );
}

export default SortableFilter;

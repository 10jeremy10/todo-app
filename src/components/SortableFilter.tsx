import { useContext } from "react";
import axios from "axios";
import { API_URL } from "../constants";
import { ThemeModeContext } from "../context/themeContext";
import { listItemTypes } from "../types/interface";
import s from "./css/SortableFilter.module.css";

interface SortableFilterProps {
  items: listItemTypes[];
  selectedFilter: string;
  setSelectedFilter: React.Dispatch<React.SetStateAction<string>>;
  filteredItems: listItemTypes[];
  setFilteredItems: React.Dispatch<React.SetStateAction<listItemTypes[]>>;
}

function SortableFilter({
  items,
  selectedFilter,
  setSelectedFilter,
  filteredItems,
  setFilteredItems,
}: SortableFilterProps) {
  const contextValue = useContext(ThemeModeContext);

  if (!contextValue) return null;
  const { themeMode } = contextValue;

  const activeItems = filteredItems.filter(item => item.active);

  const handleFilter = (filter: string) => {
    setSelectedFilter(filter);

    switch (filter) {
      case "all":
        setFilteredItems(items);
        break;
      case "active":
        setFilteredItems(items.filter(item => item.active));
        break;
      case "completed":
        setFilteredItems(items.filter(item => !item.active));
        break;
      default:
        break;
    }
  };

  const handleClearCompleted = async () => {
    try {
      await axios.delete(`${API_URL}/clear`);
      setFilteredItems(items => items.filter(item => item.active));
    } catch (err) {
      console.error("Error deleting item:", err);
    }
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

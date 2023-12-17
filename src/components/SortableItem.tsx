import { useContext } from "react";
import axios from "axios";
import { API_URL } from "../constants";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import iconCheck from "../assets/icon-check.svg";
import { SortableItemProps } from "../types/interface";
import { ThemeModeContext } from "../context/themeContext";
import s from "./css/SortableItem.module.css";

function SortableItem({ id, note, active, setItems }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const contextValue = useContext(ThemeModeContext);
  if (!contextValue) return null;
  const { themeMode } = contextValue;

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleIsActive = async () => {
    try {
      const response = await axios.put(`${API_URL}/update/${id}`, {
        active: !active,
      });

      const updatedItem = response.data;

      setItems(items => {
        const updatedItems = items.map(item =>
          item.id === id ? updatedItem : item
        );
        return updatedItems;
      });
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };

  const handleEdit = (event: React.ChangeEvent<HTMLInputElement>) => {
    const editedNote = event.target.value;

    setItems(items => {
      const updatedItems = items.map(item => {
        if (item.id === id) {
          return { ...item, note: editedNote };
        }
        return item;
      });
      return updatedItems;
    });
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${API_URL}/delete/${id}`);
      setItems(items => items.filter(item => item.id !== id));
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  return (
    <li
      className={themeMode ? `${s.listItemDark}` : `${s.listItemLight}`}
      ref={setNodeRef}
      style={style}
      {...attributes}
    >
      <label
        className={
          active
            ? `${themeMode ? s.labelCheckDark : s.labelCheckLight}`
            : `${s.labelChecked}`
        }
      >
        <input
          className={s.btnCheck}
          type="checkbox"
          checked={!active}
          onChange={handleIsActive}
        />
        {!active ? <img src={iconCheck} alt="icon check" /> : null}
      </label>
      <input
        className={
          active
            ? `${s.btnText}`
            : `${s.btnText} ${themeMode ? s.inactiveDark : s.inactiveLight}`
        }
        type="text"
        value={note}
        onChange={handleEdit}
      />
      <input
        className={s.btnDrag}
        type="button"
        ref={setActivatorNodeRef}
        {...listeners}
      />
      <input className={s.btnDelete} type="button" onClick={handleDelete} />
    </li>
  );
}

export default SortableItem;

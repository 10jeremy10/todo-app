import { useState, useContext } from "react";
import axios from "axios";
import { API_URL } from "../constants";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import iconCheck from "../assets/icon-check.svg";
import { SortableItemProps } from "../types/interface";
import { ThemeModeContext } from "../context/themeContext";
import s from "./css/SortableItem.module.css";

function SortableItem({
  _id,
  note,
  active,
  setFilteredItems,
}: SortableItemProps) {
  const { listeners, setNodeRef, setActivatorNodeRef, transform, transition } =
    useSortable({ id: _id });
  const [isNoteChanged, setIsNoteChanged] = useState(false);
  const contextValue = useContext(ThemeModeContext);
  if (!contextValue) return null;
  const { themeMode } = contextValue;

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleIsActive = async () => {
    try {
      const response = await axios.put(`${API_URL}/update/${_id.toString()}`, {
        active: !active,
      });

      const { active: updatedActive } = response.data;

      setFilteredItems(items => {
        const updatedItems = items.map(item =>
          item._id === _id ? { ...item, active: updatedActive } : item
        );

        return updatedItems;
      });
    } catch (err) {
      console.error("Error updating item active state:", err);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilteredItems(items => {
      const updatedItems = items.map(item => {
        if (item._id === _id) {
          return { ...item, note: event.target.value };
        }
        return item;
      });
      return updatedItems;
    });

    // Set isNoteChanged to true when note changes
    setIsNoteChanged(true);
  };

  const handleEdit = async (event: React.FocusEvent<HTMLInputElement>) => {
    try {
      // Only send the request if the note has changed
      if (isNoteChanged) {
        const editedValue = event.target.value;
        const response = await axios.put(
          `${API_URL}/updateNote/${_id.toString()}`,
          {
            note: editedValue,
          }
        );

        const { note: editedNote } = response.data;

        setFilteredItems(items => {
          const updatedItems = items.map(item => {
            if (item._id === _id) {
              return { ...item, note: editedNote };
            }
            return item;
          });
          return updatedItems;
        });

        // Reset isNoteChanged after handling edit
        setIsNoteChanged(false);
      }
    } catch (err) {
      console.error("Error updating item note state:", err);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${API_URL}/delete/${_id}`);
      setFilteredItems(items => items.filter(item => item._id !== _id));
    } catch (err) {
      console.error("Error deleting item:", err);
    }
  };

  return (
    <li
      className={themeMode ? `${s.listItemDark}` : `${s.listItemLight}`}
      ref={setNodeRef}
      style={style}
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
        onChange={handleChange}
        onBlur={handleEdit}
        onKeyDown={event => {
          if (event.key === "Enter") {
            const inputElement = event.target as HTMLInputElement;
            inputElement.blur();
          }
        }}
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

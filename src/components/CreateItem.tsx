import { useContext, useState } from "react";
import axios from "axios";
import { UniqueIdentifier } from "@dnd-kit/core";
import { ThemeModeContext } from "../context/themeContext";
import { CreateID } from "../function/CreateID";
import { API_URL } from "../constants";
import iconCheck from "../assets/icon-check.svg";
import s from "./css/CreateItem.module.css";

interface CreateItemProps {
  setItems: React.Dispatch<
    React.SetStateAction<
      { id: UniqueIdentifier; _id: string; note: string; active: boolean }[]
    >
  >;
}

function CreateItem({ setItems }: CreateItemProps) {
  const contextValue = useContext(ThemeModeContext);
  const [inputValue, setInputValue] = useState("");
  const [active, setActive] = useState(false);

  if (!contextValue) return null;
  const { themeMode } = contextValue;

  const handleIsActive = () => {
    setActive(!active);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleAddItem = async () => {
    if (inputValue.trim() !== "") {
      try {
        const response = await axios.post(`${API_URL}/add`, {
          id: CreateID(),
          note: inputValue,
          active: !active,
        });

        const newItem = response.data;
        setItems(prevItems => [...prevItems, newItem]);
        setInputValue("");
      } catch (error) {
        console.error("Error adding item:", error);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleAddItem();
    }
  };

  return (
    <section className={s.container}>
      <div
        className={
          themeMode
            ? `${s.CreateItemContainerDark}`
            : `${s.createItemContainerLight}`
        }
      >
        <label
          className={
            !active
              ? `${themeMode ? s.labelCheckDark : s.labelCheckLight}`
              : `${s.labelChecked}`
          }
        >
          <input
            className={s.btnCheck}
            type="checkbox"
            checked={active}
            onChange={handleIsActive}
          />
          {active ? <img src={iconCheck} alt="icon check" /> : null}
        </label>
        <input
          className={
            !active
              ? `${s.btnText}`
              : `${s.btnText} ${themeMode ? s.inactiveDark : s.inactiveLight}`
          }
          type="text"
          placeholder="Create a new todo..."
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />
      </div>
    </section>
  );
}

export default CreateItem;

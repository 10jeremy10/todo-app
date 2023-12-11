import { useContext, useState } from "react";
import { ThemeModeContext } from "../context/themeContext";
import iconCheck from "../assets/icon-check.svg";
import s from "./css/CreateItem.module.css";

function CreateItem() {
  const contextValue = useContext(ThemeModeContext);
  const [active, setActive] = useState(false);
  if (!contextValue) return null;
  const { themeMode } = contextValue;

  const handleIsActive = () => {
    setActive(!active);
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
        />
      </div>
    </section>
  );
}

export default CreateItem;

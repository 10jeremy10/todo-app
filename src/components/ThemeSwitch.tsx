import { useContext } from "react";
import { ThemeModeContext } from "../context/themeContext";
import moon from "../assets/icon-moon.svg";
import sun from "../assets/icon-sun.svg";
import s from "./css/ThemeSwitch.module.css";

function ThemeSwitch() {
  const contextValue = useContext(ThemeModeContext);
  if (!contextValue) return null;
  const { themeMode, toggleThemeMode } = contextValue;

  const handleClick = () => {
    toggleThemeMode();
  };

  return (
    <button className={s.themeSwitch}>
      <img
        src={themeMode ? sun : moon}
        alt={themeMode ? "theme icon sun" : "theme icon moon"}
        onClick={handleClick}
      />
    </button>
  );
}

export default ThemeSwitch;

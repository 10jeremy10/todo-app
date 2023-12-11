import { createContext, useState } from "react";
import { Children, ThemeModeContextProps } from "../types/interface";

const ThemeModeContext = createContext<ThemeModeContextProps | undefined>(
  undefined
);

function ThemeModeProvider(props: Children) {
  const [themeMode, setThemeMode] = useState<boolean>(true);

  const toggleThemeMode = () => {
    setThemeMode(!themeMode);
  };

  return (
    <ThemeModeContext.Provider value={{ themeMode, toggleThemeMode }}>
      {props.children}
    </ThemeModeContext.Provider>
  );
}

export { ThemeModeContext, ThemeModeProvider };

import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../constants";
import { Children, ThemeModeContextProps } from "../types/interface";

const ThemeModeContext = createContext<ThemeModeContextProps | undefined>(
  undefined
);

function ThemeModeProvider(props: Children) {
  const [themeMode, setThemeMode] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_URL}/theme`);

        if (!response.ok) {
          throw new Error(`Request failed with status: ${response.status}`);
        }

        const data = await response.json();
        const extractedTheme = data[0].theme;
        setThemeMode(extractedTheme);
      } catch (error) {
        console.error("Fetch error:", (error as Error).message);
      }
    };

    fetchData();
  }, [setThemeMode]);

  const toggleThemeMode = async () => {
    try {
      // Optimistically update the themeMode state
      setThemeMode(prevThemeMode => !prevThemeMode);
      // console.log(themeMode);

      const response = await axios.put(
        `${API_URL}/theme/${"6583e88d0db99865f32aae82"}`,
        {
          theme: !themeMode,
        }
      );

      const updatedTheme = response.data.theme;
      // Update the themeMode state based on the actual result
      setThemeMode(updatedTheme);
    } catch (err) {
      console.error("Error updating theme state:", err);
      // Revert the themeMode state on error
      setThemeMode(prevThemeMode => !prevThemeMode);
    }
  };

  return (
    <ThemeModeContext.Provider value={{ themeMode, toggleThemeMode }}>
      {props.children}
    </ThemeModeContext.Provider>
  );
}

export { ThemeModeContext, ThemeModeProvider };

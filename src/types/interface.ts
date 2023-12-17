import { ReactNode } from "react";

export interface listItemTypes {
  _id: string;
  note: string;
  active: boolean;
}

export interface SortableItemProps {
  _id: string;
  note: string;
  active: boolean;
  setItems: React.Dispatch<React.SetStateAction<listItemTypes[]>>;
}

export interface ThemeModeContextProps {
  themeMode: boolean;
  toggleThemeMode: () => void;
}

export interface Children {
  children: ReactNode;
}

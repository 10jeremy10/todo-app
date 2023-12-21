import { ReactNode } from "react";

export interface listItemTypes {
  _id: string;
  note: string;
  active: boolean;
  index: number;
}

export interface SortableItemProps {
  _id: string;
  note: string;
  active: boolean;
  setFilteredItems: React.Dispatch<React.SetStateAction<listItemTypes[]>>;
}

export interface ThemeModeContextProps {
  themeMode: boolean;
  toggleThemeMode: () => void;
}

export interface Children {
  children: ReactNode;
}

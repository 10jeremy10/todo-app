import { ReactNode } from "react";
import { UniqueIdentifier } from "@dnd-kit/core";

export interface listItemTypes {
  id: UniqueIdentifier;
  _id: string;
  note: string;
  active: boolean;
}
export interface SortableItemProps {
  id: UniqueIdentifier;
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

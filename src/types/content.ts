export type Category = "Movies" | "Series" | "Documentary" | "Short";

export type Status = "active" | "inactive";

export interface ContentItem {
  id: string;
  title: string;
  category: Category;
  status: Status;
  views: number;
}

export const CATEGORIES: Category[] = [
  "Movies",
  "Series",
  "Documentary",
  "Short",
];

export const STATUSES: Status[] = ["active", "inactive"];

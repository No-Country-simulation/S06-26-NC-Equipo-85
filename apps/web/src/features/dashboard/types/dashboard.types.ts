export type DashboardModuleAccent =
  | "amber"
  | "terracotta"
  | "coral"
  | "blue"
  | "olive";

export type DashboardModule = {
  id: string;
  title: string;
  description: string;
  href: string;
  accent: DashboardModuleAccent;
};

export type CourseLevel = "principiante" | "intermedio" | "avanzado";
export type CourseArea = "frontend" | "backend" | "data" | "qa" | "fullstack";
export type CourseProvider = "google" | "oracle" | "aws" | "microsoft" | "freecodecamp";

export type Course = {
  id: string;
  title: string;
  provider: CourseProvider;
  level: CourseLevel;
  area: CourseArea;
  duration: string;
  videoUrl?: string;
  description: string;
  skills: string[];
};

export type CourseFilters = {
  provider?: CourseProvider;
  level?: CourseLevel;
  area?: CourseArea;
};
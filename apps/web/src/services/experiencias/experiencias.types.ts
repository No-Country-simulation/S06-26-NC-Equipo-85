export type ExperienceArea =
  | "BACKEND"
  | "FRONTEND"
  | "MOBILE"
  | "DATA_SCIENCE"
  | "DESIGN_UX_UI"
  | "SOFT_SKILLS";

export type ExperienceType =
  | "WORKSHOP"
  | "BOOTCAMP"
  | "WEBINAR"
  | "JOB_EXPERIENCE";

export type Experience = {
  id: string;
  title: string;
  speakerName: string;
  speakerRole: string;
  area: ExperienceArea;
  experienceType: ExperienceType;
  videoUrl: string;
  description: string;
  duration?: string;
};

export type ExperienceFilters = {
  area?: ExperienceArea;
  experienceType?: ExperienceType;
};
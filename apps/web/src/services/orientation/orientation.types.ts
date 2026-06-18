export type OrientationRequest = {
  personal: {
    fullName: string;
    email: string;
    birthDate: string;
    gender: string;
    educationLevel: string;
    country: string;
    city: string;
    whatsapp: string;
  };
  professional: {
    techLevel: string;
    techArea: string;
    objective: string;
    experienceSummary?: string;
  };
};

export type CompatibleJob = {
  id: string;
  title: string;
  company: string;
  matchScore: number;
  missingRequirements: string[];
};

export type OrientationResult = {
  gapPercentage: number;
  suggestedPath: string[];
  compatibleJobs: CompatibleJob[];
  generatedAt: string;
  source: "api" | "mock";
};
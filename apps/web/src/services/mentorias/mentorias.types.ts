export type Mentor = {
  id: string;
  name: string;
  role: string;
  avatarUrl?: string;
  available: boolean;
  availability?: string;
  areas: string[];
  bio: string;
};

export type BookingSlot = {
  id: string;
  mentorId: string;
  date: string;
  startTime: string;
  endTime: string;
  available: boolean;
};

export type BookingRequest = {
  mentorId: string;
  slotId: string;
};

export type BookingResponse = {
  success: boolean;
  message: string;
  sessionId?: string;
};
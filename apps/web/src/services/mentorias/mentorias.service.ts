import { apiRequest, getApiBaseUrl } from "@/lib/api";
import type { Mentor, BookingSlot, BookingRequest, BookingResponse } from "./mentorias.types";

const MOCK_DELAY_MS = 300;

const MOCK_MENTORES: Mentor[] = [
  {
    id: "mentor-1",
    name: "Ana Martínez",
    role: "Tech Lead en Mercado Libre",
    available: true,
    availability: "Lun, Mié y Vie · 14-18h",
    areas: ["FRONTEND", "SOFT_SKILLS"],
    bio: "10 años de experiencia en desarrollo frontend. Guío a personas en transición laboral hacia tecnología.",
  },
  {
    id: "mentor-2",
    name: "Carlos Pérez",
    role: "Data Engineer en Google",
    available: true,
    availability: "Mar y Jue · 10-14h",
    areas: ["DATA_SCIENCE", "BACKEND"],
    bio: "Especialista en datos con background en economía. Ayudo a perfiles no técnicos a dar el salto a datos.",
  },
  {
    id: "mentor-3",
    name: "María López",
    role: "UX Lead en Globant",
    available: true,
    availability: "Lun a Jue · 16-19h",
    areas: ["DESIGN_UX_UI", "SOFT_SKILLS"],
    bio: "Diseñadora de producto con enfoque en accesibilidad. Mentora de mujeres en tecnología.",
  },
  {
    id: "mentor-4",
    name: "Javier Gómez",
    role: "Backend Developer en Auth0",
    available: false,
    availability: "Próximamente disponible",
    areas: ["BACKEND", "MOBILE"],
    bio: "Arquitecto de sistemas con experiencia en microservicios. Prefiero mentorear en sesiones grupales.",
  },
  {
    id: "mentor-5",
    name: "Lucía Fernández",
    role: "QA Automation en Accenture",
    available: true,
    availability: "Mié y Vie · 9-13h",
    areas: ["FRONTEND", "BACKEND"],
    bio: "Empecé como tester manual sin título. Hoy lidero el equipo de automatización. Me apasiona acompañar primeras experiencias.",
  },
  {
    id: "mentor-6",
    name: "Sebastián Torres",
    role: "Engineering Manager en PedidosYa",
    available: true,
    availability: "Mar y Jue · 15-18h",
    areas: ["MOBILE", "SOFT_SKILLS"],
    bio: "Lidero equipos mobile hace 8 años. Doy mentoring orientado a liderazgo técnico y crecimiento profesional.",
  },
];

const MOCK_SLOTS: BookingSlot[] = [
  { id: "slot-1", mentorId: "mentor-1", date: "2026-07-06", startTime: "14:00", endTime: "14:30", available: true },
  { id: "slot-2", mentorId: "mentor-1", date: "2026-07-06", startTime: "15:00", endTime: "15:30", available: true },
  { id: "slot-3", mentorId: "mentor-1", date: "2026-07-08", startTime: "14:00", endTime: "14:30", available: true },
  { id: "slot-4", mentorId: "mentor-1", date: "2026-07-10", startTime: "16:00", endTime: "16:30", available: false },
  { id: "slot-5", mentorId: "mentor-2", date: "2026-07-07", startTime: "10:00", endTime: "10:30", available: true },
  { id: "slot-6", mentorId: "mentor-2", date: "2026-07-07", startTime: "11:00", endTime: "11:30", available: true },
  { id: "slot-7", mentorId: "mentor-2", date: "2026-07-09", startTime: "10:00", endTime: "10:30", available: true },
  { id: "slot-8", mentorId: "mentor-3", date: "2026-07-06", startTime: "16:00", endTime: "16:30", available: true },
  { id: "slot-9", mentorId: "mentor-3", date: "2026-07-07", startTime: "17:00", endTime: "17:30", available: true },
  { id: "slot-10", mentorId: "mentor-3", date: "2026-07-08", startTime: "16:00", endTime: "16:30", available: true },
  { id: "slot-11", mentorId: "mentor-5", date: "2026-07-08", startTime: "09:00", endTime: "09:30", available: true },
  { id: "slot-12", mentorId: "mentor-5", date: "2026-07-10", startTime: "09:00", endTime: "09:30", available: true },
  { id: "slot-13", mentorId: "mentor-6", date: "2026-07-07", startTime: "15:00", endTime: "15:30", available: true },
  { id: "slot-14", mentorId: "mentor-6", date: "2026-07-09", startTime: "16:00", endTime: "16:30", available: false },
];

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getMentores(): Promise<Mentor[]> {
  if (!getApiBaseUrl()) {
    await wait(MOCK_DELAY_MS);
    return MOCK_MENTORES;
  }
  return apiRequest<Mentor[]>("/api/mentores");
}

export async function getSlotsByMentor(mentorId: string): Promise<BookingSlot[]> {
  if (!getApiBaseUrl()) {
    await wait(MOCK_DELAY_MS);
    return MOCK_SLOTS.filter((s) => s.mentorId === mentorId);
  }
  return apiRequest<BookingSlot[]>(`/api/mentores/${mentorId}/slots`);
}

export async function agendar(request: BookingRequest): Promise<BookingResponse> {
  if (!getApiBaseUrl()) {
    await wait(MOCK_DELAY_MS);
    const slot = MOCK_SLOTS.find((s) => s.id === request.slotId);
    if (!slot || !slot.available) {
      return { success: false, message: "Ese horario ya fue ocupado. Elegí otro." };
    }
    return { success: true, message: "Sesión agendada con éxito", sessionId: `session-${Date.now()}` };
  }
  return apiRequest<BookingResponse>(`/api/mentores/${request.mentorId}/agendar`, {
    method: "POST",
    body: JSON.stringify({ slotId: request.slotId }),
  });
}
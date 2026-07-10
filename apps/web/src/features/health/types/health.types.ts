import type { z } from "zod";
import type { checkinSchema } from "../schemas/checkin.schema";

/** Valores del formulario de check-in (inferidos del schema Zod). */
export type CheckinFormValues = z.infer<typeof checkinSchema>;

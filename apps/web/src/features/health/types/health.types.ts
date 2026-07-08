import type { z } from "zod";
import type { checkinSchema } from "../schemas/checkin.schema";
import type { textAnalysisSchema } from "../schemas/text-analysis.schema";

/** Valores del formulario de check-in (inferidos del schema Zod). */
export type CheckinFormValues = z.infer<typeof checkinSchema>;

/** Valores del formulario de análisis de texto libre. */
export type TextAnalysisFormValues = z.infer<typeof textAnalysisSchema>;

"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Badge,
  Button,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  Spinner,
} from "@app/ui";
import { useSlotsByMentor, useAgendar } from "../hooks/use-mentorias";
import type { Mentor } from "@/services/mentorias/mentorias.types";

type BookingSheetProps = {
  mentor: Mentor | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function BookingSheet({ mentor, open, onOpenChange }: BookingSheetProps) {
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const { data: slots, isLoading } = useSlotsByMentor(mentor?.id ?? null);
  const { mutate: bookSession, isPending } = useAgendar();

  if (!mentor) return null;

  function handleConfirm() {
    if (!selectedSlot || !mentor) return;
    bookSession(
      { mentorId: mentor.id, slotId: selectedSlot },
      {
        onSuccess: (res) => {
          if (res.success) {
            toast.success("Sesión agendada con éxito");
            onOpenChange(false);
          } else {
            toast.error("Ese horario ya fue ocupado. Elegí otro.");
            setSelectedSlot(null);
          }
        },
        onError: () => {
          toast.error("No se pudo agendar la sesión. Intentá de nuevo.");
        },
      },
    );
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-lg">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-xl">Sesión con {mentor.name}</SheetTitle>
          <SheetDescription className="mt-1">{mentor.role}</SheetDescription>
        </SheetHeader>

        <div className="space-y-6">
          <div className="rounded-xl bg-azul-soft p-4">
            <p className="text-sm text-cacao">{mentor.bio}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {mentor.areas.map((area) => (
                <Badge key={area} variant="secondary">
                  {area}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold text-foreground">Horarios disponibles</h4>

            {isLoading ? (
              <div className="flex justify-center py-6">
                <Spinner />
              </div>
            ) : slots?.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No hay horarios disponibles para este mentor
              </p>
            ) : (
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {slots?.map((slot) => {
                  const date = new Date(slot.date + "T" + slot.startTime);
                  const dayName = date.toLocaleDateString("es-AR", { weekday: "short" });
                  const isSelected = selectedSlot === slot.id;
                  const isAvailable = slot.available;

                  return (
                    <button
                      key={slot.id}
                      type="button"
                      disabled={!isAvailable}
                      onClick={() => setSelectedSlot(slot.id)}
                      className={`rounded-xl border px-3 py-2.5 text-left text-sm transition-colors ${
                        isSelected
                          ? "border-azul-horizonte bg-azul-soft text-cacao"
                          : isAvailable
                            ? "border-border text-muted-foreground hover:border-azul-horizonte/50"
                            : "cursor-not-allowed border-border/50 text-muted-foreground/50"
                      }`}
                    >
                      <span className="font-medium">
                        {dayName} {slot.date.slice(8)}
                      </span>
                      <span className="ml-2 text-xs">
                        {slot.startTime} - {slot.endTime}
                      </span>
                      <Badge
                        variant={isAvailable ? "success" : "outline"}
                        className="ml-auto text-[10px]"
                      >
                        {isAvailable ? "Disponible" : "Ocupado"}
                      </Badge>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <Button
            className="w-full bg-azul-horizonte text-crema hover:bg-azul-horizonte/90"
            disabled={!selectedSlot || isPending}
            onClick={handleConfirm}
          >
            {isPending ? "Agendando..." : "Confirmar agendamiento"}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
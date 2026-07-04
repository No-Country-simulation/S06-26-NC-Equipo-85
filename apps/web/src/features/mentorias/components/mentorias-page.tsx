"use client";

import { useState } from "react";
import { useMentores } from "../hooks/use-mentorias";
import { MentoresGrid } from "./mentores-grid";
import { BookingSheet } from "./booking-sheet";
import { EmptyState } from "@app/ui";
import { AlertCircle } from "lucide-react";
import type { Mentor } from "@/services/mentorias/mentorias.types";

export function MentoriasPage() {
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [bookingOpen, setBookingOpen] = useState(false);
  const { data: mentores, isLoading, error, refetch } = useMentores();

  function handleBook(mentor: Mentor) {
    setSelectedMentor(mentor);
    setBookingOpen(true);
  }

  if (error) {
    return (
      <div className="flex flex-col items-center gap-4 py-16">
        <AlertCircle className="size-8 text-destructive" />
        <p className="text-sm text-muted-foreground">Error al cargar mentores</p>
        <button
          type="button"
          onClick={() => refetch()}
          className="text-sm font-medium text-primary underline-offset-4 hover:underline"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-semibold text-foreground">Mentorías</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Encontrá mentores reales y agendá prácticas para ganar confianza antes de postularte.
        </p>
      </div>

      {!isLoading && mentores?.length === 0 && (
        <EmptyState title="No hay mentores disponibles para tu perfil" />
      )}

      <MentoresGrid
        mentores={mentores ?? []}
        isLoading={isLoading}
        onBook={handleBook}
      />

      <BookingSheet
        mentor={selectedMentor}
        open={bookingOpen}
        onOpenChange={setBookingOpen}
      />
    </div>
  );
}
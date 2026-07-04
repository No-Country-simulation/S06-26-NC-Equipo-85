"use client";

import { MentorCard, Spinner } from "@app/ui";
import type { Mentor } from "@/services/mentorias/mentorias.types";

type MentoresGridProps = {
  mentores: Mentor[];
  isLoading: boolean;
  onBook: (mentor: Mentor) => void;
};

export function MentoresGrid({ mentores, isLoading, onBook }: MentoresGridProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner />
      </div>
    );
  }

  if (mentores.length === 0) return null;

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {mentores.map((mentor) => (
        <MentorCard
          key={mentor.id}
          mentor={{
            id: mentor.id,
            name: mentor.name,
            role: mentor.role,
            avatarUrl: mentor.avatarUrl,
            available: mentor.available,
            availability: mentor.availability,
          }}
          ctaLabel={mentor.available ? "Agendar sesión" : "Sin cupos"}
          onAction={mentor.available ? () => onBook(mentor) : undefined}
        />
      ))}
    </div>
  );
}
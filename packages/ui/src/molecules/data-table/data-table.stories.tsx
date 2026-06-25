import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "../../atoms/badge";
import { DataTable } from "./data-table";

type Row = {
  id: string;
  title: string;
  provider: string;
  level: string;
};

const columns: ColumnDef<Row>[] = [
  { accessorKey: "title", header: "Curso", enableSorting: true },
  {
    accessorKey: "provider",
    header: "Proveedor",
    enableSorting: true,
    cell: ({ row }) => (
      <Badge variant="secondary">{row.original.provider}</Badge>
    ),
  },
  { accessorKey: "level", header: "Nivel", enableSorting: true },
];

const labels = {
  empty: "Sin resultados",
  previous: "Anterior",
  next: "Siguiente",
  pageInfo: (page: number, total: number) => `Página ${page} de ${total}`,
};

const data: Row[] = Array.from({ length: 23 }, (_, i) => ({
  id: String(i + 1),
  title: `Curso ${i + 1}`,
  provider: ["Google", "AWS", "Oracle"][i % 3],
  level: ["Principiante", "Intermedio", "Avanzado"][i % 3],
}));

const meta: Meta<typeof DataTable<Row>> = {
  title: "Molecules/DataTable",
  component: DataTable,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { columns, data, labels, pageSize: 5 },
};

export const Loading: Story = {
  args: { columns, data: [], labels, isLoading: true },
};

export const Empty: Story = {
  args: { columns, data: [], labels },
};

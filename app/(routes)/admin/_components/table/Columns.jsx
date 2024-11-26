"use client";

import { ColumnDef } from "@tanstack/react-table";

// Definisi data tanpa TypeScript
export const columns = [
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "amount",
    header: "Amount",
  },
];

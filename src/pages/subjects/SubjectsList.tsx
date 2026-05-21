import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { CreateButton } from "@/components/refine-ui/buttons/create";
import { ListView } from "@/components/refine-ui/views/list-view.tsx";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb.tsx";
import { useMemo, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DEPARTMENTS_OPTIONS } from "../../../constants/index.ts";
import { DataTable } from "@/components/refine-ui/data-table/data-table.tsx";
import { useTable } from "@refinedev/react-table"; // Refine + TanStack
// import { useTable } from "@refinedev/core";
import { Subject } from "../../../src/types/index.ts";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge.tsx";
import { DataTableSorter } from "@/components/refine-ui/data-table/data-table-sorter.tsx";

export const SubjectsList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const departmentFilter =
    selectedDepartment === "all"
      ? []
      : [
          {
            field: "department",
            operator: "eq" as const,
            value: selectedDepartment,
          },
        ];
  const searchFilter = searchQuery
    ? [
        {
          field: "name",
          operator: "contains" as const,
          value: searchQuery,
        },
      ]
    : [];

  const columns = useMemo<ColumnDef<Subject>[]>(
    () => [
      {
        //* ID Column
        id: "code",
        accessorKey: "code",
        size: 100,
        header: () => <p className="column-title ml-2">Code</p>,
        cell: ({ getValue }) => <Badge>{getValue<string>()}</Badge>,
      },
      {
        //* Name Column
        id: "name",
        accessorKey: "name",
        size: 200,
        header: () => <p className="column-title">Name</p>,
        cell: ({ getValue }) => (
          <span className="text-foreground">{getValue<string>()}</span>
        ),
        filterFn: "includesString",
      },
      {
        id: "department",
        accessorKey: "department",
        size: 150,
        header: () => <p className="column-title">Department</p>,
        cell: ({ getValue }) => (
          <Badge variant="secondary">{getValue<string>()}</Badge>
        ),
      },
      {
        id: "description",
        accessorKey: "description",
        size: 300,
        header: () => <p className="column-title">Description</p>,
        cell: ({ getValue }) => (
          <span className="truncate line-clamp-2">{getValue<string>()}</span>
        ),
      },
    ],
    [],
  );

  const subjectTable = useTable<Subject>({
    columns,
    refineCoreProps: {
      resource: "subjects",
      pagination: { pageSize: 10, mode: "server" },
      filters: {
        permanent: [...departmentFilter, ...searchFilter],
      },
      sorters: { initial: [{ field: "id", order: "asc" }] },
    },
  });

  return (
    <ListView>
      <Breadcrumb />

      <h1 className="page-title">Subjects</h1>

      <div className="intro-row">
        <p>Quick Access To Essential Metrics & Management Tools.</p>

        <div className="action-row">
          {/* Search */}
          <div className="search-field">
            <Search className="search-icon" />

            <Input
              type="text"
              placeholder="Search By Name"
              className="pl-10 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Filter */}
          <div className="flex gap-2 w-full sm:w-auto my-3">
            <Select
              value={selectedDepartment}
              onValueChange={setSelectedDepartment}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter By Department" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>

                {DEPARTMENTS_OPTIONS.map((department) => (
                  <SelectItem key={department.label} value={department.value}>
                    {department.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <CreateButton />
          </div>
        </div>
      </div>

      <DataTable table={subjectTable} />
    </ListView>
  );
};

import { useMemo, useState } from "react";
import { MoreHorizontal, Search } from "lucide-react";
import { type ColumnDef } from "@tanstack/react-table";
import { ListView } from "@/components/refine-ui/views/list-view";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Subject } from "@/types";
import { Mock_SUBJECTS } from "./mock-data";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { CreateButton } from "@/components/refine-ui/buttons/create";
import { DataTable } from "@/components/refine-ui/data-table/data-table";
import { useTable } from "@refinedev/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { Button } from "@/components/ui/button";
import { ShowButton } from "@/components/refine-ui/buttons/show";
import { EditButton } from "@/components/refine-ui/buttons/edit";
import { DeleteButton } from "@/components/refine-ui/buttons/delete";
import { CrudFilter, CrudFilters } from "@refinedev/core";

const SubjectsList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("all");

  const departmentOptions = useMemo(() => {
    const set = new Set<string>();
    for (const s of Mock_SUBJECTS) {
      if (s.department) set.add(s.department);
    }
    return ["all", ...Array.from(set)];
  }, []);

  const departmentFiltering: CrudFilters =
    selectedDepartment && selectedDepartment !== "all"
      ? [
          {
            field: "department",
            operator: "eq" as const,
            value: selectedDepartment,
          },
        ]
      : [];

  const searchFiltering: CrudFilters = searchQuery
    ? [{ field: "name", operator: "contains" as const, value: searchQuery }]
    : [];

  const columns = useMemo<ColumnDef<Subject>[]>(
    () => [
      {
        accessorKey: "code",
        size: 100,
        header: () => <p className="column-title">Code</p>,
        cell: ({ getValue }) => (
          <Badge variant="secondary">{getValue<string>()}</Badge>
        ),
      },
      {
        accessorKey: "name",
        header: () => <p className="column-title">Subject</p>,
        cell: ({ getValue }) => <span>{getValue<string>()}</span>,
      },
      {
        accessorKey: "department.name",
        size: 100,
        header: () => <p className="column-title">Department</p>,
        cell: ({ getValue }) => (
          <Badge variant="outline">{getValue<string>()}</Badge>
        ),
      },
      {
        accessorKey: "createdAt",
        size: 100,
        header: () => <p className="column-title">Created At</p>,
        cell: ({ getValue }) =>
          new Date(getValue<string>()).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }),
      },
      {
        // Actions column with edit/delete/show buttons
        id: "actions",
        size: 50,
        enableSorting: false, // Disable sorting for action buttons
        enableColumnFilter: false, // Disable filtering for action buttons
        header: "Actions",
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-8 w-8 p-0"
                aria-label={`Open actions for ${row.original.code}`}
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <ShowButton size="sm" recordItemId={row.original.id} disabled />
              <EditButton size="sm" recordItemId={row.original.id} disabled />
              <DeleteButton size="sm" recordItemId={row.original.id} disabled />
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    [],
  );

  const subjectsTable = useTable<Subject>({
    columns,
    refineCoreProps: {
      resource: "subjects",
      pagination: { mode: "client" },
      sorters: {},
      filters: {
        permanent: [...departmentFiltering, ...searchFiltering],
      },
    },
  });

  return (
    <ListView className="space-y-6">
      <Breadcrumb />

      <h1 className="page-title">Subjects</h1>

      <div className="flex flex-col gap-5 space-y-4">
        <p>Quick Access to essential metrics and management tools.</p>

        <div className="flex flex-col gap-2">
          {/* Search-Field */}
          <div className="search-field">
            <Search className="search-icon" />
            <Input
              type="text"
              placeholder="Search By Name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full"
            />
          </div>

          {/* Filter + Create-Button */}
          <div className="flex gap-2">
            {/* Filter-Field */}
            <div className="flex ">
              <Select
                value={selectedDepartment}
                onValueChange={(val) => setSelectedDepartment(val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Department" />
                </SelectTrigger>

                <SelectContent>
                  {departmentOptions.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept === "all" ? "All Departments" : dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <CreateButton />
          </div>
        </div>
      </div>

      <DataTable table={subjectsTable} />
    </ListView>
  );
};

export default SubjectsList;

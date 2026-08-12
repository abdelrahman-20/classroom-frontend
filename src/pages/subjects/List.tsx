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

const SubjectsList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("all");

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
        accessorKey: "department",
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
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <ShowButton size="sm" recordItemId={row.original.id} />
              <EditButton size="sm" recordItemId={row.original.id} />
              <DeleteButton size="sm" recordItemId={row.original.id} />
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
      pagination: { mode: "client", currentPage: 1, pageSize: 2 },
      filters: {},
      sorters: {},
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
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select Department"></SelectValue>
                </SelectTrigger>

                <SelectContent>
                  <SelectItem key="all" value="all">
                    All Departments
                  </SelectItem>

                  {Mock_SUBJECTS.map((subject) => (
                    <SelectItem key={subject.id} value={subject.department}>
                      {subject.department}
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

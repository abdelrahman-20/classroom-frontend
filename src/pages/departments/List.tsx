import { CreateButton } from "@/components/refine-ui/buttons/create";
import { EditButton } from "@/components/refine-ui/buttons/edit";
import { ShowButton } from "@/components/refine-ui/buttons/show";
import { DeleteButton } from "@/components/refine-ui/buttons/delete";
import { DataTable } from "@/components/refine-ui/data-table/data-table";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { ListView } from "@/components/refine-ui/views/list-view";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Department } from "@/types";
import { CrudFilters } from "@refinedev/core";
import { useTable } from "@refinedev/react-table";
import { ColumnDef } from "@tanstack/react-table";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";

const DepartmentsList = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const searchFilters: CrudFilters = searchQuery
    ? [{ field: "name", operator: "contains", value: searchQuery }]
    : [];

  const columns = useMemo<ColumnDef<Department>[]>(
    () => [
      {
        accessorKey: "code",
        header: () => <p className="column-title">Code</p>,
        cell: ({ getValue }) => (
          <Badge variant="secondary">{getValue<string>()}</Badge>
        ),
      },
      {
        accessorKey: "name",
        header: () => <p className="column-title">Name</p>,
      },
      {
        accessorKey: "subjectCount",
        header: () => <p className="column-title">Subjects</p>,
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex gap-1">
            <ShowButton
              resource="departments"
              recordItemId={row.original.id}
              size="sm"
            />
            <EditButton
              resource="departments"
              recordItemId={row.original.id}
              size="sm"
            />
            <DeleteButton
              resource="departments"
              recordItemId={row.original.id}
              size="sm"
            />
          </div>
        ),
      },
    ],
    [],
  );

  const table = useTable<Department>({
    columns,
    refineCoreProps: {
      resource: "departments",
      pagination: { pageSize: 10, mode: "server" },
      filters: { permanent: searchFilters },
      syncWithLocation: true,
    },
  });

  return (
    <ListView>
      <Breadcrumb />
      <h1 className="page-title">Departments</h1>
      <div className="flex flex-col gap-2 mb-4">
        <div className="search-field">
          <Search className="search-icon" />
          <Input
            placeholder="Search departments..."
            aria-label="Search departments"
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <CreateButton resource="departments" />
      </div>
      <DataTable table={table} />
    </ListView>
  );
};

export default DepartmentsList;

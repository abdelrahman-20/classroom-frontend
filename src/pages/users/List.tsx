import { CreateButton } from "@/components/refine-ui/buttons/create";
import { EditButton } from "@/components/refine-ui/buttons/edit";
import { ShowButton } from "@/components/refine-ui/buttons/show";
import { DeleteButton } from "@/components/refine-ui/buttons/delete";
import { DataTable } from "@/components/refine-ui/data-table/data-table";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { ListView } from "@/components/refine-ui/views/list-view";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User, UserRole } from "@/types";
import { CrudFilters } from "@refinedev/core";
import { useTable } from "@refinedev/react-table";
import { ColumnDef } from "@tanstack/react-table";
import { Search } from "lucide-react";
import { useCallback, useMemo, useState } from "react";

const UsersList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");

  const roleFilter: CrudFilters =
    selectedRole !== "all"
      ? [{ field: "role", operator: "eq", value: selectedRole }]
      : [];

  const searchFilters: CrudFilters = searchQuery
    ? [
        {
          operator: "or",
          value: [
            { field: "name", operator: "contains", value: searchQuery },
            { field: "email", operator: "contains", value: searchQuery },
          ],
        },
      ]
    : [];

  const columns = useMemo<ColumnDef<User>[]>(
    () => [
      {
        accessorKey: "name",
        size: 100,
        header: () => <p className="column-title">Name</p>,
        cell: ({ getValue }) => (
          <span className="font-medium">{getValue<string>()}</span>
        ),
      },
      {
        accessorKey: "email",
        size: 120,
        header: () => <p className="column-title">Email</p>,
      },
      {
        accessorKey: "role",
        size: 50,
        header: () => <p className="column-title">Role</p>,
        cell: ({ getValue }) => (
          <Badge variant="outline">{getValue<string>()}</Badge>
        ),
      },
      {
        id: "actions",
        size: 120,
        header: () => <p className="column-title">Actions</p>,
        cell: ({ row }) => (
          <div className="flex gap-1">
            <ShowButton
              resource="users"
              recordItemId={row.original.id}
              size="sm"
            />
            <EditButton
              resource="users"
              recordItemId={row.original.id}
              size="sm"
            />
            <DeleteButton
              resource="users"
              recordItemId={row.original.id}
              size="sm"
            />
          </div>
        ),
      },
    ],
    [],
  );

  const table = useTable<User>({
    columns,
    refineCoreProps: {
      resource: "users",
      pagination: { pageSize: 10, mode: "server" },
      filters: { permanent: [...roleFilter, ...searchFilters] },
      sorters: { initial: [{ field: "createdAt", order: "desc" }] },
      syncWithLocation: true,
    },
  });

  return (
    <ListView>
      <Breadcrumb />
      <h1 className="page-title">Users</h1>
      <div className="flex flex-col gap-2 mb-4">
        <div className="search-field">
          <Search className="search-icon" />
          <Input
            placeholder="Search by name or email..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Select value={selectedRole} onValueChange={setSelectedRole}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value={UserRole.ADMIN}>Admin</SelectItem>
              <SelectItem value={UserRole.TEACHER}>Teacher</SelectItem>
              <SelectItem value={UserRole.STUDENT}>Student</SelectItem>
            </SelectContent>
          </Select>
          <CreateButton resource="users" />
        </div>
      </div>
      <DataTable table={table} />
    </ListView>
  );
};

export default UsersList;

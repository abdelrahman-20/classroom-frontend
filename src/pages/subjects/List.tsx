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
import { Department, Subject } from "@/types";
import { CrudFilters, useInfiniteList } from "@refinedev/core";
import { useTable } from "@refinedev/react-table";
import { ColumnDef } from "@tanstack/react-table";
import { Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const SubjectsList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("all");

  const { query: deptQuery, result: deptResult } = useInfiniteList<Department>({
    resource: "departments",
    pagination: { pageSize: 100, mode: "server" },
  });
  const departments = deptResult.data?.pages.flatMap((page) => page.data) ?? [];

  useEffect(() => {
    if (deptResult.hasNextPage && !deptQuery.isFetchingNextPage) {
      void deptQuery.fetchNextPage();
    }
  }, [deptQuery, deptResult.hasNextPage]);

  const departmentFilter: CrudFilters =
    selectedDepartment !== "all"
      ? [{ field: "department", operator: "eq", value: selectedDepartment }]
      : [];

  const searchFilters: CrudFilters = searchQuery
    ? [{ field: "name", operator: "contains", value: searchQuery }]
    : [];

  const columns = useMemo<ColumnDef<Subject>[]>(
    () => [
      {
        accessorKey: "code",
        size: 50,
        header: () => <p className="column-title">Code</p>,
        cell: ({ getValue }) => (
          <Badge variant="secondary">{getValue<string>()}</Badge>
        ),
      },
      {
        accessorKey: "name",
        size: 100,
        header: () => <p className="column-title">Subject</p>,
      },
      {
        accessorKey: "department.name",
        size: 100,
        header: () => <p className="column-title">Department</p>,
        cell: ({ row }) => (
          <Badge variant="outline">
            {row.original.department?.name ?? "—"}
          </Badge>
        ),
      },
      {
        accessorKey: "createdAt",
        size: 50,
        header: () => <p className="column-title">Created</p>,
        cell: ({ getValue }) =>
          new Date(getValue<string>()).toLocaleDateString(),
      },
      {
        id: "actions",
        size: 120,
        header: () => <p className="column-title">Actions</p>,
        cell: ({ row }) => (
          <div className="flex gap-1">
            <ShowButton
              resource="subjects"
              recordItemId={row.original.id}
              size="sm"
            />
            <EditButton
              resource="subjects"
              recordItemId={row.original.id}
              size="sm"
            />
            <DeleteButton
              resource="subjects"
              recordItemId={row.original.id}
              size="sm"
            />
          </div>
        ),
      },
    ],
    [],
  );

  const table = useTable<Subject>({
    columns,
    refineCoreProps: {
      resource: "subjects",
      pagination: { pageSize: 10, mode: "server" },
      filters: { permanent: [...departmentFilter, ...searchFilters] },
      syncWithLocation: true,
    },
  });

  return (
    <ListView>
      <Breadcrumb />
      <h1 className="page-title">Subjects</h1>
      <div className="flex flex-col gap-2 mb-4">
        <div className="search-field">
          <Search className="search-icon" />
          <Input
            placeholder="Search by name or code..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Select
            value={selectedDepartment}
            onValueChange={setSelectedDepartment}
          >
            <SelectTrigger className="w-45">
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {departments.map((d) => (
                <SelectItem key={d.id} value={d.name}>
                  {d.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <CreateButton resource="subjects" />
        </div>
      </div>
      <DataTable table={table} />
    </ListView>
  );
};

export default SubjectsList;

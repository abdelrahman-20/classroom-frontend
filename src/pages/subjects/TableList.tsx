// import { useMemo, useState } from "react";
// import { Filter, Search } from "lucide-react";
// import {
//   flexRender,
//   getCoreRowModel,
//   useReactTable,
//   type ColumnDef,
// } from "@tanstack/react-table";
// import {
//   ListView,
//   ListViewHeader,
// } from "@/components/refine-ui/views/list-view";
// import { Input } from "@/components/ui/input";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import type { Subject } from "@/types";
// import { Mock_SUBJECTS } from "./mock-data";
// import { Badge } from "@/components/ui/badge";
// import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
// import { CreateButton } from "@/components/refine-ui/buttons/create";

// const SubjectsList = () => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedDepartment, setSelectedDepartment] = useState("all");

//   const departments = useMemo(
//     () => [
//       "all",
//       ...new Set(Mock_SUBJECTS.map((subject) => subject.department)),
//     ],
//     [],
//   );

//   // Searching & Filtering
//   const filteredSubjects = useMemo(() => {
//     return Mock_SUBJECTS.filter((subject) => {
//       const matchesSearch = [
//         subject.code,
//         subject.name,
//         subject.description,
//         subject.department,
//       ]
//         .join(" ")
//         .toLowerCase()
//         .includes(searchTerm.toLowerCase());

//       const matchesDepartment =
//         selectedDepartment === "all" ||
//         subject.department === selectedDepartment;

//       return matchesSearch && matchesDepartment;
//     });
//   }, [searchTerm, selectedDepartment]);

//   const columns = useMemo<ColumnDef<Subject>[]>(
//     () => [
//       {
//         accessorKey: "code",
//         header: () => <p className="font-bold text-center">Code</p>,
//         cell: ({ row }) => (
//           <Badge className="font-semibold">{row.original.code}</Badge>
//         ),
//       },
//       {
//         accessorKey: "name",
//         header: () => <p className="font-bold text-center">Name</p>,
//       },
//       {
//         accessorKey: "description",
//         header: () => <p className="font-bold text-center">Description</p>,
//         cell: ({ row }) => (
//           <span className="max-w-md text-muted-foreground">
//             {row.original.description}
//           </span>
//         ),
//       },
//       {
//         accessorKey: "department",
//         header: () => <p className="font-bold text-center">Department</p>,
//         cell: ({ row }) => (
//           <Badge className="">{row.original.department}</Badge>
//         ),
//       },
//       {
//         accessorKey: "createdAt",
//         header: () => <p className="font-bold text-center">Created-At</p>,
//         cell: ({ row }) =>
//           new Date(row.original.createdAt).toLocaleDateString("en-US", {
//             month: "short",
//             day: "numeric",
//             year: "numeric",
//           }),
//       },
//     ],
//     [],
//   );

//   const table = useReactTable({
//     data: filteredSubjects,
//     columns,
//     getCoreRowModel: getCoreRowModel(),
//   });

//   return (
//     <ListView className="space-y-6">
//       <Breadcrumb />

//       <h1 className="page-title">Subjects</h1>

//       <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
//         <div className="relative w-full md:flex-2">
//           <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
//           <Input
//             value={searchTerm}
//             onChange={(event) => setSearchTerm(event.target.value)}
//             placeholder="Search subjects..."
//             className="pl-9"
//             aria-label="Search subjects"
//           />
//         </div>

//         <div className="flex w-full gap-3 sm:w-1/2 md:flex-1">
//           <div className="flex items-center gap-2 rounded-md bg-background px-2 py-1.5 flex-1">
//             <Filter className="h-4 w-4 text-muted-foreground" />
//             <Select
//               value={selectedDepartment}
//               onValueChange={setSelectedDepartment}
//             >
//               <SelectTrigger className="w-full border-0 bg-transparent shadow-none focus:ring-0">
//                 <SelectValue placeholder="Department" />
//               </SelectTrigger>
//               <SelectContent>
//                 {departments.map((department) => (
//                   <SelectItem key={department} value={department}>
//                     {department === "all" ? "All Departments" : department}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           </div>

//           <div className="flex-1 p-3">
//             <CreateButton className="w-full" />
//           </div>
//         </div>
//       </div>

//       <div className="rounded-md border">
//         <Table>
//           <TableHeader>
//             {table.getHeaderGroups().map((headerGroup) => (
//               <TableRow key={headerGroup.id}>
//                 {headerGroup.headers.map((header) => (
//                   <TableHead key={header.id}>
//                     {header.isPlaceholder
//                       ? null
//                       : flexRender(
//                           header.column.columnDef.header,
//                           header.getContext(),
//                         )}
//                   </TableHead>
//                 ))}
//               </TableRow>
//             ))}
//           </TableHeader>

//           <TableBody>
//             {table.getRowModel().rows.length > 0 ? (
//               table.getRowModel().rows.map((row) => (
//                 <TableRow key={row.id}>
//                   {row.getVisibleCells().map((cell) => (
//                     <TableCell key={cell.id}>
//                       {flexRender(
//                         cell.column.columnDef.cell,
//                         cell.getContext(),
//                       )}
//                     </TableCell>
//                   ))}
//                 </TableRow>
//               ))
//             ) : (
//               <TableRow>
//                 <TableCell
//                   colSpan={columns.length}
//                   className="py-12 text-center text-muted-foreground"
//                 >
//                   No subjects match your search or selected department.
//                 </TableCell>
//               </TableRow>
//             )}
//           </TableBody>
//         </Table>
//       </div>
//     </ListView>
//   );
// };

// export default SubjectsList;

import { ShowButton } from "@/components/refine-ui/buttons/show";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { ListView } from "@/components/refine-ui/views/list-view";
import { DataTablePagination } from "@/components/refine-ui/data-table/data-table-pagination";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Enrollment } from "@/types";
import { useList } from "@refinedev/core";
import { BookMarked } from "lucide-react";
import { useState } from "react";

const EnrollmentsList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const { query, result } = useList<Enrollment>({
    resource: "enrollments",
    pagination: { currentPage, pageSize, mode: "server" },
    sorters: [{ field: "createdAt", order: "desc" }],
  });

  const enrollments = result.data;
  const total = result.total ?? 0;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));

  if (query.isLoading) {
    return <div className="p-6">Loading your classes...</div>;
  }

  if (query.isError) {
    return (
      <div className="p-6 text-destructive">
        {query.error?.message ?? "Unable to load your enrollments."}
      </div>
    );
  }

  return (
    <ListView>
      <Breadcrumb />
      <div className="flex items-center gap-3">
        <BookMarked className="h-7 w-7 text-primary" />
        <div>
          <h1 className="page-title">My Enrollments</h1>
          <p className="text-muted-foreground">Classes you have joined.</p>
        </div>
      </div>

      {enrollments.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-2 py-12 text-center">
            <BookMarked className="h-10 w-10 text-muted-foreground" />
            <h2 className="text-lg font-semibold">No enrollments yet</h2>
            <p className="text-sm text-muted-foreground">
              Browse classes and select Join Class to see them here.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {enrollments.map((enrollment) => {
            const classDetails = enrollment.class;
            if (!classDetails) return null;

            return (
              <Card key={enrollment.id} className="overflow-hidden">
                {classDetails.bannerUrl ? (
                  <img
                    src={classDetails.bannerUrl}
                    alt={classDetails.name}
                    className="h-40 w-full object-cover"
                  />
                ) : (
                  <div className="flex h-40 items-center justify-center bg-muted">
                    <BookMarked className="h-10 w-10 text-muted-foreground" />
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-start justify-between gap-3">
                    <CardTitle>{classDetails.name}</CardTitle>
                    <Badge
                      variant={
                        classDetails.status === "active"
                          ? "default"
                          : "secondary"
                      }
                    >
                      {classDetails.status}
                    </Badge>
                  </div>
                  <CardDescription>
                    {enrollment.subjectName ?? "Subject"}
                    {enrollment.teacherName
                      ? ` · ${enrollment.teacherName}`
                      : ""}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ShowButton
                    resource="classes"
                    recordItemId={classDetails.id}
                    variant="outline"
                    className="w-full"
                  >
                    View class
                  </ShowButton>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
      {enrollments.length > 0 && (
        <DataTablePagination
          currentPage={currentPage}
          pageCount={pageCount}
          setCurrentPage={setCurrentPage}
          pageSize={pageSize}
          setPageSize={(size) => {
            setPageSize(size);
            setCurrentPage(1);
          }}
          total={total}
        />
      )}
    </ListView>
  );
};

export default EnrollmentsList;

import { EditButton } from "@/components/refine-ui/buttons/edit";
import {
  ShowView,
  ShowViewHeader,
} from "@/components/refine-ui/views/show-view";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Subject } from "@/types";
import { useShow } from "@refinedev/core";

const SubjectShow = () => {
  const { query } = useShow<Subject>({ resource: "subjects" });
  const subject = query.data?.data;

  if (query.isLoading)
    return (
      <ShowView>
        <p>Loading...</p>
      </ShowView>
    );
  if (query.isError)
    return (
      <ShowView>
        <p>Unable to load subject.</p>
      </ShowView>
    );
  if (!subject)
    return (
      <ShowView>
        <p>Not found</p>
      </ShowView>
    );

  return (
    <ShowView>
      <ShowViewHeader resource="subjects" title={subject.name} />
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{subject.name}</CardTitle>
          <EditButton resource="subjects" recordItemId={subject.id} />
        </CardHeader>
        <CardContent className="space-y-2">
          <p>
            <strong>Code:</strong> <Badge>{subject.code}</Badge>
          </p>
          <p>
            <strong>Department:</strong> {subject.department?.name ?? "—"}
          </p>
          <p>
            <strong>Description:</strong> {subject.description ?? "—"}
          </p>
        </CardContent>
      </Card>
    </ShowView>
  );
};

export default SubjectShow;

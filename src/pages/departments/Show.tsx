import { EditButton } from "@/components/refine-ui/buttons/edit";
import { ShowView, ShowViewHeader } from "@/components/refine-ui/views/show-view";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Department } from "@/types";
import { useShow } from "@refinedev/core";

const DepartmentShow = () => {
  const { query } = useShow<Department>({ resource: "departments" });
  const dept = query.data?.data;

  if (query.isLoading) return <ShowView><p>Loading...</p></ShowView>;
  if (!dept) return <ShowView><p>Not found</p></ShowView>;

  return (
    <ShowView>
      <ShowViewHeader resource="departments" title={dept.name} />
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{dept.name}</CardTitle>
          <EditButton resource="departments" recordItemId={dept.id} />
        </CardHeader>
        <CardContent className="space-y-2">
          <p><strong>Code:</strong> <Badge>{dept.code}</Badge></p>
          <p><strong>Description:</strong> {dept.description ?? "—"}</p>
          <p><strong>Subjects:</strong> {dept.subjectCount ?? 0}</p>
        </CardContent>
      </Card>
    </ShowView>
  );
};

export default DepartmentShow;

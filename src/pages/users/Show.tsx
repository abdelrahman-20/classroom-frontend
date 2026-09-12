import { EditButton } from "@/components/refine-ui/buttons/edit";
import { ShowView, ShowViewHeader } from "@/components/refine-ui/views/show-view";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "@/types";
import { useShow } from "@refinedev/core";

const UserShow = () => {
  const { query } = useShow<User>({ resource: "users" });
  const user = query.data?.data;

  if (query.isLoading) return <ShowView><p>Loading...</p></ShowView>;
  if (!user) return <ShowView><p>User not found</p></ShowView>;

  return (
    <ShowView>
      <ShowViewHeader resource="users" title={user.name} />
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{user.name}</CardTitle>
          <EditButton resource="users" recordItemId={user.id} />
        </CardHeader>
        <CardContent className="space-y-2">
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Role:</strong> <Badge>{user.role}</Badge></p>
          <p><strong>Joined:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
        </CardContent>
      </Card>
    </ShowView>
  );
};

export default UserShow;

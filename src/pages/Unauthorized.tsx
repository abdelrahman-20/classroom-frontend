import { ShieldAlert } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function Unauthorized() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center p-6">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Access restricted</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <ShieldAlert />
            <AlertTitle>You don't have access to this page</AlertTitle>
            <AlertDescription>
              Contact an administrator if you believe you should be able to view
              this page.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}

export default Unauthorized;

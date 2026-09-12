import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { EditView } from "@/components/refine-ui/views/edit-view";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { userSchema } from "@/lib/schema";
import { User, UserRole } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { HttpError, useBack } from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";
import { z } from "zod";

type UserFormValues = z.infer<typeof userSchema>;

const UserEdit = () => {
  const back = useBack();
  const form = useForm<User, HttpError, UserFormValues>({
    resolver: zodResolver(userSchema),
    refineCoreProps: { resource: "users", action: "edit" },
  });

  const {
    refineCore: { onFinish, formLoading },
    handleSubmit,
    control,
  } = form;

  return (
    <EditView>
      <Breadcrumb />
      <h1 className="page-title">Edit User</h1>
      <Form {...form}>
        <form onSubmit={handleSubmit(onFinish)} className="space-y-4 max-w-lg">
          <FormField
            control={control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={UserRole.ADMIN}>Admin</SelectItem>
                    <SelectItem value={UserRole.TEACHER}>Teacher</SelectItem>
                    <SelectItem value={UserRole.STUDENT}>Student</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex gap-2">
            <Button type="submit" disabled={formLoading}>
              Save
            </Button>
            <Button type="button" variant="outline" onClick={() => back()}>
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    </EditView>
  );
};

export default UserEdit;

import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { EditView } from "@/components/refine-ui/views/edit-view";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { departmentSchema } from "@/lib/schema";
import { Department } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useBack } from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";

const DepartmentEdit = () => {
  const back = useBack();
  const form = useForm<Department>({
    resolver: zodResolver(departmentSchema),
    refineCoreProps: { resource: "departments", action: "edit" },
  });

  const { refineCore: { onFinish, formLoading }, handleSubmit, control } = form;

  return (
    <EditView>
      <Breadcrumb />
      <h1 className="page-title">Edit Department</h1>
      <Form {...form}>
        <form onSubmit={handleSubmit(onFinish)} className="space-y-4 max-w-lg">
          <FormField control={control} name="name" render={({ field }) => (
            <FormItem><FormLabel>Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={control} name="code" render={({ field }) => (
            <FormItem><FormLabel>Code</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={control} name="description" render={({ field }) => (
            <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem>
          )} />
          <div className="flex gap-2">
            <Button type="submit" disabled={formLoading}>Save</Button>
            <Button type="button" variant="outline" onClick={() => back()}>Cancel</Button>
          </div>
        </form>
      </Form>
    </EditView>
  );
};

export default DepartmentEdit;

import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { CreateView } from "@/components/refine-ui/views/create-view";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { departmentSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useBack } from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";

const DepartmentCreate = () => {
  const back = useBack();
  const form = useForm({
    resolver: zodResolver(departmentSchema),
    refineCoreProps: { resource: "departments", action: "create" },
  });

  const { refineCore: { onFinish, formLoading }, handleSubmit, control } = form;

  return (
    <CreateView>
      <Breadcrumb />
      <h1 className="page-title">Create Department</h1>
      <Form {...form}>
        <form onSubmit={handleSubmit(onFinish)} className="space-y-4 max-w-lg">
          <FormField control={control} name="name" render={({ field }) => (
            <FormItem><FormLabel>Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={control} name="code" render={({ field }) => (
            <FormItem><FormLabel>Code</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={control} name="description" render={({ field }) => (
            <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <div className="flex gap-2">
            <Button type="submit" disabled={formLoading}>Create</Button>
            <Button type="button" variant="outline" onClick={() => back()}>Cancel</Button>
          </div>
        </form>
      </Form>
    </CreateView>
  );
};

export default DepartmentCreate;

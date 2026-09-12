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
import { Textarea } from "@/components/ui/textarea";
import { subjectSchema } from "@/lib/schema";
import { Department, Subject } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { HttpError, useBack, useInfiniteList } from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";
import { useEffect } from "react";
import { z } from "zod";

type SubjectFormValues = z.infer<typeof subjectSchema>;

const SubjectEdit = () => {
  const back = useBack();
  const { query, result } = useInfiniteList<Department>({
    resource: "departments",
    pagination: { pageSize: 100, mode: "server" },
  });
  const departments = result.data?.pages.flatMap((page) => page.data) ?? [];

  useEffect(() => {
    if (result.hasNextPage && !query.isFetchingNextPage) {
      void query.fetchNextPage();
    }
  }, [query, result.hasNextPage]);

  const form = useForm<Subject, HttpError, SubjectFormValues>({
    resolver: zodResolver(subjectSchema),
    refineCoreProps: { resource: "subjects", action: "edit" },
  });

  const {
    refineCore: { onFinish, formLoading },
    handleSubmit,
    control,
  } = form;

  return (
    <EditView>
      <Breadcrumb />
      <h1 className="page-title">Edit Subject</h1>
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
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Code</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="departmentId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Department</FormLabel>
                <Select
                  onValueChange={(v) => field.onChange(Number(v))}
                  value={String(field.value ?? "")}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {departments.map((d) => (
                      <SelectItem key={d.id} value={String(d.id)}>
                        {d.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea {...field} value={field.value ?? ""} />
                </FormControl>
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

export default SubjectEdit;

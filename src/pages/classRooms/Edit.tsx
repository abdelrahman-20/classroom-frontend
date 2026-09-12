import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { EditView } from "@/components/refine-ui/views/edit-view";
import UploadWidget from "@/components/UploadWidget";
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
import { classSchema } from "@/lib/schema";
import { ClassDetails, Subject, User } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { HttpError, useBack, useList } from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";
import { Controller } from "react-hook-form";
import { z } from "zod";

type ClassFormValues = z.infer<typeof classSchema>;

const ClassEdit = () => {
  const back = useBack();
  const { query: subjectsQuery } = useList<Subject>({
    resource: "subjects",
    pagination: { pageSize: 100 },
  });
  const { query: teachersQuery } = useList<User>({
    resource: "users",
    filters: [{ field: "role", operator: "eq", value: "teacher" }],
    pagination: { pageSize: 100 },
  });

  const form = useForm<ClassDetails, HttpError, ClassFormValues>({
    resolver: zodResolver(classSchema),
    refineCoreProps: { resource: "classes", action: "edit" },
  });

  const {
    refineCore: { onFinish, formLoading },
    handleSubmit,
    control,
    formState: { errors },
  } = form;

  return (
    <EditView>
      <Breadcrumb />
      <h1 className="page-title">Edit Class</h1>
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
          <FormField
            control={control}
            name="subjectId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subject</FormLabel>
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
                    {(subjectsQuery.data?.data ?? []).map((s) => (
                      <SelectItem key={s.id} value={String(s.id)}>
                        {s.name}
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
            name="teacherId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Teacher</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value ?? ""}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {(teachersQuery.data?.data ?? []).map((t) => (
                      <SelectItem key={t.id} value={t.id}>
                        {t.name}
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
            name="capacity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Capacity</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <Controller
            control={control}
            name="bannerUrl"
            render={({ field: urlField }) => (
              <Controller
                control={control}
                name="bannerCldPubId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Banner</FormLabel>
                    <FormControl>
                      <UploadWidget
                        value={
                          urlField.value
                            ? {
                                url: urlField.value,
                                publicId: field.value ?? "",
                              }
                            : null
                        }
                        onChange={(v) => {
                          urlField.onChange(v?.url ?? "");
                          field.onChange(v?.publicId ?? "");
                        }}
                      />
                    </FormControl>
                    {errors.bannerUrl && (
                      <p className="text-destructive text-sm">
                        {errors.bannerUrl.message?.toString()}
                      </p>
                    )}
                    {errors.bannerCldPubId && (
                      <p className="text-destructive text-sm">
                        {errors.bannerCldPubId.message?.toString()}
                      </p>
                    )}
                  </FormItem>
                )}
              />
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

export default ClassEdit;

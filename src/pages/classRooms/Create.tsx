import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { classSchema } from "@/lib/schema";
import { CreateView } from "@/components/refine-ui/views/create-view";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { useBack } from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";
import {
  Form,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { subjects, teachers } from "./mock-data";
import UploadWidget from "@/components/UploadWidget";

function ClassCreate() {
  const back = useBack();

  const form = useForm({
    resolver: zodResolver(classSchema),
    refineCoreProps: {
      resource: "classes",
      action: "create",
    },
  });
  const {
    handleSubmit,
    formState: { isSubmitting, errors },
    control,
  } = form;

  function onSubmit(data: z.infer<typeof classSchema>) {
    try {
      toast("You submitted the following values:", {
        description: (
          <pre className="mt-2 w-[320px] overflow-x-auto rounded-md bg-code p-4 text-code-foreground">
            <code>{JSON.stringify(data, null, 2)}</code>
          </pre>
        ),
        position: "bottom-right",
        classNames: {
          content: "flex flex-col gap-2",
        },
        style: {
          "--border-radius": "calc(var(--radius)  + 4px)",
        } as React.CSSProperties,
      });
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  }

  const bannerPublicId = form.watch("bannerCldPubId");
  const setBannerImg = (file: any, field: any) => {
    if (file) {
      field.onChange(file.url);
      form.setValue("bannerCldPubId", file.publicId, {
        shouldValidate: true,
        shouldDirty: true,
      });
    } else {
      field.onChange("");
      form.setValue("bannerCldPubId", "", {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  };

  return (
    <CreateView>
      <Breadcrumb />
      <h1 className="page-title">Create New Class</h1>

      <div className="intro-row">
        <p>Fill out form data to add new class</p>
        <Button onClick={back}>Go Back</Button>
      </div>

      <div>
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Class details</CardTitle>
            <CardDescription>
              Enter information for the new class
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Form {...form}>
              <form
                id="add-class-form"
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-5"
              >
                {/* Image-Upload */}
                <Controller
                  name="bannerUrl"
                  control={control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Banner-Image
                        <span className="text-orange-500"> *</span>
                      </FormLabel>

                      <FormControl>
                        <UploadWidget
                          value={
                            field.value
                              ? { url: field.value, publicId: bannerPublicId }
                              : null
                          }
                          onChange={(file: any) => setBannerImg(file, field)}
                        />
                      </FormControl>

                      <FormMessage />
                      {errors.bannerCldPubId && !errors.bannerUrl && (
                        <p className="text-sm text-red-600 mt-1">
                          {errors.bannerCldPubId.message?.toString()}
                        </p>
                      )}
                    </FormItem>
                  )}
                />

                {/* Classname */}
                <Controller
                  name="name"
                  control={control}
                  defaultValue=""
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>
                        Name<span className="text-orange-500"> *</span>
                      </FormLabel>
                      <FormControl>
                        <input
                          {...field}
                          placeholder="Class Name | Ex: Web Development Basics"
                          className="w-full rounded-md border px-3 py-2 bg-muted"
                        />
                      </FormControl>
                      {fieldState.error?.message && (
                        <p className="text-sm text-red-600 mt-1">
                          {fieldState.error.message}
                        </p>
                      )}
                    </FormItem>
                  )}
                />

                {/* Subjects And Teachers */}
                <div className="grid md:grid-cols-2 gap-4">
                  <Controller
                    name="subjectId"
                    control={control}
                    defaultValue={undefined}
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <FormLabel>
                          Subject<span className="text-orange-500"> *</span>
                        </FormLabel>

                        <Select
                          onValueChange={(value) =>
                            field.onChange(
                              value === "" ? undefined : Number(value),
                            )
                          }
                          value={
                            field.value != null ? field.value.toString() : ""
                          }
                        >
                          <FormControl>
                            <SelectTrigger className="w-full rounded-md border px-3 py-2 bg-muted">
                              <SelectValue placeholder="Select A Subject" />
                            </SelectTrigger>
                          </FormControl>

                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Subjects</SelectLabel>
                              {subjects.map((subject) => (
                                <SelectItem
                                  key={subject.id}
                                  value={subject.id.toString()}
                                >
                                  {subject.name}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                        {fieldState.error?.message && (
                          <p className="text-sm text-red-600 mt-1">
                            {fieldState.error.message}
                          </p>
                        )}
                      </FormItem>
                    )}
                  />

                  <Controller
                    name="teacherId"
                    control={control}
                    defaultValue={undefined}
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <FormLabel>
                          Teacher<span className="text-orange-500"> *</span>
                        </FormLabel>

                        <Select
                          onValueChange={(value) =>
                            field.onChange(
                              value === "" ? undefined : value.toString(),
                            )
                          }
                          value={
                            field.value != null ? field.value.toString() : ""
                          }
                        >
                          <FormControl>
                            <SelectTrigger className="w-full rounded-md border px-3 py-2 bg-muted">
                              <SelectValue placeholder="Select A Teacher" />
                            </SelectTrigger>
                          </FormControl>

                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Teacher</SelectLabel>
                              {teachers.map((teacher) => (
                                <SelectItem
                                  key={teacher.id}
                                  value={teacher.id.toString()}
                                >
                                  {teacher.name}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                        {fieldState.error?.message && (
                          <p className="text-sm text-red-600 mt-1">
                            {fieldState.error.message}
                          </p>
                        )}
                      </FormItem>
                    )}
                  />
                </div>

                {/* Capacity And Status */}
                <div className="grid md:grid-cols-2 gap-4">
                  {/* Capacity */}
                  <Controller
                    name="capacity"
                    control={control}
                    defaultValue={0}
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <FormLabel>
                          Capacity<span className="text-orange-500"> *</span>
                        </FormLabel>
                        <FormControl>
                          <input
                            type="number"
                            min={0}
                            {...field}
                            value={field.value ?? ""}
                            onChange={(e) =>
                              field.onChange(
                                e.target.value === ""
                                  ? undefined
                                  : Number(e.target.value),
                              )
                            }
                            placeholder="Max students (e.g. 30)"
                            className="w-full rounded-md border px-3 py-2 bg-muted"
                          />
                        </FormControl>
                        {fieldState.error?.message && (
                          <p className="text-sm text-red-600 mt-1">
                            {fieldState.error.message}
                          </p>
                        )}
                      </FormItem>
                    )}
                  />

                  {/* Status */}
                  <Controller
                    name="status"
                    control={control}
                    defaultValue="active"
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <FormLabel>
                          Status<span className="text-orange-500"> *</span>
                        </FormLabel>
                        <Select
                          onValueChange={(value) => field.onChange(value)}
                          value={field.value ?? ""}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full rounded-md border px-3 py-2 bg-muted">
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>

                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Status</SelectLabel>
                              <SelectItem value="active">Active</SelectItem>
                              <SelectItem value="inactive">Inactive</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                        {fieldState.error?.message && (
                          <p className="text-sm text-red-600 mt-1">
                            {fieldState.error.message}
                          </p>
                        )}
                      </FormItem>
                    )}
                  />
                </div>

                {/* Description */}
                <Controller
                  name="description"
                  control={control}
                  defaultValue=""
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <textarea
                          {...field}
                          placeholder="Provide a short description of the class"
                          className="w-full rounded-md border px-3 py-2 bg-muted"
                          rows={2}
                        />
                      </FormControl>
                      {fieldState.error?.message && (
                        <p className="text-sm text-red-600 mt-1">
                          {fieldState.error.message}
                        </p>
                      )}
                    </FormItem>
                  )}
                />

                {/* Submit And Reset Button */}
                <div className="pt-4 flex justify-start gap-5">
                  {/* Submit */}
                  <Button
                    type="submit"
                    form="add-class-form"
                    // disabled={isSubmitting}
                    onClick={handleSubmit(onSubmit)}
                    className="w-[20%]"
                  >
                    Create
                  </Button>

                  {/* Reset */}
                  <Button
                    type="reset"
                    variant="destructive"
                    className="w-[20%]"
                    onClick={() => form.reset()}
                  >
                    Reset
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </CreateView>
  );
}

export default ClassCreate;

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "../ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { Task } from "@/features/tasks/task.types";

const schema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(200),

  description: z
    .string()
    .trim()
    .max(2000)
    .optional()
    .or(z.literal("")), // allow empty string from textarea

  priority: z.enum(["LOW", "MEDIUM", "HIGH"]),

  status: z.enum(["TODO", "IN_PROGRESS", "DONE"]),

  // Form field gives "YYYY-MM-DD" or "" -> transform to ISO or undefined
  dueDate: z
    .string()
    .optional()
    .transform((value) => {
      if (!value) return undefined;
      // interpret as local date at midnight, then to ISO string
      const date = new Date(value);
      return isNaN(date.getTime()) ? undefined : date.toISOString();
    }),
});

export type TaskFormValues = z.infer<typeof schema>;

interface Props {
  task?: Task;
  isSubmitting: boolean;
  submitLabel: string;
  onSubmit: (values: TaskFormValues) => void | Promise<void>;
}

const TaskForm = ({
  task,
  onSubmit,
  isSubmitting,
  submitLabel,
}: Props) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: task?.title ?? "",
      description: task?.description ?? "",
      priority: task?.priority ?? "MEDIUM",
      status: task?.status ?? "TODO",
      // backend stores ISO datetime; input[type=date] needs YYYY-MM-DD
      dueDate: task?.dueDate
        ? task.dueDate.slice(0, 10)
        : "",
    },
  });

  useEffect(() => {
    if (task) {
      reset({
        title: task.title,
        description: task.description ?? "",
        priority: task.priority,
        status: task.status,
        dueDate: task.dueDate
          ? task.dueDate.slice(0, 10)
          : "",
      });
    }
  }, [task, reset]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4"
    >
      <div>
        <Input
          placeholder="Task title"
          {...register("title")}
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-500">
            {errors.title.message}
          </p>
        )}
      </div>

      <div>
        <Textarea
          placeholder="Description"
          rows={4}
          {...register("description")}
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-500">
            {errors.description.message}
          </p>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Select
          value={watch("priority")}
          onValueChange={(value) =>
            setValue(
              "priority",
              value as TaskFormValues["priority"]
            )
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent align="start" className="p-0">
            <SelectItem value="LOW">Low</SelectItem>
            <SelectItem value="MEDIUM">Medium</SelectItem>
            <SelectItem value="HIGH">High</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={watch("status")}
          onValueChange={(value) =>
            setValue(
              "status",
              value as TaskFormValues["status"]
            )
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="TODO">Todo</SelectItem>
            <SelectItem value="IN_PROGRESS">
              In Progress
            </SelectItem>
            <SelectItem value="DONE">Done</SelectItem>
          </SelectContent>
        </Select>

        <Input
          type="date"
          {...register("dueDate")}
        />
        {errors.dueDate && (
          <p className="mt-1 text-sm text-red-500">
            {errors.dueDate.message as string}
          </p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full border bg-gray-100 hover:bg-gray-200 cursor-pointer dark:bg-stone-800 hover:dark:bg-stone-900"
        disabled={isSubmitting}
      >
        {submitLabel}
      </Button>
    </form>
  );
};

export default React.memo(TaskForm);

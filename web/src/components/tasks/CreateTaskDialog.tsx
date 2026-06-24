import React, { useCallback, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Button,
} from "@/components/ui/button";

import TaskForm from "./TaskForm";

import {
  useCreateTask,
} from "@/features/tasks/task.hooks";
import { Plus } from "lucide-react";
import type { CreateTaskPayload } from "@/features/tasks/task.types";

const CreateTaskDialog = () => {

  const [open, setOpen] =
    useState(false);

  const mutation =
    useCreateTask();
const handleSubmit = useCallback(
  async (values: CreateTaskPayload) => {
    await mutation.mutateAsync(values);
    setOpen(false);
  },
  [mutation, setOpen]
);
  return (
    <Dialog
      open={open}
      onOpenChange={
        setOpen
      }
    >
      <DialogTrigger
        asChild
      >
        <Button variant={"outline"} className="hover:bg-gray-100 cursor-pointer dark:hover:bg-stone-900 m-2">
          <Plus />
          Create Task
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Create Task
          </DialogTitle>
        </DialogHeader>

        <TaskForm
          submitLabel="Create Task"
          isSubmitting={
            mutation.isPending
          }
          onSubmit={handleSubmit}
        />
      </DialogContent>
    </Dialog>
  );
};

export default React.memo(CreateTaskDialog);
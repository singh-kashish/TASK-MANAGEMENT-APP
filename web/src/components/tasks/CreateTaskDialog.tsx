import { useState } from "react";

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

const CreateTaskDialog = () => {

  const [open, setOpen] =
    useState(false);

  const mutation =
    useCreateTask();

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
        <Button variant={"outline"} className="hover:bg-gray-100 hover:cursor-pointer dark:hover:bg-stone-900">
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
          onSubmit={async (
            values
          ) => {
            await mutation.mutateAsync(
              values
            );

            setOpen(
              false
            );
          }}
        />
      </DialogContent>
    </Dialog>
  );
};

export default CreateTaskDialog;
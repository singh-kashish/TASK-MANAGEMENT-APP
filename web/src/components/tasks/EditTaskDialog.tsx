import {
  useState,
} from "react";

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

import type {
  Task,
} from "@/features/tasks/task.types";

import TaskForm from "./TaskForm";

import {
  useUpdateTask,
} from "@/features/tasks/task.hooks";

interface Props {
  task: Task;
}

const EditTaskDialog = ({
  task,
}: Props) => {

  const [open, setOpen] =
    useState(false);

  const mutation =
    useUpdateTask();

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
        <Button
          variant="outline"
          className="px-2 py-1 hover:bg-gray-100 hover:cursor-pointer dark:hover:bg-stone-900"
        >
          Edit
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Edit Task
          </DialogTitle>
        </DialogHeader>

        <TaskForm
          task={task}
          submitLabel="Save Changes"
          isSubmitting={
            mutation.isPending
          }
          onSubmit={async (
            values
          ) => {
            await mutation.mutateAsync(
              {
                id: task._id,
                payload:
                  values,
              }
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

export default EditTaskDialog;
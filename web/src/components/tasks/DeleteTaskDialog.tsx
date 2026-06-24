import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import {
  Button,
} from "@/components/ui/button";

import {
  useDeleteTask,
} from "@/features/tasks/task.hooks";

interface Props {
  taskId: string;
}

const DeleteTaskDialog = ({
  taskId,
}: Props) => {

  const deleteMutation =
    useDeleteTask();

  const handleDelete =
    async () => {
      await deleteMutation.mutateAsync(
        taskId
      );
    };

  return (
    <AlertDialog>

      <AlertDialogTrigger
        asChild
      >
        <Button
          variant="destructive" className="bg-red-400 cursor-pointer hover:bg-red-500 px-2 py-1 rounded-lg"
        >
          Delete
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>

        <AlertDialogHeader>

          <AlertDialogTitle>
            Delete Task
          </AlertDialogTitle>

          <AlertDialogDescription>
            This action cannot be
            undone.
          </AlertDialogDescription>

        </AlertDialogHeader>

        <AlertDialogFooter>

          <AlertDialogCancel className="hover:bg-gray-100 hover:cursor-pointer dark:hover:bg-stone-900">
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={
              handleDelete
            }
            className="bg-red-400 cursor-pointer hover:bg-red-500 px-2 py-1 rounded-lg"
          >
            Delete
          </AlertDialogAction>

        </AlertDialogFooter>

      </AlertDialogContent>

    </AlertDialog>
  );
};

export default DeleteTaskDialog;
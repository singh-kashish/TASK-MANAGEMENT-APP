import {Card,CardContent,CardHeader,CardTitle,} from "../ui/card";
import {Badge} from "../ui/badge";
import type {Task} from "@/features/tasks/task.types";
import EditTaskDialog from "./EditTaskDialog";
import DeleteTaskDialog from "./DeleteTaskDialog";
interface Props {
  task: Task;
}
const priorityVariant = {
  LOW: "bg-green-100 text-green-700",
  MEDIUM: "bg-amber-100 text-amber-700",
  HIGH: "bg-red-100 text-red-700",
};
const toDoVariant = {
  DONE:"bg-green-100 text-green-700",

  IN_PROGRESS:"bg-amber-100 text-amber-700",

  TODO:"bg-red-100 text-red-700",
};
const TaskCard = ({
  task,
}: Props) => {
  return (
    <article className="mx-2">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div>
              <CardTitle>
                {task.title}
              </CardTitle>

              <p className="mt-2 text-sm text-muted-foreground">
                {
                  task.description
                }
              </p>
            </div>

            <Badge
              className={
                priorityVariant[
                  task
                    .priority
                ]
              }
            >
              {
                task.priority
              }
            </Badge>

          </div>

        </CardHeader>

        <CardContent>

          <div className="flex items-center justify-between ">
              
            <Badge
              className={
                toDoVariant[
                  task
                    .status
                ]
              }
            >
              {
                task.status
              }
            </Badge>
            
            <p className="text-sm text-muted-foreground">

             <span className="text-red-500 text-md font-bold">Due: </span>

              {task.dueDate
                ? new Date(
                    task.dueDate
                  ).toLocaleDateString()
                : "No due date"}

            </p>

            <div className="flex gap-2">

              <EditTaskDialog
                task={task}
              />

              <DeleteTaskDialog
                taskId={
                  task._id
                }
              />

            </div>

          </div>

        </CardContent>

      </Card>
    </article>
  );
};

export default TaskCard;
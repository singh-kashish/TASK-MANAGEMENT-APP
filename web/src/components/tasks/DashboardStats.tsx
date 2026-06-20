import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../ui/card";

interface Props {
  stats: {
    total: number;
    todo: number;
    inProgress: number;
    completed: number;
  };
}

export default function DashboardStats({
  stats,
}: Props) {
  return (
    <div
      className="
        grid
        gap-4
        sm:grid-cols-2
        xl:grid-cols-4
      "
    >
      <StatCard
        title="Total Tasks"
        value={
          stats.total
        }
      />

      <StatCard
        title="Todo"
        value={
          stats.todo
        }
      />

      <StatCard
        title="In Progress"
        value={
          stats.inProgress
        }
      />

      <StatCard
        title="Completed"
        value={
          stats.completed
        }
      />
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: number;
}

function StatCard({
  title,
  value,
}: StatCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle
          className="
            text-sm
            font-medium
            text-muted-foreground
          "
        >
          {title}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <p
          className="
            text-3xl
            font-bold
          "
        >
          {value}
        </p>
      </CardContent>
    </Card>
  );
}
import mongoose from "mongoose";

import { TaskModel } from "../models/task.model";

export interface TaskStats {
  total: number;
  todo: number;
  inProgress: number;
  completed: number;
  pending: number;
  overdue: number;
  completionRate: number;
}

export const getTaskStats = async (
  userId: string
): Promise<TaskStats> => {
  const now = new Date();

  const [stats] =
    await TaskModel.aggregate([
      {
        $match: {
          userId:
            new mongoose.Types.ObjectId(
              userId
            ),
        },
      },

      {
        $group: {
          _id: null,

          total: {
            $sum: 1,
          },

          todo: {
            $sum: {
              $cond: [
                {
                  $eq: [
                    "$status",
                    "TODO",
                  ],
                },
                1,
                0,
              ],
            },
          },

          inProgress: {
            $sum: {
              $cond: [
                {
                  $eq: [
                    "$status",
                    "IN_PROGRESS",
                  ],
                },
                1,
                0,
              ],
            },
          },

          completed: {
            $sum: {
              $cond: [
                {
                  $eq: [
                    "$status",
                    "DONE",
                  ],
                },
                1,
                0,
              ],
            },
          },

          pending: {
            $sum: {
              $cond: [
                {
                  $ne: [
                    "$status",
                    "DONE",
                  ],
                },
                1,
                0,
              ],
            },
          },

          overdue: {
            $sum: {
              $cond: [
                {
                  $and: [
                    {
                      $ne: [
                        "$status",
                        "DONE",
                      ],
                    },
                    {
                      $ne: [
                        "$dueDate",
                        null,
                      ],
                    },
                    {
                      $lt: [
                        "$dueDate",
                        now,
                      ],
                    },
                  ],
                },
                1,
                0,
              ],
            },
          },
        },
      },

      {
        $project: {
          _id: 0,

          total: 1,
          todo: 1,
          inProgress: 1,
          completed: 1,
          pending: 1,
          overdue: 1,

          completionRate: {
            $round: [
              {
                $multiply: [
                  {
                    $cond: [
                      {
                        $eq: [
                          "$total",
                          0,
                        ],
                      },
                      0,
                      {
                        $divide: [
                          "$completed",
                          "$total",
                        ],
                      },
                    ],
                  },
                  100,
                ],
              },
              0,
            ],
          },
        },
      },
    ]);

  return (
    stats ?? {
      total: 0,
      todo: 0,
      inProgress: 0,
      completed: 0,
      pending: 0,
      overdue: 0,
      completionRate: 0,
    }
  );
};
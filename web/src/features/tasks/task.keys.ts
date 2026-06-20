export const taskKeys = {
  all: ["tasks"] as const,

  lists: () =>
    [...taskKeys.all, "list"] as const,

  list: (
    filters: unknown
  ) =>
    [
      ...taskKeys.lists(),
      filters,
    ] as const,
};
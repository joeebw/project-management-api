const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
};

export const getFormmatedTasks = (tasks, users) => {
  return tasks.reduce((acc, task) => {
    const statusMap = {
      to_do: "todo",
      work_in_progress: "in-progress",
      under_review: "under-review",
      completed: "completed",
    };

    const status = statusMap[task.status];

    const formattedTaskObj = {
      id: task.id,
      title: task.title,
      description: task.description,
      tags: task.tags,
      startDate: formatDate(task.start_date),
      endDate: formatDate(task.end_date),
      assignees: task.assignees.map((assigneeId) => {
        const user = users.find((user) => user.id === assigneeId);
        return user.userName;
      }),
    };

    if (!acc[status]) {
      acc[status] = [];
    }

    acc[status].push(formattedTaskObj);

    return acc;
  }, {});
};

export const normaliceStatusFormatting = (updates) => {
  const statusMap = {
    todo: "to_do",
    "in-progress": "work_in_progress",
    "under-review": "under_review",
    completed: "completed",
  };

  updates.status = statusMap[updates.status];
};

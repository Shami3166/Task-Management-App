import React from "react";
import { useTask } from "../context/TaskContext";
// import { useAuth } from "../context/AuthContext";
import TaskItem from "./TaskItem";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";
import { Plus, Filter, Inbox } from "lucide-react";

interface TaskListProps {
  onAddTask: () => void;
  onEditTask: (task: unknown) => void;
}

const TaskList: React.FC<TaskListProps> = ({ onAddTask, onEditTask }) => {
  const { filteredTasks, isLoading, tasks } = useTask();
  // const { user } = useAuth(); // This line can be removed since user is not used

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="p-4 space-y-3">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <div className="flex space-x-2">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-20" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
          <Inbox className="h-10 w-10 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">
          No tasks yet
        </h3>
        <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
          Get started by creating your first task. Organize your work and stay
          productive!
        </p>
        <Button
          onClick={onAddTask}
          className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
        >
          <Plus className="mr-2 h-4 w-4" />
          Create Your First Task
        </Button>
      </div>
    );
  }

  if (filteredTasks.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
          <Filter className="h-10 w-10 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">
          No tasks found
        </h3>
        <p className="text-muted-foreground mb-6">
          Try adjusting your filters to see more tasks.
        </p>
        <Button variant="outline" onClick={onAddTask}>
          <Plus className="mr-2 h-4 w-4" />
          Create New Task
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Your Tasks</h2>
          <p className="text-muted-foreground">
            {filteredTasks.length} of {tasks.length} tasks shown
          </p>
        </div>
        <Button
          onClick={onAddTask}
          className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Task
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
        {filteredTasks.map((task) => (
          <TaskItem key={task._id} task={task} onEdit={onEditTask} />
        ))}
      </div>
    </div>
  );
};

export default TaskList;

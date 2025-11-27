import React from "react";
import { useTask } from "../context/TaskContext";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Calendar, Edit, Trash2, Clock } from "lucide-react";
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
} from "./ui/alert-dialog";
import { PRIORITY_OPTIONS, STATUS_OPTIONS } from "../utils/constants";
import type { Task } from "@/types/task";

interface TaskItemProps {
  task: Task;
  onEdit: (task: Task) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onEdit }) => {
  const { deleteTask, isLoading } = useTask();

  const getPriorityColor = (priority: string) => {
    const option = PRIORITY_OPTIONS.find((opt) => opt.value === priority);
    return option?.color || "bg-gray-100 text-gray-800";
  };

  const getStatusColor = (status: string) => {
    const option = STATUS_OPTIONS.find((opt) => opt.value === status);
    return option?.color || "bg-gray-100 text-gray-800";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const isOverdue =
    task.dueDate &&
    new Date(task.dueDate) < new Date() &&
    task.status !== "completed";

  return (
    <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-primary group cursor-pointer">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg truncate text-foreground group-hover:text-primary transition-colors">
              {task.title}
            </h3>
            {task.description && (
              <p className="text-muted-foreground mt-2 line-clamp-2 text-sm">
                {task.description}
              </p>
            )}
          </div>
          <div className="flex space-x-1 ml-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(task)}
              className="h-8 w-8 hover:bg-blue-50 hover:text-blue-600 cursor-pointer transition-colors"
              disabled={isLoading}
            >
              <Edit className="h-4 w-4" />
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 cursor-pointer transition-colors"
                  disabled={isLoading}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    the task "
                    <span className="font-semibold">{task.title}</span>" from
                    your task list.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="cursor-pointer">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => deleteTask(task._id)}
                    className="bg-red-600 hover:bg-red-700 cursor-pointer"
                  >
                    Delete Task
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="flex flex-wrap gap-2 mb-3">
          <Badge
            variant="secondary"
            className={getPriorityColor(task.priority)}
          >
            {PRIORITY_OPTIONS.find((opt) => opt.value === task.priority)
              ?.label || task.priority}
          </Badge>
          <Badge variant="secondary" className={getStatusColor(task.status)}>
            {STATUS_OPTIONS.find((opt) => opt.value === task.status)?.label ||
              task.status}
          </Badge>
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center space-x-4">
            {task.dueDate && (
              <div
                className={`flex items-center space-x-1 ${
                  isOverdue ? "text-red-600 font-medium" : ""
                }`}
              >
                <Calendar className="h-3 w-3" />
                <span>{formatDate(task.dueDate)}</span>
                {isOverdue && <Clock className="h-3 w-3 ml-1" />}
              </div>
            )}
            <div className="flex items-center space-x-1">
              <span>Created:</span>
              <span>{formatDate(task.createdAt)}</span>
            </div>
          </div>

          {isOverdue && (
            <Badge
              variant="outline"
              className="text-red-600 border-red-200 bg-red-50"
            >
              Overdue
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskItem;

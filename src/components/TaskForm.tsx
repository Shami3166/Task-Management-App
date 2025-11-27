import React, { useEffect } from "react";
import { useTask } from "../context/TaskContext";
import { useAuth } from "../context/AuthContext";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "./ui/sheet";
import { Calendar, Loader2, X } from "lucide-react";
import {
  PRIORITY_OPTIONS,
  STATUS_OPTIONS,
  TASK_FORM_DEFAULT_VALUES,
} from "../utils/constants";
import type { CreateTaskData } from "@/types/task";

interface TaskFormProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "create" | "edit";
}

const TaskForm: React.FC<TaskFormProps> = ({ isOpen, onClose, mode }) => {
  const { selectedTask, createTask, updateTask, selectTask } = useTask(); // Removed isLoading
  const { user } = useAuth();

  const [formData, setFormData] = React.useState<CreateTaskData>(
    TASK_FORM_DEFAULT_VALUES
  ); // Fixed this line
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  useEffect(() => {
    if (mode === "edit" && selectedTask) {
      setFormData({
        title: selectedTask.title,
        description: selectedTask.description || "",
        priority: selectedTask.priority,
        status: selectedTask.status,
        dueDate: selectedTask.dueDate
          ? new Date(selectedTask.dueDate).toISOString().split("T")[0]
          : "",
      });
    } else {
      setFormData(TASK_FORM_DEFAULT_VALUES);
    }
  }, [mode, selectedTask, isOpen]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    setIsSubmitting(true);
    try {
      if (mode === "create") {
        await createTask({
          ...formData,
          dueDate: formData.dueDate || undefined,
        });
      } else if (selectedTask) {
        await updateTask(selectedTask._id, {
          ...formData,
          dueDate: formData.dueDate || undefined,
        });
      }
      handleClose();
    } catch {
      // Error handled in context
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData(TASK_FORM_DEFAULT_VALUES);
    selectTask(null);
    onClose();
  };

  const getTitle = () => {
    return mode === "create" ? "Create New Task" : "Edit Task";
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleClose}>
      <SheetContent className="sm:max-w-md">
        <SheetHeader className="flex flex-row items-center justify-between">
          <div>
            <SheetTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              {getTitle()}
            </SheetTitle>
            <SheetDescription>
              {mode === "create"
                ? "Add a new task to your list"
                : "Update your task details"}
            </SheetDescription>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium">
              Task Title *
            </Label>
            <Input
              id="title"
              placeholder="Enter task title..."
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              className="bg-background"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Description
            </Label>
            <Textarea
              id="description"
              placeholder="Enter task description..."
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              className="bg-background min-h-[100px] resize-none"
              rows={4}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priority" className="text-sm font-medium">
                Priority
              </Label>
              <Select
                value={formData.priority}
                onValueChange={(value: never) =>
                  handleChange("priority", value)
                }
              >
                <SelectTrigger className="bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PRIORITY_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center space-x-2">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            option.value === "high"
                              ? "bg-red-500"
                              : option.value === "medium"
                              ? "bg-yellow-500"
                              : "bg-green-500"
                          }`}
                        />
                        <span>{option.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status" className="text-sm font-medium">
                Status
              </Label>
              <Select
                value={formData.status}
                onValueChange={(value: never) => handleChange("status", value)}
              >
                <SelectTrigger className="bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="dueDate"
              className="text-sm font-medium flex items-center space-x-2"
            >
              <Calendar className="h-4 w-4" />
              <span>Due Date</span>
            </Label>
            <Input
              id="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={(e) => handleChange("dueDate", e.target.value)}
              className="bg-background"
            />
          </div>

          {user && (
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-xs text-muted-foreground">
                Created by:{" "}
                <span className="font-medium text-foreground">{user.name}</span>
              </p>
            </div>
          )}

          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
              disabled={isSubmitting || !formData.title.trim()}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {mode === "create" ? "Creating..." : "Updating..."}
                </>
              ) : mode === "create" ? (
                "Create Task"
              ) : (
                "Update Task"
              )}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
};

export default TaskForm;

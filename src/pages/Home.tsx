import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useTask } from "../context/TaskContext";
import { Navigate } from "react-router-dom";
import TaskList from "../components/TaskList";
import TaskForm from "../components/TaskForm";
import Filter from "../components/Filter";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Skeleton } from "../components/ui/skeleton";
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  Plus,
  Target,
  Sparkles,
  ListTodo,
} from "lucide-react";

const Home: React.FC = () => {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { tasks, isLoading: tasksLoading, selectTask } = useTask();

  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");

  // Redirect if not authenticated
  if (!authLoading && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Calculate task statistics
  const taskStats = {
    total: tasks.length,
    completed: tasks.filter((task) => task.status === "completed").length,
    pending: tasks.filter((task) => task.status === "pending").length,
    inProgress: tasks.filter((task) => task.status === "in-progress").length,
    highPriority: tasks.filter((task) => task.priority === "high").length,
    overdue: tasks.filter(
      (task) =>
        task.dueDate &&
        new Date(task.dueDate) < new Date() &&
        task.status !== "completed"
    ).length,
  };

  const completionRate =
    taskStats.total > 0
      ? Math.round((taskStats.completed / taskStats.total) * 100)
      : 0;

  const handleAddTask = () => {
    setFormMode("create");
    selectTask(null);
    setIsTaskFormOpen(true);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleEditTask = (task: any) => {
    setFormMode("edit");
    selectTask(task);
    setIsTaskFormOpen(true);
  };

  const handleCloseTaskForm = () => {
    setIsTaskFormOpen(false);
    selectTask(null);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-primary border-t-transparent mx-auto"></div>
          <p className="text-muted-foreground">Loading your tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Clean Header Section */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-6 md:mb-0">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-primary rounded-lg">
                  <ListTodo className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                    Task Dashboard
                  </h1>
                  <p className="text-muted-foreground mt-1">
                    Welcome back, {user?.name}
                  </p>
                </div>
              </div>
            </div>
            <Button
              onClick={handleAddTask}
              size="lg"
              className="bg-primary hover:bg-primary/90 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
            >
              <Plus className="mr-2 h-4 w-4" />
              New Task
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Progress Overview */}
        {taskStats.total > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-foreground">
                Progress Overview
              </h2>
              <div className="text-right">
                <div className="text-2xl font-bold text-primary">
                  {completionRate}%
                </div>
                <div className="text-sm text-muted-foreground">Complete</div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  {taskStats.completed} of {taskStats.total} tasks completed
                </span>
                <span className="font-medium">{taskStats.pending} pending</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${completionRate}%` }}
                ></div>
              </div>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Total Tasks */}
          <Card className="border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Tasks
                  </p>
                  <p className="text-2xl font-bold text-foreground mt-1">
                    {taskStats.total}
                  </p>
                </div>
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Target className="h-4 w-4 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Completed */}
          <Card className="border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Completed
                  </p>
                  <p className="text-2xl font-bold text-green-600 mt-1">
                    {taskStats.completed}
                  </p>
                </div>
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* In Progress */}
          <Card className="border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    In Progress
                  </p>
                  <p className="text-2xl font-bold text-amber-600 mt-1">
                    {taskStats.inProgress}
                  </p>
                </div>
                <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                  <Clock className="h-4 w-4 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* High Priority */}
          <Card className="border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    High Priority
                  </p>
                  <p className="text-2xl font-bold text-red-600 mt-1">
                    {taskStats.highPriority}
                  </p>
                </div>
                <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Overdue Alert */}
        {taskStats.overdue > 0 && (
          <Card className="mb-6 border-l-4 border-l-red-500 bg-red-50/50 dark:bg-red-950/20">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <AlertCircle className="h-5 w-5 text-red-600 shrink-0" />
                <div>
                  <p className="text-red-800 dark:text-red-200 font-medium">
                    {taskStats.overdue} overdue task
                    {taskStats.overdue > 1 ? "s" : ""}
                  </p>
                  <p className="text-red-600/70 dark:text-red-400/70 text-sm">
                    Review and complete these tasks soon
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {taskStats.total === 0 && !tasksLoading && (
          <Card className="mb-8 text-center border-2 border-dashed">
            <CardContent className="p-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                <Sparkles className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                No tasks yet
              </h3>
              <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                Get started by creating your first task and stay organized with
                your work.
              </p>
              <Button
                onClick={handleAddTask}
                className="bg-primary hover:bg-primary/90 cursor-pointer"
              >
                <Plus className="mr-2 h-4 w-4" />
                Create First Task
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Task Management Section */}
        {taskStats.total > 0 && (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-foreground">
                Your Tasks
              </h2>
              <div className="text-sm text-muted-foreground">
                {taskStats.completed} of {taskStats.total} completed
              </div>
            </div>

            <Filter />

            {tasksLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <Card key={i} className="border">
                    <CardContent className="p-4 space-y-3">
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <div className="flex space-x-2">
                        <Skeleton className="h-6 w-16" />
                        <Skeleton className="h-6 w-16" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <TaskList onAddTask={handleAddTask} onEditTask={handleEditTask} />
            )}
          </>
        )}
      </div>

      {/* Task Form Modal */}
      <TaskForm
        isOpen={isTaskFormOpen}
        onClose={handleCloseTaskForm}
        mode={formMode}
      />
    </div>
  );
};

export default Home;

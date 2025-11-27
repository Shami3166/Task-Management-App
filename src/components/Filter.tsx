import React from "react";
import { useTask } from "../context/TaskContext";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Badge } from "./ui/badge";
import { Search, Filter as FilterIcon, X } from "lucide-react";
import { PRIORITY_OPTIONS, STATUS_OPTIONS } from "../utils/constants";

const Filter: React.FC = () => {
  const { filters, setFilters, clearFilters, filteredTasks, tasks } = useTask();

  const handleSearchChange = (value: string) => {
    setFilters({ search: value });
  };

  const handleStatusChange = (value: string) => {
    setFilters({ status: value === "all" ? undefined : value });
  };

  const handlePriorityChange = (value: string) => {
    setFilters({ priority: value === "all" ? undefined : value });
  };

  const hasActiveFilters = filters.search || filters.status || filters.priority;

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.search) count++;
    if (filters.status) count++;
    if (filters.priority) count++;
    return count;
  };

  return (
    <div className="bg-card border rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <FilterIcon className="h-5 w-5 text-muted-foreground" />
          <h3 className="font-semibold text-foreground">Filters</h3>
          {hasActiveFilters && (
            <Badge
              variant="secondary"
              className="bg-primary text-primary-foreground"
            >
              {getActiveFilterCount()} active
            </Badge>
          )}
        </div>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="h-8 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4 mr-1" />
            Clear
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Search Input */}
        <div className="md:col-span-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tasks..."
              value={filters.search || ""}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10 bg-background"
            />
          </div>
        </div>

        {/* Status Filter */}
        <div>
          <Select
            value={filters.status || "all"}
            onValueChange={handleStatusChange}
          >
            <SelectTrigger className="bg-background">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              {STATUS_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Priority Filter */}
        <div>
          <Select
            value={filters.priority || "all"}
            onValueChange={handlePriorityChange}
          >
            <SelectTrigger className="bg-background">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priority</SelectItem>
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
      </div>

      {/* Results Count */}
      <div className="mt-3 flex items-center justify-between text-sm text-muted-foreground">
        <span>
          Showing {filteredTasks.length} of {tasks.length} tasks
        </span>

        {/* Active Filter Badges */}
        <div className="flex space-x-2">
          {filters.status && (
            <Badge variant="outline" className="text-xs">
              Status:{" "}
              {STATUS_OPTIONS.find((s) => s.value === filters.status)?.label}
            </Badge>
          )}
          {filters.priority && (
            <Badge variant="outline" className="text-xs">
              Priority:{" "}
              {
                PRIORITY_OPTIONS.find((p) => p.value === filters.priority)
                  ?.label
              }
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
};

export default Filter;

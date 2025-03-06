
import React from "react";
import { Check, Clock } from "lucide-react";

interface TaskStatusBadgeProps {
  status: "pending" | "completed";
}

const TaskStatusBadge = ({ status }: TaskStatusBadgeProps) => {
  return status === "completed" ? (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-300">
      <Check className="h-3.5 w-3.5 mr-1" />
      Concluída
    </span>
  ) : (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-800/20 dark:text-blue-300">
      <Clock className="h-3.5 w-3.5 mr-1" />
      Pendente
    </span>
  );
};

export default TaskStatusBadge;

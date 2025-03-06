
import React, { useState } from "react";
import { CustomButton } from "@/components/ui/custom-button";
import { Check, Clock, Edit, Trash2, X } from "lucide-react";
import { Task } from "@/context/TaskContext";

interface TaskActionsProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: number) => void;
  onToggleStatus: (task: Task) => void;
}

const TaskActions = ({ task, onEdit, onDelete, onToggleStatus }: TaskActionsProps) => {
  const [deleteConfirmation, setDeleteConfirmation] = useState<boolean>(false);
  
  const handleDelete = () => {
    setDeleteConfirmation(true);
  };
  
  const confirmDelete = () => {
    onDelete(task.id);
    setDeleteConfirmation(false);
  };
  
  const cancelDelete = () => {
    setDeleteConfirmation(false);
  };
  
  return (
    <>
      {deleteConfirmation ? (
        <div className="flex items-center justify-end space-x-2">
          <span className="text-sm text-muted-foreground mr-2">Confirmar?</span>
          <CustomButton
            variant="ghost"
            size="sm"
            onClick={cancelDelete}
            className="text-muted-foreground"
          >
            <X className="h-4 w-4" />
          </CustomButton>
          <CustomButton
            variant="destructive"
            size="sm"
            onClick={confirmDelete}
          >
            <Trash2 className="h-4 w-4" />
          </CustomButton>
        </div>
      ) : (
        <div className="flex items-center justify-end space-x-2">
          <CustomButton
            variant="ghost"
            size="sm"
            onClick={() => onToggleStatus(task)}
            className="text-muted-foreground"
            title={task.status === "pending" ? "Marcar como concluída" : "Marcar como pendente"}
          >
            {task.status === "pending" ? (
              <Check className="h-4 w-4" />
            ) : (
              <Clock className="h-4 w-4" />
            )}
          </CustomButton>
          <CustomButton
            variant="ghost"
            size="sm"
            onClick={() => onEdit(task)}
            className="text-muted-foreground"
          >
            <Edit className="h-4 w-4" />
          </CustomButton>
          <CustomButton
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            className="text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </CustomButton>
        </div>
      )}
    </>
  );
};

export default TaskActions;


import React from "react";
import { motion } from "framer-motion";
import { Task } from "@/context/TaskContext";
import { Class } from "@/context/ClassContext";
import TaskStatusBadge from "./TaskStatusBadge";
import TaskActions from "./TaskActions";

interface TaskTableProps {
  tasks: Task[];
  classes: Class[];
  onEdit: (task: Task) => void;
  onDelete: (taskId: number) => void;
  onToggleStatus: (task: Task) => void;
}

const TaskTable = ({ tasks, classes, onEdit, onDelete, onToggleStatus }: TaskTableProps) => {
  // Find class name for a task
  const getClassName = (classId: number) => {
    const classItem = classes.find(c => c.id === classId);
    return classItem ? classItem.name : "N/A";
  };
  
  return (
    <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-muted/50">
              <th className="text-left p-4 font-medium">Título</th>
              <th className="text-left p-4 font-medium hidden md:table-cell">Turma</th>
              <th className="text-left p-4 font-medium hidden md:table-cell">Disciplina</th>
              <th className="text-left p-4 font-medium hidden md:table-cell">Data de Entrega</th>
              <th className="text-left p-4 font-medium">Status</th>
              <th className="text-right p-4 font-medium">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {tasks.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-4 text-center text-muted-foreground">
                  Nenhuma atividade cadastrada.
                </td>
              </tr>
            ) : (
              tasks.map((task) => (
                <motion.tr 
                  key={task.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="hover:bg-muted/20"
                >
                  <td className="p-4 max-w-xs">
                    <div className="truncate font-medium">{task.title}</div>
                  </td>
                  <td className="p-4 hidden md:table-cell">
                    {getClassName(task.classId)}
                  </td>
                  <td className="p-4 hidden md:table-cell">{task.subject}</td>
                  <td className="p-4 hidden md:table-cell">
                    {new Date(task.dueDate).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="p-4">
                    <TaskStatusBadge status={task.status} />
                  </td>
                  <td className="p-4 text-right">
                    <TaskActions 
                      task={task} 
                      onEdit={onEdit} 
                      onDelete={onDelete} 
                      onToggleStatus={onToggleStatus}
                    />
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TaskTable;

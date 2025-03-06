
import { Task } from "@/context/TaskContext";
import { formatDate } from "@/lib/utils";
import { CalendarIcon, ClockIcon, BookOpenIcon, UsersIcon } from "lucide-react";
import { motion } from "framer-motion";

interface TaskCardProps {
  task: Task;
  className: string;
  onClick?: () => void;
}

const TaskCard = ({ task, className, onClick }: TaskCardProps) => {
  // Calculate if the task is due soon (within 3 days)
  const today = new Date();
  const dueDate = new Date(task.dueDate);
  const diffTime = dueDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const isDueSoon = diffDays >= 0 && diffDays <= 3;
  const isOverdue = diffDays < 0;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="w-full bg-card rounded-xl shadow-sm hover:shadow-md transition-all border p-5 cursor-pointer"
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex flex-col">
          <div className="flex gap-2 mb-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
              {task.subject}
            </span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-800/20 dark:text-blue-300">
              {className}
            </span>
          </div>
          <h3 className="text-lg font-semibold line-clamp-1">{task.title}</h3>
        </div>
        
        {/* Status indicator */}
        {task.status === "completed" ? (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-300">
            Concluída
          </span>
        ) : isOverdue ? (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-800/20 dark:text-red-300">
            Atrasada
          </span>
        ) : isDueSoon ? (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-800/20 dark:text-yellow-300">
            Em breve
          </span>
        ) : (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-800/20 dark:text-blue-300">
            Pendente
          </span>
        )}
      </div>
      
      <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{task.description}</p>
      
      <div className="flex items-center justify-between text-xs text-muted-foreground mt-auto">
        <div className="flex items-center gap-1">
          <CalendarIcon className="h-3.5 w-3.5" />
          <span>Criada em: {formatDate(task.createdAt)}</span>
        </div>
        
        <div className="flex items-center gap-1">
          <ClockIcon className="h-3.5 w-3.5" />
          <span className={isOverdue ? "text-red-500" : ""}>
            Prazo: {formatDate(task.dueDate)}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default TaskCard;


import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTasks } from "@/context/TaskContext";
import Header from "@/components/layout/Header";
import { CustomButton } from "@/components/ui/custom-button";
import { motion } from "framer-motion";
import { ArrowLeft, Book, Calendar, Clock } from "lucide-react";

const TaskDetail = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const { getTaskById, updateTask } = useTasks();
  const navigate = useNavigate();
  
  const [task, setTask] = useState(getTaskById(Number(taskId)));
  
  useEffect(() => {
    if (!task) {
      navigate("/", { replace: true });
    }
  }, [task, navigate]);
  
  if (!task) {
    return null;
  }
  
  // Calculate if overdue
  const today = new Date();
  const dueDate = new Date(task.dueDate);
  const isOverdue = today > dueDate && task.status === "pending";
  
  // Format dates
  const formattedDueDate = new Date(task.dueDate).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  
  const formattedCreationDate = new Date(task.createdAt).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  
  const toggleStatus = () => {
    const newStatus = task.status === "pending" ? "completed" : "pending";
    updateTask(task.id, { status: newStatus });
    setTask(getTaskById(Number(taskId)));
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 pt-28 pb-16">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <CustomButton
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="mb-4 -ml-2"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Voltar
            </CustomButton>
            
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                    {task.subject}
                  </span>
                  {task.status === "completed" ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-300">
                      Concluída
                    </span>
                  ) : isOverdue ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-800/20 dark:text-red-300">
                      Atrasada
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-800/20 dark:text-blue-300">
                      Pendente
                    </span>
                  )}
                </div>
                <h1 className="text-3xl font-bold">{task.title}</h1>
              </div>
              
              <CustomButton
                variant={task.status === "completed" ? "outline" : "primary"}
                onClick={toggleStatus}
              >
                {task.status === "completed" ? "Marcar como Pendente" : "Marcar como Concluída"}
              </CustomButton>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="bg-card rounded-xl border shadow-sm p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Detalhes da Atividade</h2>
              <p className="text-foreground leading-relaxed whitespace-pre-line">
                {task.description}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-card rounded-xl border shadow-sm p-6">
                <div className="flex items-center gap-2 text-muted-foreground mb-3">
                  <Book className="h-5 w-5" />
                  <h3 className="font-medium">Disciplina</h3>
                </div>
                <p className="text-lg">{task.subject}</p>
              </div>
              
              <div className="bg-card rounded-xl border shadow-sm p-6">
                <div className="flex items-center gap-2 text-muted-foreground mb-3">
                  <Calendar className="h-5 w-5" />
                  <h3 className="font-medium">Data de Criação</h3>
                </div>
                <p className="text-lg">{formattedCreationDate}</p>
              </div>
              
              <div className="bg-card rounded-xl border shadow-sm p-6">
                <div className="flex items-center gap-2 text-muted-foreground mb-3">
                  <Clock className="h-5 w-5" />
                  <h3 className="font-medium">Prazo de Entrega</h3>
                </div>
                <p className={`text-lg ${isOverdue ? "text-red-500" : ""}`}>
                  {formattedDueDate}
                </p>
                {isOverdue && (
                  <p className="text-sm text-red-500 mt-1">Prazo expirado</p>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default TaskDetail;

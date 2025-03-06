
import { useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { useTasks, Task } from "@/context/TaskContext";
import { useClasses } from "@/context/ClassContext";
import { useAuth } from "@/context/AuthContext";
import Header from "@/components/layout/Header";
import TaskForm from "@/components/tasks/TaskForm";
import { CustomButton } from "@/components/ui/custom-button";
import { motion } from "framer-motion";
import { Check, Clock, Edit, Plus, Trash2, X, Users } from "lucide-react";

const Admin = () => {
  const { user, isAuthenticated } = useAuth();
  const { tasks, deleteTask, updateTask } = useTasks();
  const { classes } = useClasses();
  
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | undefined>(undefined);
  const [deleteConfirmation, setDeleteConfirmation] = useState<number | null>(null);
  
  // If not authenticated or not a teacher, redirect to login
  if (!isAuthenticated || user?.role !== "teacher") {
    return <Navigate to="/login" />;
  }
  
  const handleEdit = (task: Task) => {
    setSelectedTask(task);
    setIsFormVisible(true);
  };
  
  const handleDelete = (taskId: number) => {
    setDeleteConfirmation(taskId);
  };
  
  const confirmDelete = (taskId: number) => {
    deleteTask(taskId);
    setDeleteConfirmation(null);
  };
  
  const cancelDelete = () => {
    setDeleteConfirmation(null);
  };
  
  const toggleTaskStatus = (task: Task) => {
    const newStatus = task.status === "pending" ? "completed" : "pending";
    updateTask(task.id, { status: newStatus });
  };
  
  const closeForm = () => {
    setIsFormVisible(false);
    setSelectedTask(undefined);
  };
  
  // Find class name for a task
  const getClassName = (classId: number) => {
    const classItem = classes.find(c => c.id === classId);
    return classItem ? classItem.name : "N/A";
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 pt-28 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight mb-1">
                Administração de Atividades
              </h1>
              <p className="text-muted-foreground">
                Gerencie as atividades dos alunos
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/classes">
                <CustomButton
                  variant="outline"
                  className="flex items-center gap-2 w-full sm:w-auto"
                >
                  <Users className="h-4 w-4" />
                  Gerenciar Turmas
                </CustomButton>
              </Link>
              
              <CustomButton
                onClick={() => setIsFormVisible(true)}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Nova Atividade
              </CustomButton>
            </div>
          </div>
        </motion.div>
        
        {isFormVisible && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-2xl">
              <TaskForm task={selectedTask} onClose={closeForm} />
            </div>
          </div>
        )}
        
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
                        {task.status === "completed" ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-300">
                            <Check className="h-3.5 w-3.5 mr-1" />
                            Concluída
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-800/20 dark:text-blue-300">
                            <Clock className="h-3.5 w-3.5 mr-1" />
                            Pendente
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        {deleteConfirmation === task.id ? (
                          <div className="flex items-center justify-end space-x-2">
                            <span className="text-sm text-muted-foreground mr-2">Confirmar?</span>
                            <CustomButton
                              variant="ghost"
                              size="sm"
                              onClick={() => cancelDelete()}
                              className="text-muted-foreground"
                            >
                              <X className="h-4 w-4" />
                            </CustomButton>
                            <CustomButton
                              variant="destructive"
                              size="sm"
                              onClick={() => confirmDelete(task.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </CustomButton>
                          </div>
                        ) : (
                          <div className="flex items-center justify-end space-x-2">
                            <CustomButton
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleTaskStatus(task)}
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
                              onClick={() => handleEdit(task)}
                              className="text-muted-foreground"
                            >
                              <Edit className="h-4 w-4" />
                            </CustomButton>
                            <CustomButton
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(task.id)}
                              className="text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </CustomButton>
                          </div>
                        )}
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Admin;

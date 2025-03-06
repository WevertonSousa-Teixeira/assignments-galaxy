
import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useTasks, Task } from "@/context/TaskContext";
import { useClasses } from "@/context/ClassContext";
import { useAuth } from "@/context/AuthContext";
import Header from "@/components/layout/Header";
import TaskForm from "@/components/tasks/TaskForm";
import AdminHeader from "@/components/admin/AdminHeader";
import TaskTable from "@/components/admin/TaskTable";
import { toast } from "sonner";

const Admin = () => {
  const { user, isAuthenticated } = useAuth();
  const { tasks, deleteTask, updateTask } = useTasks();
  const { classes } = useClasses();
  
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | undefined>(undefined);
  
  // If not authenticated or not a teacher, redirect to login
  if (!isAuthenticated || user?.role !== "teacher") {
    return <Navigate to="/login" />;
  }
  
  // Verificação para garantir que existam turmas antes de mostrar o formulário
  const handleNewTask = () => {
    if (classes.length === 0) {
      toast.error("Você precisa cadastrar pelo menos uma turma antes de criar atividades.");
      return;
    }
    setIsFormVisible(true);
  };
  
  const handleEdit = (task: Task) => {
    setSelectedTask(task);
    setIsFormVisible(true);
  };
  
  const handleDelete = (taskId: number) => {
    deleteTask(taskId);
  };
  
  const toggleTaskStatus = (task: Task) => {
    const newStatus = task.status === "pending" ? "completed" : "pending";
    updateTask(task.id, { status: newStatus });
  };
  
  const closeForm = () => {
    setIsFormVisible(false);
    setSelectedTask(undefined);
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 pt-28 pb-16">
        <AdminHeader onNewTask={handleNewTask} />
        
        {isFormVisible && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-2xl">
              <TaskForm task={selectedTask} onClose={closeForm} />
            </div>
          </div>
        )}
        
        <TaskTable 
          tasks={tasks}
          classes={classes}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggleStatus={toggleTaskStatus}
        />
      </main>
    </div>
  );
};

export default Admin;

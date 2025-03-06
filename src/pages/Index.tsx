
import { motion } from "framer-motion";
import Header from "@/components/layout/Header";
import TaskList from "@/components/tasks/TaskList";
import { Book, Calendar, FileText } from "lucide-react";
import { useTasks } from "@/context/TaskContext";

const Index = () => {
  const { tasks } = useTasks();
  
  // Calculate task statistics
  const totalTasks = tasks.length;
  const pendingTasks = tasks.filter(task => task.status === "pending").length;
  const completedTasks = tasks.filter(task => task.status === "completed").length;
  
  // Get upcoming task (closest due date that's not completed)
  const upcomingTasks = tasks
    .filter(task => task.status === "pending")
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  
  const upcomingTask = upcomingTasks[0];
  
  // Calculate if any task is due today
  const today = new Date().toISOString().split("T")[0];
  const hasDueToday = tasks.some(task => 
    task.status === "pending" && task.dueDate === today
  );
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 pt-28 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <h1 className="text-3xl font-bold tracking-tight mb-1">Painel de Atividades</h1>
          <p className="text-muted-foreground">
            Acompanhe e gerencie todas as suas atividades escolares
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-card border rounded-xl p-6 shadow-sm"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium">Total de Atividades</h3>
              <div className="bg-primary/10 p-2 rounded-full">
                <Book className="h-5 w-5 text-primary" />
              </div>
            </div>
            <p className="text-3xl font-bold">{totalTasks}</p>
            <div className="flex mt-3 text-xs text-muted-foreground">
              <span className="flex items-center mr-3">
                <span className="h-2 w-2 rounded-full bg-primary mr-1"></span>
                {pendingTasks} pendentes
              </span>
              <span className="flex items-center">
                <span className="h-2 w-2 rounded-full bg-green-500 mr-1"></span>
                {completedTasks} concluídas
              </span>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-card border rounded-xl p-6 shadow-sm"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium">Próxima Entrega</h3>
              <div className="bg-primary/10 p-2 rounded-full">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
            </div>
            {upcomingTask ? (
              <>
                <p className="text-lg font-semibold line-clamp-1">{upcomingTask.title}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {upcomingTask.subject} • {new Date(upcomingTask.dueDate).toLocaleDateString('pt-BR')}
                </p>
              </>
            ) : (
              <p className="text-muted-foreground">Nenhuma atividade pendente</p>
            )}
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-card border rounded-xl p-6 shadow-sm"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium">Status</h3>
              <div className="bg-primary/10 p-2 rounded-full">
                <FileText className="h-5 w-5 text-primary" />
              </div>
            </div>
            {hasDueToday ? (
              <div className="flex items-center bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 text-sm p-3 rounded-lg">
                <Calendar className="h-4 w-4 mr-2" />
                <span>Você tem atividades para entregar hoje!</span>
              </div>
            ) : (
              pendingTasks > 0 ? (
                <div className="flex items-center bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 text-sm p-3 rounded-lg">
                  <FileText className="h-4 w-4 mr-2" />
                  <span>Você tem {pendingTasks} atividades pendentes</span>
                </div>
              ) : (
                <div className="flex items-center bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200 text-sm p-3 rounded-lg">
                  <FileText className="h-4 w-4 mr-2" />
                  <span>Todas as atividades estão concluídas!</span>
                </div>
              )
            )}
          </motion.div>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold tracking-tight">Atividades</h2>
          </div>
          
          <TaskList />
        </motion.div>
      </main>
    </div>
  );
};

export default Index;

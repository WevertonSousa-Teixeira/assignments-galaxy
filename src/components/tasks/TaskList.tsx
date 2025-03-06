
import { useState, useMemo } from "react";
import { useTasks, Task } from "@/context/TaskContext";
import { useClasses } from "@/context/ClassContext";
import TaskCard from "./TaskCard";
import { useNavigate } from "react-router-dom";
import { Search, Filter } from "lucide-react";

const TaskList = () => {
  const { tasks, isLoading } = useTasks();
  const { classes } = useClasses();
  const navigate = useNavigate();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "completed">("all");
  const [subjectFilter, setSubjectFilter] = useState<string>("all");
  const [classFilter, setClassFilter] = useState<number | "all">("all");
  
  // Get unique subjects for filter dropdown
  const subjects = useMemo(() => {
    return Array.from(new Set(tasks.map(task => task.subject)));
  }, [tasks]);
  
  // Filter tasks based on search query and filters
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      // Filter by search query
      const matchesSearch = 
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.subject.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Filter by status
      const matchesStatus = 
        statusFilter === "all" || 
        (statusFilter === "pending" && task.status === "pending") ||
        (statusFilter === "completed" && task.status === "completed");
      
      // Filter by subject
      const matchesSubject = 
        subjectFilter === "all" || 
        task.subject === subjectFilter;
      
      // Filter by class
      const matchesClass = 
        classFilter === "all" || 
        task.classId === classFilter;
      
      return matchesSearch && matchesStatus && matchesSubject && matchesClass;
    });
  }, [tasks, searchQuery, statusFilter, subjectFilter, classFilter]);
  
  const handleTaskClick = (taskId: number) => {
    navigate(`/task/${taskId}`);
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-60">
        <div className="animate-pulse flex flex-col items-center">
          <div className="rounded-full bg-secondary h-12 w-12 mb-2"></div>
          <div className="h-4 bg-secondary rounded w-24"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="w-full">
      <div className="mb-6 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar atividades..."
            className="w-full pl-10 h-10 rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <Filter className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <select
              className="w-full pl-10 h-10 rounded-lg border bg-background px-3 py-2 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-primary"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as "all" | "pending" | "completed")}
            >
              <option value="all">Todos os status</option>
              <option value="pending">Pendentes</option>
              <option value="completed">Concluídas</option>
            </select>
          </div>
          
          <div className="relative">
            <Filter className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <select
              className="w-full pl-10 h-10 rounded-lg border bg-background px-3 py-2 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-primary"
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
            >
              <option value="all">Todas as disciplinas</option>
              {subjects.map((subject) => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
            </select>
          </div>
          
          <div className="relative">
            <Filter className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <select
              className="w-full pl-10 h-10 rounded-lg border bg-background px-3 py-2 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-primary"
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value === "all" ? "all" : parseInt(e.target.value, 10))}
            >
              <option value="all">Todas as turmas</option>
              {classes.map((classItem) => (
                <option key={classItem.id} value={classItem.id}>
                  {classItem.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      {filteredTasks.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Nenhuma atividade encontrada.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTasks.map((task) => (
            <TaskCard 
              key={task.id} 
              task={task} 
              onClick={() => handleTaskClick(task.id)}
              className={classes.find(c => c.id === task.classId)?.name || ""}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskList;

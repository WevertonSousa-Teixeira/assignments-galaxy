
import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";

export type Task = {
  id: number;
  title: string;
  description: string;
  subject: string;
  dueDate: string;
  createdAt: string;
  status: "pending" | "completed";
  classId: number; // Nova propriedade para a turma
};

type TaskContextType = {
  tasks: Task[];
  isLoading: boolean;
  addTask: (task: Omit<Task, "id" | "createdAt">) => void;
  updateTask: (id: number, task: Partial<Task>) => void;
  deleteTask: (id: number) => void;
  getTaskById: (id: number) => Task | undefined;
  getTasksByClassId: (classId: number) => Task[];
};

const TaskContext = createContext<TaskContextType | undefined>(undefined);

// Sample tasks for the initial state
const INITIAL_TASKS: Task[] = [
  {
    id: 1,
    title: "Relatório de Ciências",
    description: "Escrever um relatório sobre o sistema solar e seus planetas",
    subject: "Ciências",
    dueDate: "2023-12-15",
    createdAt: "2023-11-25",
    status: "pending",
    classId: 1, // 3º Ano A
  },
  {
    id: 2,
    title: "Exercícios de Matemática",
    description: "Resolver os exercícios da página 32 do livro",
    subject: "Matemática",
    dueDate: "2023-12-10",
    createdAt: "2023-11-28",
    status: "pending",
    classId: 1, // 3º Ano A
  },
  {
    id: 3,
    title: "Redação sobre Meio Ambiente",
    description: "Escrever uma redação de 30 linhas sobre preservação ambiental",
    subject: "Português",
    dueDate: "2023-12-18",
    createdAt: "2023-11-30",
    status: "pending",
    classId: 2, // 7º Ano B
  },
];

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Load tasks from localStorage or use initial tasks
    const storedTasks = localStorage.getItem("tasks");
    if (storedTasks) {
      try {
        setTasks(JSON.parse(storedTasks));
      } catch (error) {
        console.error("Error parsing stored tasks:", error);
        setTasks(INITIAL_TASKS);
      }
    } else {
      setTasks(INITIAL_TASKS);
    }
    setIsLoading(false);
  }, []);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }
  }, [tasks, isLoading]);

  const addTask = (task: Omit<Task, "id" | "createdAt">) => {
    const newTask: Task = {
      ...task,
      id: Date.now(),
      createdAt: new Date().toISOString().split("T")[0],
    };
    
    setTasks((prev) => [...prev, newTask]);
    toast.success("Tarefa adicionada com sucesso!");
  };

  const updateTask = (id: number, taskUpdate: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, ...taskUpdate } : task))
    );
    toast.success("Tarefa atualizada com sucesso!");
  };

  const deleteTask = (id: number) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
    toast.success("Tarefa removida com sucesso!");
  };

  const getTaskById = (id: number) => {
    return tasks.find((task) => task.id === id);
  };

  const getTasksByClassId = (classId: number) => {
    return tasks.filter((task) => task.classId === classId);
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        isLoading,
        addTask,
        updateTask,
        deleteTask,
        getTaskById,
        getTasksByClassId,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error("useTasks must be used within a TaskProvider");
  }
  return context;
};

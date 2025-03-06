
import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";

export type Class = {
  id: number;
  name: string;
  description: string;
  createdAt: string;
};

type ClassContextType = {
  classes: Class[];
  isLoading: boolean;
  addClass: (classData: Omit<Class, "id" | "createdAt">) => void;
  updateClass: (id: number, classData: Partial<Class>) => void;
  deleteClass: (id: number) => void;
  getClassById: (id: number) => Class | undefined;
};

const ClassContext = createContext<ClassContextType | undefined>(undefined);

// Sample classes for the initial state
const INITIAL_CLASSES: Class[] = [
  {
    id: 1,
    name: "3º Ano A",
    description: "Turma do ensino médio",
    createdAt: "2023-11-20",
  },
  {
    id: 2,
    name: "7º Ano B",
    description: "Turma do ensino fundamental",
    createdAt: "2023-11-22",
  },
];

export const ClassProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [classes, setClasses] = useState<Class[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Load classes from localStorage or use initial classes
    const storedClasses = localStorage.getItem("classes");
    if (storedClasses) {
      try {
        setClasses(JSON.parse(storedClasses));
      } catch (error) {
        console.error("Error parsing stored classes:", error);
        setClasses(INITIAL_CLASSES);
      }
    } else {
      setClasses(INITIAL_CLASSES);
    }
    setIsLoading(false);
  }, []);

  // Save classes to localStorage whenever they change
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem("classes", JSON.stringify(classes));
    }
  }, [classes, isLoading]);

  const addClass = (classData: Omit<Class, "id" | "createdAt">) => {
    const newClass: Class = {
      ...classData,
      id: Date.now(),
      createdAt: new Date().toISOString().split("T")[0],
    };
    
    setClasses((prev) => [...prev, newClass]);
    toast.success("Turma adicionada com sucesso!");
  };

  const updateClass = (id: number, classUpdate: Partial<Class>) => {
    setClasses((prev) =>
      prev.map((classItem) => (classItem.id === id ? { ...classItem, ...classUpdate } : classItem))
    );
    toast.success("Turma atualizada com sucesso!");
  };

  const deleteClass = (id: number) => {
    setClasses((prev) => prev.filter((classItem) => classItem.id !== id));
    toast.success("Turma removida com sucesso!");
  };

  const getClassById = (id: number) => {
    return classes.find((classItem) => classItem.id === id);
  };

  return (
    <ClassContext.Provider
      value={{
        classes,
        isLoading,
        addClass,
        updateClass,
        deleteClass,
        getClassById,
      }}
    >
      {children}
    </ClassContext.Provider>
  );
};

export const useClasses = () => {
  const context = useContext(ClassContext);
  if (context === undefined) {
    throw new Error("useClasses must be used within a ClassProvider");
  }
  return context;
};

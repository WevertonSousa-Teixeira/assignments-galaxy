
import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useClasses, Class } from "@/context/ClassContext";
import { useAuth } from "@/context/AuthContext";
import Header from "@/components/layout/Header";
import ClassForm from "@/components/classes/ClassForm";
import { CustomButton } from "@/components/ui/custom-button";
import { motion } from "framer-motion";
import { Edit, Plus, Trash2, X, Users } from "lucide-react";

const ClassManagement = () => {
  const { user, isAuthenticated } = useAuth();
  const { classes, deleteClass } = useClasses();
  
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [selectedClass, setSelectedClass] = useState<Class | undefined>(undefined);
  const [deleteConfirmation, setDeleteConfirmation] = useState<number | null>(null);
  
  // If not authenticated or not a teacher, redirect to login
  if (!isAuthenticated || user?.role !== "teacher") {
    return <Navigate to="/login" />;
  }
  
  const handleEdit = (classItem: Class) => {
    setSelectedClass(classItem);
    setIsFormVisible(true);
  };
  
  const handleDelete = (classId: number) => {
    setDeleteConfirmation(classId);
  };
  
  const confirmDelete = (classId: number) => {
    deleteClass(classId);
    setDeleteConfirmation(null);
  };
  
  const cancelDelete = () => {
    setDeleteConfirmation(null);
  };
  
  const closeForm = () => {
    setIsFormVisible(false);
    setSelectedClass(undefined);
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
                Gerenciamento de Turmas
              </h1>
              <p className="text-muted-foreground">
                Cadastre e gerencie as turmas para organizar as atividades
              </p>
            </div>
            
            <CustomButton
              onClick={() => setIsFormVisible(true)}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Nova Turma
            </CustomButton>
          </div>
        </motion.div>
        
        {isFormVisible && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-2xl">
              <ClassForm classItem={selectedClass} onClose={closeForm} />
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.length === 0 ? (
            <div className="col-span-full text-center py-8">
              <p className="text-muted-foreground">Nenhuma turma cadastrada.</p>
            </div>
          ) : (
            classes.map((classItem) => (
              <motion.div
                key={classItem.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-card rounded-xl border shadow-sm p-6 hover:shadow-md transition-all"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="h-5 w-5 text-primary" />
                      <h3 className="text-xl font-semibold">{classItem.name}</h3>
                    </div>
                    <p className="text-muted-foreground text-sm mb-4">{classItem.description}</p>
                    <div className="text-xs text-muted-foreground">
                      Criada em: {new Date(classItem.createdAt).toLocaleDateString('pt-BR')}
                    </div>
                  </div>
                  
                  {deleteConfirmation === classItem.id ? (
                    <div className="flex items-center space-x-2">
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
                        onClick={() => confirmDelete(classItem.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </CustomButton>
                    </div>
                  ) : (
                    <div className="flex space-x-2">
                      <CustomButton
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(classItem)}
                        className="text-muted-foreground"
                      >
                        <Edit className="h-4 w-4" />
                      </CustomButton>
                      <CustomButton
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(classItem.id)}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </CustomButton>
                    </div>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default ClassManagement;

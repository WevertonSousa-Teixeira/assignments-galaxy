
import React from "react";
import { Link } from "react-router-dom";
import { CustomButton } from "@/components/ui/custom-button";
import { motion } from "framer-motion";
import { Plus, Users } from "lucide-react";

interface AdminHeaderProps {
  onNewTask: () => void;
}

const AdminHeader = ({ onNewTask }: AdminHeaderProps) => {
  return (
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
            onClick={onNewTask}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Nova Atividade
          </CustomButton>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminHeader;

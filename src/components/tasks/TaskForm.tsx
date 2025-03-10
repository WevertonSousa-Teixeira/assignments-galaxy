
import { useState, useEffect } from "react";
import { useTasks, Task } from "@/context/TaskContext";
import { useClasses } from "@/context/ClassContext";
import { CustomButton } from "@/components/ui/custom-button";
import { Calendar, X } from "lucide-react";
import { toast } from "sonner";

interface TaskFormProps {
  task?: Task;
  onClose: () => void;
}

const TaskForm = ({ task, onClose }: TaskFormProps) => {
  const { addTask, updateTask } = useTasks();
  const { classes } = useClasses();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Verificar se há turmas disponíveis
  useEffect(() => {
    if (classes.length === 0) {
      toast.error("Não há turmas cadastradas. Cadastre uma turma primeiro.");
      onClose();
    }
  }, [classes.length, onClose]);
  
  const defaultClassId = classes.length > 0 ? classes[0].id : 0;
  
  const [formData, setFormData] = useState({
    title: task?.title || "",
    description: task?.description || "",
    subject: task?.subject || "",
    dueDate: task?.dueDate || new Date().toISOString().split("T")[0],
    status: task?.status || "pending",
    classId: task?.classId || defaultClassId,
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = "O título é obrigatório";
    }
    
    if (!formData.description.trim()) {
      newErrors.description = "A descrição é obrigatória";
    }
    
    if (!formData.subject.trim()) {
      newErrors.subject = "A disciplina é obrigatória";
    }
    
    if (!formData.dueDate) {
      newErrors.dueDate = "A data de entrega é obrigatória";
    }
    
    if (!formData.classId) {
      newErrors.classId = "A turma é obrigatória";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === "classId" ? parseInt(value, 10) : value 
    }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      if (task) {
        updateTask(task.id, formData);
        toast.success("Atividade atualizada com sucesso!");
      } else {
        addTask(formData as Omit<Task, "id" | "createdAt">);
        toast.success("Atividade criada com sucesso!");
      }
      
      setIsSubmitting(false);
      onClose();
    } catch (error) {
      console.error("Erro ao salvar atividade:", error);
      toast.error("Ocorreu um erro ao salvar a atividade");
      setIsSubmitting(false);
    }
  };
  
  // Se não houver turmas, não mostrar o formulário
  if (classes.length === 0) {
    return null;
  }
  
  return (
    <div className="bg-card p-6 rounded-xl shadow-lg border animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">
          {task ? "Editar Atividade" : "Nova Atividade"}
        </h2>
        <button 
          onClick={onClose} 
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="classId" className="block text-sm font-medium mb-1">
            Turma
          </label>
          <select
            id="classId"
            name="classId"
            value={formData.classId}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary ${
              errors.classId ? "border-red-500" : "border-input"
            }`}
          >
            {classes.map((classItem) => (
              <option key={classItem.id} value={classItem.id}>
                {classItem.name}
              </option>
            ))}
          </select>
          {errors.classId && (
            <p className="mt-1 text-xs text-red-500">{errors.classId}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-1">
            Título
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary ${
              errors.title ? "border-red-500" : "border-input"
            }`}
            placeholder="Título da atividade"
          />
          {errors.title && (
            <p className="mt-1 text-xs text-red-500">{errors.title}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-1">
            Descrição
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className={`w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary ${
              errors.description ? "border-red-500" : "border-input"
            }`}
            placeholder="Descreva a atividade detalhadamente"
          />
          {errors.description && (
            <p className="mt-1 text-xs text-red-500">{errors.description}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="subject" className="block text-sm font-medium mb-1">
            Disciplina
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary ${
              errors.subject ? "border-red-500" : "border-input"
            }`}
            placeholder="Ex: Matemática, Português, Ciências..."
          />
          {errors.subject && (
            <p className="mt-1 text-xs text-red-500">{errors.subject}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="dueDate" className="block text-sm font-medium mb-1">
            Data de Entrega
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="date"
              id="dueDate"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              className={`w-full pl-10 px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary ${
                errors.dueDate ? "border-red-500" : "border-input"
              }`}
              min={new Date().toISOString().split("T")[0]}
            />
          </div>
          {errors.dueDate && (
            <p className="mt-1 text-xs text-red-500">{errors.dueDate}</p>
          )}
        </div>
        
        {task && (
          <div>
            <label htmlFor="status" className="block text-sm font-medium mb-1">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="pending">Pendente</option>
              <option value="completed">Concluída</option>
            </select>
          </div>
        )}
        
        <div className="flex justify-end space-x-3 pt-2">
          <CustomButton 
            type="button" 
            variant="outline" 
            onClick={onClose}
          >
            Cancelar
          </CustomButton>
          <CustomButton 
            type="submit" 
            isLoading={isSubmitting}
          >
            {task ? "Atualizar" : "Criar"} Atividade
          </CustomButton>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;

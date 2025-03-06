
import { useState } from "react";
import { useClasses, Class } from "@/context/ClassContext";
import { CustomButton } from "@/components/ui/custom-button";
import { X } from "lucide-react";

interface ClassFormProps {
  classItem?: Class;
  onClose: () => void;
}

const ClassForm = ({ classItem, onClose }: ClassFormProps) => {
  const { addClass, updateClass } = useClasses();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: classItem?.name || "",
    description: classItem?.description || "",
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "O nome da turma é obrigatório";
    }
    
    if (!formData.description.trim()) {
      newErrors.description = "A descrição é obrigatória";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
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
    
    // Simulate API call with timeout
    setTimeout(() => {
      if (classItem) {
        updateClass(classItem.id, formData);
      } else {
        addClass(formData as Omit<Class, "id" | "createdAt">);
      }
      
      setIsSubmitting(false);
      onClose();
    }, 500);
  };
  
  return (
    <div className="bg-card p-6 rounded-xl shadow-lg border animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">
          {classItem ? "Editar Turma" : "Nova Turma"}
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
          <label htmlFor="name" className="block text-sm font-medium mb-1">
            Nome da Turma
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary ${
              errors.name ? "border-red-500" : "border-input"
            }`}
            placeholder="Ex: 3º Ano A, 7º Ano B, etc."
          />
          {errors.name && (
            <p className="mt-1 text-xs text-red-500">{errors.name}</p>
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
            placeholder="Descreva a turma"
          />
          {errors.description && (
            <p className="mt-1 text-xs text-red-500">{errors.description}</p>
          )}
        </div>
        
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
            {classItem ? "Atualizar" : "Criar"} Turma
          </CustomButton>
        </div>
      </form>
    </div>
  );
};

export default ClassForm;

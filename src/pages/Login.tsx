
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { CustomButton } from "@/components/ui/custom-button";
import { Navigate, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Book, Lock, Mail } from "lucide-react";
import Header from "@/components/layout/Header";

const Login = () => {
  const { isAuthenticated, login, isLoading } = useAuth();
  const navigate = useNavigate();
  
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!credentials.email.trim()) {
      newErrors.email = "O email é obrigatório";
    } else if (!/\S+@\S+\.\S+/.test(credentials.email)) {
      newErrors.email = "Email inválido";
    }
    
    if (!credentials.password) {
      newErrors.password = "A senha é obrigatória";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    const success = await login(credentials.email, credentials.password);
    if (success) {
      navigate("/admin");
    }
  };
  
  // If already authenticated, redirect to admin
  if (isAuthenticated) {
    return <Navigate to="/admin" />;
  }
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 pt-28 pb-16 flex justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-8">
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Book className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-2xl font-bold">Área do Professor</h1>
            <p className="text-muted-foreground mt-2">
              Faça login para gerenciar as atividades
            </p>
          </div>
          
          <div className="bg-card border rounded-xl shadow-sm p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={credentials.email}
                    onChange={handleChange}
                    placeholder="professor@exemplo.com"
                    className={`w-full pl-10 px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary ${
                      errors.email ? "border-red-500" : "border-input"
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-xs text-red-500">{errors.email}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-1">
                  Senha
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={credentials.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className={`w-full pl-10 px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary ${
                      errors.password ? "border-red-500" : "border-input"
                    }`}
                  />
                </div>
                {errors.password && (
                  <p className="mt-1 text-xs text-red-500">{errors.password}</p>
                )}
              </div>
              
              <div className="pt-2">
                <CustomButton
                  type="submit"
                  className="w-full"
                  isLoading={isLoading}
                >
                  Entrar
                </CustomButton>
              </div>
            </form>
            
            <div className="mt-6 pt-4 border-t text-center">
              <p className="text-sm text-muted-foreground">
                Para fins de demonstração, use:
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Email: professor@exemplo.com <br />
                Senha: senha123
              </p>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Login;

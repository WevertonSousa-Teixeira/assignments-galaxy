
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { CustomButton } from "@/components/ui/custom-button";
import { Book, LogOut, User } from "lucide-react";

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "glass-effect shadow-sm py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center">
          <Book className="h-6 w-6 text-primary mr-2" />
          <Link 
            to="/" 
            className="text-xl font-semibold tracking-tight hover:opacity-80 transition-opacity"
          >
            Atividades
          </Link>
        </div>

        <nav className="hidden md:flex items-center space-x-8">
          <Link
            to="/"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              location.pathname === "/" ? "text-primary" : "text-muted-foreground"
            }`}
          >
            Painel
          </Link>
          
          {isAuthenticated && user?.role === "teacher" && (
            <Link
              to="/admin"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                location.pathname === "/admin" ? "text-primary" : "text-muted-foreground"
              }`}
            >
              Administração
            </Link>
          )}
        </nav>

        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">{user?.name}</span>
              </div>
              <CustomButton 
                variant="ghost" 
                size="sm" 
                onClick={logout}
                className="flex items-center gap-1"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden md:inline">Sair</span>
              </CustomButton>
            </div>
          ) : (
            location.pathname !== "/login" && (
              <Link to="/login">
                <CustomButton variant="primary" size="sm">
                  Área do Professor
                </CustomButton>
              </Link>
            )
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

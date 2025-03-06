
import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface CustomButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "link" | "destructive";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
}

const CustomButton = forwardRef<HTMLButtonElement, CustomButtonProps>(
  ({ className, children, variant = "primary", size = "md", isLoading, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={isLoading || disabled}
        className={cn(
          "inline-flex items-center justify-center font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
          
          // Variants
          variant === "primary" && "bg-primary text-primary-foreground hover:brightness-110 active:brightness-90 shadow-sm",
          variant === "secondary" && "bg-secondary text-secondary-foreground hover:bg-secondary/80 active:bg-secondary/90",
          variant === "outline" && "border border-input bg-transparent hover:bg-accent hover:text-accent-foreground",
          variant === "ghost" && "hover:bg-accent hover:text-accent-foreground",
          variant === "link" && "text-primary underline-offset-4 hover:underline",
          variant === "destructive" && "bg-destructive text-destructive-foreground hover:brightness-110",
          
          // Sizes
          size === "sm" && "h-8 px-3 rounded-md text-sm",
          size === "md" && "h-10 px-4 py-2 rounded-md",
          size === "lg" && "h-12 px-6 py-3 rounded-md text-base",
          size === "icon" && "h-10 w-10 rounded-md",
          
          // Custom class
          className
        )}
        {...props}
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Carregando...</span>
          </div>
        ) : (
          children
        )}
      </button>
    );
  }
);

CustomButton.displayName = "CustomButton";

export { CustomButton };

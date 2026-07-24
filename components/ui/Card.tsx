import { cn } from "@/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Card({ className, ...props }: CardProps) {
  return (
    <div 
      className={cn(
        "bg-white dark:bg-[#0a0a0a] border border-gray-100 dark:border-white/5 rounded-[2rem] p-6 sm:p-8 shadow-sm transition-all duration-500",
        className
      )} 
      {...props} 
    />
  );
}

type LoaderProps = {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
};

export function SquareSpin({ size = 'xl', className = '' }: LoaderProps) {
  const sizeClasses = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12', xl: 'w-16 h-16' };
  const containerSize = sizeClasses[size] || sizeClasses.md;
  const primaryBgClass = "bg-zinc-950 dark:bg-zinc-50";
  return (
    <div className={`${containerSize} ${primaryBgClass} animate-[spin_2s_linear_infinite] rounded-sm shadow-sm ${className}`} />
  );
}

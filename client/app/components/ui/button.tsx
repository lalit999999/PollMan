import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "../../utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | "glass";
  size?: "default" | "sm" | "lg" | "icon";
}

const buttonVariants = (props?: {
  variant?: ButtonProps["variant"];
  size?: ButtonProps["size"];
}) => {
  const variant = props?.variant ?? "default";
  const size = props?.size ?? "default";

  const variantStyles: Record<string, string> = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm",
    destructive: "bg-red-500 text-white hover:bg-red-600 shadow-sm",
    outline:
      "border border-border bg-transparent hover:bg-muted text-foreground",
    secondary: "bg-muted text-muted-foreground hover:bg-muted/80",
    ghost: "hover:bg-muted hover:text-foreground text-muted-foreground",
    link: "text-primary underline-offset-4 hover:underline",
    glass:
      "glass hover:bg-white/10 dark:hover:bg-white/5 text-foreground transition-all duration-300",
  };

  const sizeStyles: Record<string, string> = {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-md px-3",
    lg: "h-12 rounded-lg px-8 text-base",
    icon: "h-10 w-10",
  };

  return cn(
    "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
    variantStyles[variant],
    sizeStyles[size],
  );
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "default",
      size = "default",
      asChild = false,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        className={cn(buttonVariants({ variant, size }), className)}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };

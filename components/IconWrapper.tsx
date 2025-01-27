import { cn } from "@heroui/react";

export const IconWrapper = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={cn(
      className,
      "flex h-7 w-7 items-center justify-center rounded-small",
    )}
  >
    {children}
  </div>
);

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface ShareButtonProps {
  icon: React.ReactNode;
  className?: string;
  onClick?: () => void;
}
export const ShareButton: React.FC<ShareButtonProps> = ({
  icon,
  onClick,
  className,
}) => {
  return (
    <Button
      onClick={onClick}
      size={"icon"}
      className={cn(
        "flex gap-2 items-center bg-transparent justify-center",
        className
      )}
    >
      {icon}
    </Button>
  );
};

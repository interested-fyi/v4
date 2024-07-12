import { Button } from "@/components/ui/button";

export interface ShareButtonProps {
  icon: React.ReactNode;
  text: string;
}
export const ShareButton: React.FC<ShareButtonProps> = ({ icon }) => {
  return (
    <Button size={"icon"} className='flex gap-2 items-center justify-center'>
      {icon}
    </Button>
  );
};

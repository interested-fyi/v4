import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

import React from "react";

interface ModalProps {
  trigger: React.ReactNode;
  title: string;
  description: string;
  children?: React.ReactNode;
  className?: string;
}

const Modal = ({
  trigger,
  title,
  description,
  className,
  children,
}: ModalProps) => {
  return (
    <Dialog>
      {trigger}
      <DialogContent
        className={cn(
          "flex w-[459px] font-body max-w-full px-10 pt-14 pb-8 flex-col items-center justify-center gap-6 border border-[#2640EB] bg-white shadow-md rounded-xl",
          className
        )}
      >
        <DialogHeader className='flex flex-col gap-6'>
          {children}
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default Modal;

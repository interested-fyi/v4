"use client";
import Quest from "@/components/Quest";
import { Button } from "@/components/ui/button";
import { ArrowRight, LucideSquareArrowRight } from "lucide-react";
import React from "react";

const QuestPage = () => {
  return <Quest />;
};

export default QuestPage;

interface QuestRowProps {
  label: string;
  onClick: () => void;
  points: number;
  className?: string;
}
function QuestRow({ label, onClick, points, className }: QuestRowProps) {
  return (
    <div className='flex w-full justify-between items-center gap-2 bg-[#919df483] hover:bg-[#919CF459] p-2 rounded-md'>
      <p className='text-black text-left'>{label}</p>

      <Button
        onClick={onClick}
        className={`bg-[#2640EB] flex gap-1 items-center w-20 text-white p-2 rounded-md ${className}`}
      >
        <span className='text-xs'>Start</span>
        <LucideSquareArrowRight className='w-4 h-4' />
      </Button>
    </div>
  );
}

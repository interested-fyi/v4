import { Button } from "@/components/ui/button";
import React from "react";

type ButtonConfig = {
  text: string;
  onClick: () => void;
  isActive: boolean;
  size?: "lg" | "icon";
  className?: string;
};

type SwitchButtonGroupProps = {
  buttons: ButtonConfig[];
  svgOnClick: () => void;
};

const SwitchButtonGroup: React.FC<SwitchButtonGroupProps> = ({
  buttons,
  svgOnClick,
}) => {
  return (
    <div className='flex gap-4 relative w-fit max-w-[343px] mx-auto'>
      {/* First Button */}
      <Button
        size={buttons[0].size || "lg"}
        className={`min-w-40 md:w-[180px] max-w-full  rounded-[8px] font-heading font-bold uppercase justify-center text-center ${
          buttons[0].isActive
            ? "bg-[#2640EB] hover:bg-blue-600 hover:text-white text-yellow-200"
            : "border-[#D3D8FB] border-2 bg-[#fff] text-[#919CF4]"
        }`}
        onClick={buttons[0].onClick}
      >
        {buttons[0].text}
      </Button>

      {/* SVG Button in the middle */}
      <Button
        size='icon'
        onClick={svgOnClick}
        className='bg-transparent hover:bg-transparent active:scale-95 transition-all duration-100 absolute right-[45%]'
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='36'
          height='37'
          viewBox='0 0 36 37'
          fill='none'
        >
          <rect x='1' y='1.5' width='34' height='34' rx='17' fill='white' />
          <rect
            x='1'
            y='1.5'
            width='34'
            height='34'
            rx='17'
            stroke='#2640EB'
            strokeWidth='2'
          />
          <path
            d='M23.7826 21.6874L9.90039 21.6874L9.90039 22.9623L23.7826 22.9623L21.0512 25.6994L21.9537 26.6L26.2199 22.3248L21.9537 18.0497L21.0512 18.9503L23.7826 21.6874Z'
            fill='#2640EB'
          />
          <path
            d='M14.1664 10.4L9.90015 14.6751L14.1664 18.9503L15.0689 18.0497L12.3375 15.3126L26.2197 15.3126L26.2197 14.0377L12.3375 14.0377L15.0689 11.3006L14.1664 10.4Z'
            fill='#2640EB'
          />
        </svg>
      </Button>

      {/* Second Button */}
      <Button
        size={buttons[1].size || "lg"}
        className={`min-w-40 md:w-[180px] rounded-[8px] font-heading font-bold uppercase justify-center ${
          buttons[1].isActive
            ? "bg-[#2640EB] text-white hover:bg-blue-600 hover:text-white"
            : "border-[#D3D8FB] border-2 bg-[#fff] text-[#919CF4]"
        }`}
        onClick={buttons[1].onClick}
      >
        {buttons[1].text}
      </Button>
    </div>
  );
};

export default SwitchButtonGroup;

"use client";

import { Badge } from "@/components/ui/badge";
import { Link2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Image from "next/image";

interface OnchainBadgeProps {
  attestationUrl: string;
}

export function OnchainBadge({ attestationUrl }: OnchainBadgeProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild className='z-50'>
          <Badge
            variant='outline'
            className='cursor-pointer transition-all duration-300 flex items-center gap-1.5 
              bg-gradient-to-r from-blue-700 via-yellow-100 to-purple-500 bg-[length:200%_100%]
              hover:bg-[100%_0] bg-[0%_0]
              text-white border-none
              shadow-sm hover:shadow-md
              px-3 py-1 relative overflow-hidden z-40'
            onClick={() => window.open(attestationUrl, "_blank")}
          >
            <span className='font-medium'>EAS Verified</span>
            <Image
              src={"/svg/small-binocular.svg"}
              alt='binoculars'
              className='stroke-white fill-white'
              width={20}
              height={20}
            />
          </Badge>
        </TooltipTrigger>
        <TooltipContent className='z-50'>
          <p>Click to view blockchain attestation</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

"use client";

import { Badge } from "@/components/ui/badge";
import { Link2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
              bg-gradient-to-r from-blue-500 via-purple-500 to-yellow-500 bg-[length:200%_100%]
              hover:bg-[100%_0] bg-[0%_0]
              text-white border-none
              shadow-sm hover:shadow-md
              px-3 py-1 relative overflow-hidden z-40'
            onClick={() => window.open(attestationUrl, "_blank")}
          >
            <Link2 className='h-3 w-3' />
            <span className='font-medium'>EAS Certified</span>
          </Badge>
        </TooltipTrigger>
        <TooltipContent className='z-50'>
          <p>Click to view blockchain attestation</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

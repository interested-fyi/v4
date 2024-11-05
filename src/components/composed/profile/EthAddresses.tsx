"use client";

import { Copy, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export interface EthAddress {
  address: string;
  ensName?: string;
}

export function EthAddresses({ addresses }: { addresses: EthAddress[] }) {
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <Card className='mt-6 max-w-[343px]  w-full mx-auto'>
      <CardContent className='p-4'>
        <div className='space-y-2'>
          {addresses.map((item, index) => (
            <div
              key={index}
              className='flex items-center justify-between rounded-lg border p-3 py-1 shadow-sm'
            >
              <div className='space-y-1'>
                <p className='text-sm font-medium'>
                  {item.ensName ? (
                    <span className='text-blue-600 dark:text-blue-400'>
                      {item.ensName}
                    </span>
                  ) : (
                    truncateAddress(item.address)
                  )}
                </p>
              </div>
              <div className='flex gap-2'>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant='ghost'
                        size='icon'
                        className='h-8 w-8'
                        onClick={() => copyToClipboard(item.address)}
                      >
                        <Copy className='h-4 w-4' />
                        <span className='sr-only'>Copy address</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Copy address</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant='ghost'
                        size='icon'
                        className='h-8 w-8'
                        onClick={() =>
                          window.open(
                            `https://etherscan.io/address/${item.address}`,
                            "_blank"
                          )
                        }
                      >
                        <ExternalLink className='h-4 w-4' />
                        <span className='sr-only'>View on Etherscan</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>View on Etherscan</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

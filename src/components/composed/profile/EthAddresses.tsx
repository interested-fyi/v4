"use client";

import { ChevronDown, Copy, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useState } from "react";

export interface EthAddress {
  address: string;
  ensName?: string;
}

export function EthAddresses({ addresses }: { addresses: EthAddress[] }) {
  const [isOpen, setIsOpen] = useState(false);
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

  const AddressRow = ({ address, ensName }: EthAddress) => (
    <div className='flex items-center justify-between rounded-lg bg-white p-2 py-1 shadow-sm md:w-full'>
      <span
        className={
          ensName ? "text-blue-600 font-body" : "text-black font-mono text-sm"
        }
      >
        {ensName || truncateAddress(address)}
      </span>
      <div className='flex gap-2'>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant='ghost'
                size='icon'
                className='h-8 w-8 text-black'
                onClick={(e) => {
                  e.stopPropagation();
                  copyToClipboard(address);
                }}
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
                className='h-8 w-8 text-black'
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(
                    `https://etherscan.io/address/${address}`,
                    "_blank"
                  );
                }}
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
  );

  if (!addresses || addresses.length === 0) {
    return null;
  }

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className='md:w-full w-fit mx-auto'
    >
      <CollapsibleTrigger className='md:w-full'>
        <div className='flex items-center justify-between md:w-full'>
          <AddressRow {...addresses[0]} />
          {addresses && addresses.length > 1 ? (
            <ChevronDown
              className={`h-6 w-6 ml-2 transition-transform stroke-black ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          ) : null}
        </div>
      </CollapsibleTrigger>
      {addresses.length > 1 && (
        <CollapsibleContent className='space-y-2 pt-2'>
          {addresses.slice(1).map((address, index) => (
            <AddressRow key={index} {...address} />
          ))}
        </CollapsibleContent>
      )}
    </Collapsible>
  );
}

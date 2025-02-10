"use client";

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Medal } from "lucide-react";

interface POAP {
  id: string;
  event: {
    name: string;
    image_url: string;
  };
  created: string;
}

async function fetchPOAPs(addresses: string[]): Promise<POAP[]> {
  const fetchPOAPsForAddress = async (address: string): Promise<POAP[]> => {
    const response = await fetch("/api/poap/get-all-poaps?address=" + address);
    if (!response.ok) {
      throw new Error(`Failed to fetch POAPs for address: ${address}`);
    }
    return response.json();
  };

  const results = await Promise.all(addresses.map(fetchPOAPsForAddress));
  return results.flat();
}

export default function POAPDisplay({
  addresses,
}: {
  addresses: { address: string; ensName?: string }[];
}) {
  const {
    data: poaps,
    isLoading,
    error,
  } = useQuery<POAP[], Error>({
    enabled: !!addresses,
    queryKey: ["poaps", addresses],
    queryFn: () => fetchPOAPs(addresses.map((a) => a.address)),
  });

  if (error) {
    return (
      <p className='text-sm text-red-500'>
        Error loading POAPs: {error.message}
      </p>
    );
  }

  return (
    <motion.div
      className='w-full max-w-4xl bg-white rounded-3xl shadow-2xl p-6'
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className='text-2xl font-bold text-black mb-4 flex items-center'>
        <Medal className='w-6 h-6 mr-2 ' />
        POAP Collection
      </h2>
      {isLoading ? (
        <div className='grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-4'>
          {[...Array(16)].map((_, i) => (
            <Skeleton
              key={i}
              className='w-16 h-16 rounded-full bg-[#2640EB] bg-opacity-20'
            />
          ))}
        </div>
      ) : poaps && poaps.length > 0 ? (
        <div className='grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4'>
          {poaps.map((poap) => (
            <TooltipProvider key={poap.id}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className='relative w-16 h-16 rounded-full overflow-hidden place-self-center border-2 border-[#2640EB] hover:border-[#E8FC6C] transition-colors'>
                    <Image
                      src={poap.event.image_url || "/placeholder.svg"}
                      alt={poap.event.name}
                      layout='fill'
                      objectFit='cover'
                    />
                  </div>
                </TooltipTrigger>
                <TooltipContent
                  side='top'
                  className='max-w-[200px] bg-white border border-[#2640EB] text-[#2640EB]'
                >
                  <p className='font-medium'>{poap.event.name}</p>
                  <p className='text-xs text-[#2640EB] opacity-80'>
                    {new Date(poap.created).toLocaleDateString()}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
      ) : (
        <div className='text-[#2640EB] text-center p-4 bg-[#2640EB] bg-opacity-10 rounded-xl'>
          No POAPs found for this user.
        </div>
      )}
    </motion.div>
  );
}

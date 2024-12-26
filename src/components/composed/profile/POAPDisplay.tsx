"use client";

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface POAP {
  id: string;
  event: {
    name: string;
    image_url: string;
  };
  created: string;
}

async function fetchPOAPs(address: string): Promise<POAP[]> {
  const response = await fetch("/api/poap/get-all-poaps?address=" + address);
  if (!response.ok) {
    throw new Error("Failed to fetch POAPs");
  }
  return response.json();
}

export default function POAPDisplay({ address }: { address: string }) {
  const {
    data: poaps,
    isLoading,
    error,
  } = useQuery<POAP[], Error>({
    enabled: !!address,
    queryKey: ["poaps", address],
    queryFn: () => fetchPOAPs(address),
  });

  if (error) {
    return (
      <p className='text-sm text-red-500'>
        Error loading POAPs: {error.message}
      </p>
    );
  }

  return (
    <Card className='mt-4 overflow-hidden w-full h-full overflow-y-scroll mx-auto '>
      <CardContent className='p-2 sm:p-3'>
        {isLoading ? (
          <div className='grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2'>
            {[...Array(16)].map((_, i) => (
              <Skeleton key={i} className='w-12 h-12 rounded-full' />
            ))}
          </div>
        ) : poaps && poaps.length > 0 ? (
          <div className='grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 space-y-4'>
            {poaps.map((poap) => (
              <TooltipProvider key={poap.id}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className='relative w-12 h-12 rounded-full overflow-hidden place-self-center'>
                      <Image
                        src={poap.event.image_url}
                        alt={poap.event.name}
                        layout='fill'
                        objectFit='cover'
                      />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side='top' className='max-w-[200px]'>
                    <p className='font-medium'>{poap.event.name}</p>
                    <p className='text-xs text-muted-foreground'>
                      {new Date(poap.created).toLocaleDateString()}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>
        ) : (
          <p className='text-sm text-muted-foreground'>No POAPs found.</p>
        )}
      </CardContent>
    </Card>
  );
}

import React from "react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  UserCombinedProfile,
  WarpcastResponseObject,
} from "@/types/return_types";
export default function ActivityCard({
  message,
  userProfileData,
}: {
  message: WarpcastResponseObject;
  userProfileData:
    | { profile: UserCombinedProfile; success: boolean }
    | undefined;
}) {
  const castAddBody = message.data.castAddBody;
  const timestamp = message.data.timestamp * 1000;
  const customEpochDate = new Date("2021-01-01T00:00:00Z").getTime();
  const dateFromCustomEpoch = new Date(
    customEpochDate + timestamp
  ).toLocaleString();
  return (
    <Card className='p-4 w-full'>
      <div className='flex items-start gap-4'>
        <div className='w-full'>
          <div className='flex gap-2'>
            <Avatar>
              <AvatarImage
                src={
                  userProfileData?.profile?.farcaster_photo ??
                  "/placeholder.svg?height=40&width=40"
                }
                alt={userProfileData?.profile?.name ?? "User"}
              />
              <AvatarFallback>
                {userProfileData?.profile?.farcaster_username?.slice(0, 2) ??
                  userProfileData?.profile?.name?.slice(0, 2)}
              </AvatarFallback>
            </Avatar>

            <h3 className='font-semibold text-[#2640eb]'>
              {userProfileData?.profile?.name}
            </h3>
          </div>
          <p className='text-sm text-gray-500 font-medium font-body'>
            {dateFromCustomEpoch}
          </p>
          <p className='text-sm font-medium font-body leading-[21px] mt-1 text-gray-600 max-w-72 sm:max-w-[500px] md:max-w-fit w-full text-ellipsis overflow-hidden'>
            {castAddBody.text}
          </p>

          {castAddBody.embeds.length > 0 && (
            <a
              href={castAddBody.embeds[0].url}
              target='_blank'
              rel='noopener noreferrer'
              className='text-blue-600 text-sm underline mt-1 block'
            >
              View Embedded Link
            </a>
          )}
        </div>
      </div>
    </Card>
  );
}

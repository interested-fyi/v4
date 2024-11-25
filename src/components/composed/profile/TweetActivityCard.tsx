import React from "react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { usePrivy } from "@privy-io/react-auth";
import { UserCombinedProfile } from "@/types/return_types";
import Image from "next/image";

export type Tweet = {
  id: string;
  text: string;
  created_at: string;
  entities: {
    mentions?: {
      start: number;
      end: number;
      username: string;
    }[];
    urls?: {
      display_url: string;
      expanded_url: string;
      url: string;
      end: number;
      start: number;
    }[];
  };
};

export default function TweetActivityCard({
  tweet,
  userProfileData,
}: {
  tweet: Tweet;
  userProfileData:
    | { profile: UserCombinedProfile; success: boolean }
    | undefined;
}) {
  const twitterAvatar = userProfileData?.profile.x_photo;
  const twitterUserName = userProfileData?.profile.x_username;

  // Function to parse tweet text and replace mentions/URLs with hyperlinks or images
  const renderTweetText = (text: string, entities: Tweet["entities"]) => {
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;

    // Combine mentions and URLs into a single array and sort by position
    const replacements = [
      ...(entities?.mentions || []).map((mention) => ({
        start: mention.start,
        end: mention.end,
        type: "mention",
        value: `@${mention.username}`,
        href: `https://x.com/${mention.username}`,
      })),
      ...(entities?.urls || []).map((url) => ({
        start: url.start,
        end: url.end,
        type: "url",
        value: url.display_url,
        href: url.expanded_url,
      })),
    ].sort((a, b) => a.start - b.start);

    // Build the tweet content with hyperlinks or images
    replacements.forEach((replacement) => {
      console.log("🚀 ~ replacements.forEach ~ replacement:", replacement);
      if (lastIndex < replacement.start) {
        parts.push(text.slice(lastIndex, replacement.start));
      }

      if (replacement.type === "url" && replacement.href.includes("pic.x")) {
        parts.push(
          <Image
            key={`image-${replacement.start}`}
            src={replacement.href}
            alt='Tweet media'
            className='my-2 rounded-md'
          />
        );
      } else if (replacement.type === "mention" || replacement.type === "url") {
        parts.push(
          <a
            key={`${replacement.type}-${replacement.start}`}
            href={replacement.href}
            target='_blank'
            rel='noopener noreferrer'
            className='text-blue-600 underline'
          >
            {replacement.value}
          </a>
        );
      }

      lastIndex = replacement.end;
    });

    // Add any remaining text after the last entity
    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex));
    }

    return parts;
  };

  // const date = new Date(tweet.created_at).toLocaleString();

  return (
    <Card className='p-4 sm:p-8 w-full'>
      <div className='flex flex-col items-start gap-2'>
        <div className='flex gap-2'>
          <Avatar>
            <AvatarImage
              src={twitterAvatar || undefined}
              alt={twitterUserName || undefined}
            />
            <AvatarFallback>{twitterUserName?.slice(0, 2)}</AvatarFallback>
          </Avatar>

          <div className='flex flex-col gap-0 justify-center items-start'>
            <h3 className='font-semibold text-[#1DA1F2] items-center flex gap-2'>
              {twitterUserName} (@{twitterUserName})
            </h3>
            {/* <p className='text-xs text-gray-500 font-medium'>{date}</p> */}
          </div>
        </div>

        <div className='w-full flex flex-col gap-0'>
          <p className='text-sm font-medium text-gray-800 mt-1'>
            {renderTweetText(tweet.text, tweet.entities)}
          </p>
        </div>
      </div>
    </Card>
  );
}

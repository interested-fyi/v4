import React from "react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Image from "next/image";

type GitHubEvent = {
  id: string;
  type: string;
  actor: {
    login: string;
    avatar_url: string;
  };
  repo: {
    name: string;
    url: string;
  };
  payload: {
    commits?: { sha: string; message: string; url: string }[];
  };
  created_at: string;
};

export default function GitHubActivityCard({ event }: { event: GitHubEvent }) {
  const date = new Date(event.created_at).toLocaleString();
  const latestCommit = event.payload.commits?.[0];

  return (
    <Card className='p-4 sm:p-8 w-full'>
      <div className='flex flex-col items-start gap-2'>
        <div className='flex gap-2'>
          <Avatar>
            <AvatarImage src={event.actor.avatar_url} alt={event.actor.login} />
            <AvatarFallback>{event.actor.login?.slice(0, 2)}</AvatarFallback>
          </Avatar>

          <div className='flex flex-col gap-0 justify-center items-start'>
            <h3 className='font-semibold text-[#2640eb] items-center flex gap-2'>
              {event.actor.login}
              <span>
                <Image
                  src={"/svg/github_cat.svg"}
                  alt='GitHub'
                  width={16}
                  height={16}
                />
              </span>
            </h3>
            <p className='text-xs text-gray-500 font-medium'>{date}</p>
          </div>
        </div>
        <div className='w-full flex flex-col gap-0'>
          <p className='text-sm font-medium text-gray-600 mt-1'>
            {event.type === "PushEvent"
              ? `Pushed to ${event.repo.name}`
              : `Performed ${event.type}`}
          </p>
          {latestCommit && (
            <div className='mt-2'>
              <p className='text-sm font-body text-gray-600'>
                Commit: {latestCommit.message}
              </p>
              <a
                href={latestCommit.url}
                target='_blank'
                rel='noopener noreferrer'
                className='text-blue-600 text-sm underline mt-1 block'
              >
                View Commit
              </a>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

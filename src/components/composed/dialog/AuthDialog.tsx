"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { usePrivy, useLinkAccount } from "@privy-io/react-auth";
import { useEffect } from "react";

export default function AuthDialog({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { user, getAccessToken, unlinkGithub, unlinkFarcaster, unlinkLinkedIn, unlinkTelegram, unlinkTwitter } = usePrivy();
  const { linkGithub, linkFarcaster, linkLinkedIn, linkTelegram, linkTwitter, } = useLinkAccount({
    onSuccess: (user, linkMethod, linkedAccount) => {
      async function updateGithubUser(privy_did: string, email: string | null | undefined, name: string | null | undefined, username: string | null | undefined, subject: string | null | undefined) {
        const accessToken = await getAccessToken();
        const res = await fetch(
          `/api/users/linking/github`,
          {
            method: "POST",
            cache: "no-store",
            headers: {
              "Content-type": "application/json",
              "Authorization": `Bearer ${accessToken}`
            },
            body: JSON.stringify({
              privy_did: privy_did,
              email: email,
              name: name,
              username: username,
              subject: subject
            })
          }
        );
      }

      async function updateFarcasterUser(privy_did: string, fid: number | null | undefined, username: string | null | undefined, displayName: string | null | undefined, pfp: string | null | undefined, url: string | null | undefined, ownerAddress: string | null | undefined, bio: string | null | undefined) {
        const accessToken = await getAccessToken();
        const res = await fetch(
          `/api/users/linking/farcaster`,
          {
            method: "POST",
            cache: "no-store",
            headers: {
              "Content-type": "application/json",
              "Authorization": `Bearer ${accessToken}`
            },
            body: JSON.stringify({
              privy_did: privy_did,
              fid: fid, 
              username: username, 
              display_name: displayName, 
              pfp: pfp, 
              url: url, 
              owner_address: ownerAddress, 
              bio: bio
            })
          }
        );
      }

      async function updateLinkedInUser(privy_did: string, email: string | null | undefined, name: string | null | undefined, vanityName: string | null | undefined, subject: string | null | undefined) {
        const accessToken = await getAccessToken();
        const res = await fetch(
          `/api/users/linking/linkedin`,
          {
            method: "POST",
            cache: "no-store",
            headers: {
              "Content-type": "application/json",
              "Authorization": `Bearer ${accessToken}`
            },
            body: JSON.stringify({
              privy_did: privy_did,
              email: email,
              name: name,
              vanity_name: vanityName,
              subject: subject
            })
          }
        );
      }

      async function updateTelegramUser(privy_did: string, telegram_user_id: string | null | undefined, username: string | null | undefined, photo_url: string | null | undefined, first_name: string | null | undefined, last_name: string | null | undefined) {
        const accessToken = await getAccessToken();
        const res = await fetch(
          `/api/users/linking/telegram`,
          {
            method: "POST",
            cache: "no-store",
            headers: {
              "Content-type": "application/json",
              "Authorization": `Bearer ${accessToken}`
            },
            body: JSON.stringify({
              privy_did: privy_did,
              telegram_user_id: telegram_user_id, 
              username: username, 
              photo_url: photo_url, 
              first_name: first_name, 
              last_name: last_name
            })
          }
        );
      }

      async function updateTwitterUser(privy_did: string, name: string | null | undefined, username: string | null | undefined, profile_picture_url: string | null | undefined, subject: string | null | undefined) {
        const accessToken = await getAccessToken();
        const res = await fetch(
          `/api/users/linking/x`,
          {
            method: "POST",
            cache: "no-store",
            headers: {
              "Content-type": "application/json",
              "Authorization": `Bearer ${accessToken}`
            },
            body: JSON.stringify({
              privy_did: privy_did,
              name: name, 
              username: username, 
              profile_picture_url: profile_picture_url, 
              subject: subject
            })
          }
        );
      }

      switch (linkMethod) {
        case 'github':
          updateGithubUser(user?.id, user?.github?.email, user?.github?.name, user?.github?.username, user?.github?.subject);
          break;
        case 'farcaster':
          updateFarcasterUser(user?.id, user?.farcaster?.fid, user?.farcaster?.username, user?.farcaster?.displayName, user?.farcaster?.pfp, user?.farcaster?.url, user?.farcaster?.ownerAddress, user?.farcaster?.bio);
          break;
        case 'linkedin':
          updateLinkedInUser(user?.id, user?.linkedin?.email, user?.linkedin?.name, user?.linkedin?.vanityName, user?.linkedin?.subject);
          break;
        case 'telegram':
          updateTelegramUser(user?.id, user?.telegram?.telegramUserId, user?.telegram?.username, user?.telegram?.photoUrl, user?.telegram?.firstName, user?.telegram?.lastName);
          break;
        case 'twitter':
          updateTwitterUser(user?.id, user?.twitter?.name, user?.twitter?.username, user?.twitter?.profilePictureUrl, user?.twitter?.subject);
          break;          
      }
    }
  });

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className='sm:max-w-[425px] bg-[#F0F8FF]'>
        <DialogHeader>
          <DialogTitle className='text-2xl font-bold text-center'>
            LINK ACCOUNTS
          </DialogTitle>
        </DialogHeader>
        <div className='grid gap-4 py-4'>
          <Button
            variant='outline'
            className='w-full justify-start text-left font-normal'
            onClick={async () => {
              !!user?.github ? await unlinkGithub(user?.github.subject) : linkGithub()
            }}
          >
            <svg
              className='mr-2 h-4 w-4'
              aria-hidden='true'
              focusable='false'
              data-prefix='fab'
              data-icon='github'
              role='img'
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 496 512'
            >
              <path
                fill='currentColor'
                d='M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z'
              ></path>
            </svg>
            {!!user?.github ? `Unlink your GitHub: ${user?.github.username}` : "Link your GitHub"}
          </Button>
          <Button
            variant='outline'
            className='w-full justify-start text-left font-normal'
            onClick={async () => {
              !!user?.farcaster?.fid ? await unlinkFarcaster(user?.farcaster?.fid) : linkFarcaster()
            }}
          >
            <svg
              className='mr-2 h-4 w-4'
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
            >
              <path d='M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5'></path>
            </svg>
            {!!user?.farcaster ? `Unlink your Farcaster: ${user?.farcaster.username}` : "Link your Farcaster"}  
          </Button>
          <Button
            variant='outline'
            className='w-full justify-start text-left font-normal'
            onClick={async () => {
              !!user?.linkedin ? await unlinkLinkedIn(user?.linkedin.subject) : linkLinkedIn()
            }}
          >
            <svg
              className='mr-2 h-4 w-4'
              aria-hidden='true'
              focusable='false'
              data-prefix='fab'
              data-icon='linkedin'
              role='img'
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 448 512'
            >
              <path
                fill='currentColor'
                d='M416 32H31.9C14.3 32 0 46.5 0 64.3v383.4C0 465.5 14.3 480 31.9 480H416c17.6 0 32-14.5 32-32.3V64.3c0-17.8-14.4-32.3-32-32.3zM135.4 416H69V202.2h66.5V416zm-33.2-243c-21.3 0-38.5-17.3-38.5-38.5S80.9 96 102.2 96c21.2 0 38.5 17.3 38.5 38.5 0 21.3-17.2 38.5-38.5 38.5zm282.1 243h-66.4V312c0-24.8-.5-56.7-34.5-56.7-34.6 0-39.9 27-39.9 54.9V416h-66.4V202.2h63.7v29.2h.9c8.9-16.8 30.6-34.5 62.9-34.5 67.2 0 79.7 44.3 79.7 101.9V416z'
              ></path>
            </svg>
            {!!user?.linkedin ? `Unlink your LinkedIn: ${user?.linkedin.vanityName}` : "Link your LinkedIn"}
          </Button>
          <Button
            variant='outline'
            className='w-full justify-start text-left font-normal'
            onClick={async () => {
              !!user?.telegram ? await unlinkTelegram(user?.telegram.telegramUserId) : linkTelegram()
            }}
          >
            <svg
              className='mr-2 h-4 w-4'
              aria-hidden='true'
              focusable='false'
              data-prefix='fab'
              data-icon='telegram'
              role='img'
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 496 512'
            >
              <path
                fill='currentColor'
                d='M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm121.8 169.9l-40.7 191.8c-3 13.6-11.1 16.9-22.4 10.5l-62-45.7-29.9 28.8c-3.3 3.3-6.1 6.1-12.5 6.1l4.4-63.1 114.9-103.8c5-4.4-1.1-6.9-7.7-2.5l-142 89.4-61.2-19.1c-13.3-4.2-13.6-13.3 2.8-19.7l239.1-92.2c11.1-4 20.8 2.7 17.2 19.5z'
              ></path>
            </svg>
            {!!user?.telegram ? `Unlink your Telegram: ${user?.telegram.username}` : "Link your Telegram"}
          </Button>
          <Button
            variant='outline'
            className='w-full justify-start text-left font-normal'
            onClick={async () => {
              !!user?.twitter ? await unlinkTwitter(user?.twitter.subject) : linkTwitter()
            }}
          >
            <svg
              className='mr-2 h-4 w-4'
              aria-hidden='true'
              focusable='false'
              data-prefix='fab'
              data-icon='x-twitter'
              role='img'
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 512 512'
            >
              <path
                fill='currentColor'
                d='M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z'
              ></path>
            </svg>
            {!!user?.twitter ? `Unlink your X: ${user?.twitter.username}` : "Link your X"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

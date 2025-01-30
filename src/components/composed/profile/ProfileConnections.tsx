"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { usePrivy, useLinkAccount } from "@privy-io/react-auth";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { motion } from "framer-motion";
import {
  updateFarcasterUser,
  updateGithubUser,
  updateLinkedInUser,
  updateTelegramUser,
  updateTwitterUser,
  updateWalletUser,
} from "@/lib/updateSocialConnections";
import { completeTask } from "@/lib/completeTask";
import posthog from "posthog-js";

enum PROFILE_TYPE {
  GITHUB = "github",
  LINKEDIN = "linkedin",
  TELEGRAM = "telegram",
  TWITTER = "twitter",
  FARCASTER = "farcaster",
  WALLET = "wallet",
}

const profiles = [
  PROFILE_TYPE.GITHUB,
  PROFILE_TYPE.LINKEDIN,
  PROFILE_TYPE.FARCASTER,
  PROFILE_TYPE.TELEGRAM,
  PROFILE_TYPE.TWITTER,
  PROFILE_TYPE.WALLET,
];

const TaskMap = {
  [PROFILE_TYPE.GITHUB]: "github",
  [PROFILE_TYPE.LINKEDIN]: "linkedin",
  [PROFILE_TYPE.FARCASTER]: "farcaster",
  [PROFILE_TYPE.TELEGRAM]: "telegram",
  [PROFILE_TYPE.TWITTER]: "x",
  [PROFILE_TYPE.WALLET]: "wallet",
};

export const ProfileConnections = ({
  setTempPhotoUrl,
  onSetBestProfile,
  onSetProfile,
  userProfileData,
  onHandleLink,
}: {
  setTempPhotoUrl: (photo_url: string) => void;
  userProfileData: { success: boolean; profile: any } | undefined;
  onSetBestProfile?: (profile: string, imageURL?: string) => void;
  onSetProfile?: (profile: string) => void;
  onHandleLink?: (profile: string) => void;
}) => {
  const [bestProfile, setBestProfile] = useState<string | null>(null);

  const {
    user,
    getAccessToken,
    unlinkGithub,
    unlinkFarcaster,
    unlinkLinkedIn,
    unlinkTelegram,
    unlinkTwitter,
    unlinkWallet,
  } = usePrivy();

  const {
    linkGithub,
    linkFarcaster,
    linkLinkedIn,
    linkTelegram,
    linkTwitter,
    linkWallet,
  } = useLinkAccount({
    onSuccess: async (user, linkMethod, linkedAccount) => {
      const stepId = TaskMap[linkMethod as keyof typeof TaskMap];

      await completeTask(user.id, stepId);
      posthog.capture("quest_completed", {
        user_id: user.id,
        task_id: stepId,
        account: linkMethod,
      });
      const accessToken = await getAccessToken();
      if (!accessToken) return;
      switch (linkMethod) {
        case "github":
          updateGithubUser(
            user?.id,
            user?.github?.email,
            user?.github?.name,
            user?.github?.username,
            user?.github?.subject,
            accessToken
          );
          break;
        case "farcaster":
          updateFarcasterUser(
            user?.id,
            user?.farcaster?.fid,
            user?.farcaster?.username,
            user?.farcaster?.displayName,
            user?.farcaster?.pfp,
            user?.farcaster?.url,
            user?.farcaster?.ownerAddress,
            user?.farcaster?.bio,
            accessToken
          );
          if (!userProfileData?.profile?.photo_source && user?.farcaster?.pfp) {
            handleSelectPhoto(user?.farcaster?.pfp);
          }
          break;
        case "linkedin":
          updateLinkedInUser(
            user?.id,
            user?.linkedin?.email,
            user?.linkedin?.name,
            user?.linkedin?.vanityName,
            user?.linkedin?.subject,
            accessToken
          );
          break;
        case "telegram":
          updateTelegramUser(
            user?.id,
            user?.telegram?.telegramUserId,
            user?.telegram?.username,
            user?.telegram?.photoUrl,
            user?.telegram?.firstName,
            user?.telegram?.lastName,
            accessToken
          );
          if (
            !userProfileData?.profile?.photo_source &&
            user?.telegram?.photoUrl
          ) {
            handleSelectPhoto(user?.telegram?.photoUrl);
          }
          break;
        case "twitter":
          updateTwitterUser(
            user?.id,
            user?.twitter?.name,
            user?.twitter?.username,
            user?.twitter?.profilePictureUrl,
            user?.twitter?.subject,
            accessToken
          );
          if (
            !userProfileData?.profile?.photo_source &&
            user?.twitter?.profilePictureUrl
          ) {
            handleSelectPhoto(user?.twitter?.profilePictureUrl);
          }
          break;
        case "siwe":
          updateWalletUser(
            user?.id,
            linkedAccount?.type === "wallet" ? linkedAccount?.address : null,
            accessToken
          );
          break;
      }
    },
  });

  const updateUserProfileData = async (userProfileData: string | null) => {
    const accessToken = await getAccessToken();
    const res = await fetch(`/api/users/${user?.id}`, {
      method: "POST",
      cache: "no-store",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        preferredProfile: userProfileData,
        privyDid: user?.id,
      }),
    });
  };

  const handleSelectPhoto = async (photoUrl: string) => {
    setTempPhotoUrl(photoUrl);
  };

  useEffect(() => {
    if (userProfileData) {
      const profile = userProfileData?.profile?.preferred_profile;
      if (profile) {
        setBestProfile(profile);
      }
      if (onSetBestProfile && profile) {
        const image =
          profile === "twitter" || profile === "x"
            ? user?.linkedAccounts.find(
                (account) => account.type === "twitter_oauth"
              )?.profilePictureUrl
            : profile === "farcaster"
            ? user?.linkedAccounts.find(
                (account) => account.type === "farcaster"
              )?.pfp
            : profile === "telegram"
            ? user?.linkedAccounts.find(
                (account) => account.type === "telegram"
              )?.photoUrl
            : null;
        if (image) {
          onSetBestProfile(profile, image);
        } else {
          onSetBestProfile(profile);
        }
      }
    }
  }, [userProfileData]);

  const handleLink = async (linkMethod: string) => {
    onHandleLink && (await onHandleLink(linkMethod));
    await new Promise((resolve) => setTimeout(resolve, 750));
    switch (linkMethod) {
      case "github":
        linkGithub();
        break;
      case "farcaster":
        linkFarcaster();
        break;
      case "linkedin":
        linkLinkedIn();
        break;
      case "telegram":
        linkTelegram();
        break;
      case "twitter":
        linkTwitter();
        break;
      case "wallet":
        linkWallet();
        break;
    }
  };

  const deleteLinkMethodFromDB = async (
    linkMethod: string,
    privyDid: string,
    walletAddress?: string
  ) => {
    const accessToken = await getAccessToken();
    let body = {
      privy_did: privyDid,
    } as {
      privy_did: string;
      address_to_remove?: string;
    };
    if (walletAddress) {
      body = {
        ...body,
        address_to_remove: walletAddress,
      };
    }
    const res = await fetch(`/api/users/unlinking/${linkMethod}`, {
      method: "DELETE",
      cache: "no-store",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      return true;
    }
    return false;
  };

  const handleUnlink = async (linkMethod: string, address?: string) => {
    if (
      userProfileData &&
      userProfileData?.profile?.preferred_profile === linkMethod
    ) {
      updateUserProfileData(null);
    }

    const isDeleted = await deleteLinkMethodFromDB(
      linkMethod,
      user?.id as string,
      address
    );

    // if (!isDeleted) {
    //   console.error("Failed to delete link method from DB");
    //   return;
    // }

    switch (linkMethod) {
      case "github":
        if (user?.github?.subject) {
          unlinkGithub(user.github.subject);
        }
        break;
      case "farcaster":
        if (user?.farcaster?.fid) {
          unlinkFarcaster(user.farcaster.fid);
        }
        break;
      case "linkedin":
        if (user?.linkedin?.subject) {
          unlinkLinkedIn(user.linkedin.subject);
        }
        break;
      case "telegram":
        if (user?.telegram?.telegramUserId) {
          unlinkTelegram(user.telegram.telegramUserId);
        }
        break;
      case "twitter":
        if (user?.twitter?.subject) {
          unlinkTwitter(user.twitter.subject);
        }
        break;
      case "siwe":
        if (!!address) {
          unlinkWallet(address);
        }
    }
  };

  const linkedAccounts = user?.linkedAccounts.filter((linkedAccount: any) => {
    if (
      linkedAccount.type !== "smart_wallet" &&
      linkedAccount.type !== "google_oauth"
    ) {
      return linkedAccount;
    }
  });

  return (
    <>
      <div className='flex flex-col gap-2'>
        <div className='flex justify-between'>
          <Label>Profiles</Label>
          {linkedAccounts && linkedAccounts.length > 0 && (
            <Label>Select Primary Image</Label>
          )}
        </div>
        <div className='flex flex-col gap-4'>
          {userProfileData &&
            linkedAccounts?.map((linkedAccount: any) => {
              let accountName = "";

              if (
                linkedAccount.type === "wallet" &&
                linkedAccount.walletClient === "privy"
              ) {
                return;
              }
              if (
                linkedAccount.type === "smart_wallet" ||
                linkedAccount.type === "google_oauth"
              ) {
                return;
              }
              if (linkedAccount.type === "google_oauth") {
                accountName = "google";
              }
              if (linkedAccount.type === "twitter_oauth") {
                accountName = "twitter";
              }
              if (linkedAccount.type === "farcaster") {
                accountName = "farcaster";
              }
              if (linkedAccount.type === "linkedin_oauth") {
                accountName = "linkedin";
              }
              if (linkedAccount.type === "telegram") {
                accountName = "telegram";
              }
              if (linkedAccount.type === "github_oauth") {
                accountName = "github";
              }
              if (linkedAccount.type === "wallet") {
                accountName = linkedAccount?.address;
              }

              if (accountName) {
                return (
                  <div
                    className='flex w-full gap-4 items-center'
                    key={accountName}
                  >
                    <UnlinkAccountButton
                      profile={accountName}
                      linkType={linkedAccount.type}
                      handleUnlink={handleUnlink}
                    />
                    <div className='w-[40%] flex justify-center'>
                      {linkedAccount &&
                        (linkedAccount.profilePictureUrl ||
                          linkedAccount.pfp ||
                          linkedAccount.photoUrl) && (
                          <Checkbox
                            className='w-6 h-6'
                            checked={
                              bestProfile === accountName ||
                              (bestProfile === "x" && accountName === "twitter")
                            }
                            onCheckedChange={(e) => {
                              if (e.valueOf() === true) {
                                setBestProfile(accountName);
                                onSetBestProfile &&
                                  onSetBestProfile(accountName);
                              } else {
                                setBestProfile(null);
                                onSetBestProfile && onSetBestProfile("");
                              }
                            }}
                          />
                        )}
                    </div>
                  </div>
                );
              }
            })}
        </div>

        <div className='mt-2'>
          <LinkAccountSelect
            profiles={profiles.filter((account) => {
              if (
                account === "wallet" ||
                !linkedAccounts?.find((linkedAccount) => {
                  return linkedAccount.type
                    .toLocaleLowerCase()
                    .includes(account.toLocaleLowerCase());
                })
              ) {
                return account;
              }
            })}
            handleLink={handleLink}
          />
        </div>
      </div>
    </>
  );
};

interface LinkAccountSelectProps {
  profiles: string[];
  handleLink: (linkMethod: string) => void;
}

export const LinkAccountSelect: React.FC<LinkAccountSelectProps> = ({
  profiles,
  handleLink,
}) => {
  const [loading, setLoading] = useState(false);
  return (
    <div className='flex flex-col gap-4  max-w-xl mx-auto  rounded-xl font-heading'>
      {profiles.map((platform) => (
        <motion.div
          key={platform}
          className='group relative overflow-hidden rounded-lg bg-white shadow-md'
          whileHover={{ y: -2 }}
          whileTap={{ y: 0 }}
        >
          <div className='flex items-center justify-between p-2 px-3'>
            <div className='flex items-center gap-3'>
              <span className='text-lg font-medium text-gray-800'>
                {platform}
              </span>
            </div>
            <button
              onClick={async () => {
                setLoading(true);
                await handleLink(platform.toLowerCase());
                setLoading(false);
              }}
              disabled={loading}
              className='rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
            >
              Connect
            </button>
          </div>
          <div className='absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-blue-600 via-yellow-400 to-blue-600 transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100' />
        </motion.div>
      ))}
    </div>
    // <div className='flex flex-wrap gap-3 mt-1 items-start rounded-lg text-black'>
    //   {profiles.map((profile) => (
    //     <div className='w-full flex rounded-lg shadow-sm border items-center bg-gradient-to-r to-slate-200 via-yellow-100 from-blue-700 text-white p-3'>
    //       <p className='flex-grow font-bold font-heading'>
    //         {profile[0].toLocaleUpperCase() + profile.slice(1)}
    //       </p>
    //       <Button
    //         key={profile}
    //         className='bg-[#2640eb] text-yellow-200 w-40'
    //         onClick={() => handleLink(profile?.toLocaleLowerCase() ?? "")}
    //       >
    //         Connect
    //       </Button>
    //     </div>
    //   ))}
    // </div>
  );
};

interface UnlinkAccountButtonProps {
  profile: string | null;
  linkType: string;
  handleUnlink: (linkMethod: string, address?: string) => void;
}

export const UnlinkAccountButton: React.FC<UnlinkAccountButtonProps> = ({
  profile,
  linkType,
  handleUnlink,
}) => {
  const [loading, setLoading] = useState(false);
  if (!profile) return null;
  return (
    <motion.div
      className='group relative overflow-hidden rounded-lg bg-white w-full shadow-md font-heading'
      whileHover={{ y: -2 }}
      whileTap={{ y: 0 }}
    >
      <div className='flex items-center justify-between p-2 px-3'>
        <div className='flex items-center gap-3'>
          <span className='text-lg font-medium text-gray-800'>
            {profile.length > 10
              ? `${profile.slice(0, 6)}...${profile.slice(-4)}`
              : profile}
          </span>
        </div>
        <Button
          variant={"ghost"}
          disabled={loading}
          className='rounded-md  px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
          onClick={async () => {
            setLoading(true);
            await handleUnlink(
              linkType === "wallet" ? "siwe" : profile.toLowerCase(),
              linkType === "wallet" ? profile : undefined
            );
            setLoading(false);
          }}
        >
          <X className='h-4 w-4' />
        </Button>
      </div>
      <div className='absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-blue-600 via-yellow-400 to-blue-600 transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100' />
    </motion.div>
  );
};

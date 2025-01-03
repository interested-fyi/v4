"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { usePrivy, useLinkAccount } from "@privy-io/react-auth";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

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
  const [additionalProfile, setAdditionalProfile] = useState<string | null>(
    null
  );
  const [selectedProfile, setSelectedProfile] = useState<string | null>(null);
  const [addProfile, setAddProfile] = useState(false);

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
    onSuccess: (user, linkMethod, linkedAccount) => {
      async function updateGithubUser(
        privy_did: string,
        email: string | null | undefined,
        name: string | null | undefined,
        username: string | null | undefined,
        subject: string | null | undefined
      ) {
        const accessToken = await getAccessToken();
        const res = await fetch(`/api/users/linking/github`, {
          method: "POST",
          cache: "no-store",
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            privy_did: privy_did,
            email: email,
            name: name,
            username: username,
            subject: subject,
          }),
        });
      }

      async function updateFarcasterUser(
        privy_did: string,
        fid: number | null | undefined,
        username: string | null | undefined,
        displayName: string | null | undefined,
        pfp: string | null | undefined,
        url: string | null | undefined,
        ownerAddress: string | null | undefined,
        bio: string | null | undefined
      ) {
        const accessToken = await getAccessToken();
        const res = await fetch(`/api/users/linking/farcaster`, {
          method: "POST",
          cache: "no-store",
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            privy_did: privy_did,
            fid: fid,
            username: username,
            display_name: displayName,
            pfp: pfp,
            url: url,
            owner_address: ownerAddress,
            bio: bio,
          }),
        });
        if (!userProfileData?.profile?.photo_source && pfp) {
          handleSelectPhoto(pfp);
        }
      }

      async function updateLinkedInUser(
        privy_did: string,
        email: string | null | undefined,
        name: string | null | undefined,
        vanityName: string | null | undefined,
        subject: string | null | undefined
      ) {
        const accessToken = await getAccessToken();
        const res = await fetch(`/api/users/linking/linkedin`, {
          method: "POST",
          cache: "no-store",
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            privy_did: privy_did,
            email: email,
            name: name,
            vanity_name: vanityName,
            subject: subject,
          }),
        });
      }

      async function updateTelegramUser(
        privy_did: string,
        telegram_user_id: string | null | undefined,
        username: string | null | undefined,
        photo_url: string | null | undefined,
        first_name: string | null | undefined,
        last_name: string | null | undefined
      ) {
        const accessToken = await getAccessToken();
        const res = await fetch(`/api/users/linking/telegram`, {
          method: "POST",
          cache: "no-store",
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            privy_did: privy_did,
            telegram_user_id: telegram_user_id,
            username: username,
            photo_url: photo_url,
            first_name: first_name,
            last_name: last_name,
          }),
        });
        if (!userProfileData?.profile?.photo_source && photo_url) {
          handleSelectPhoto(photo_url);
        }
      }

      async function updateTwitterUser(
        privy_did: string,
        name: string | null | undefined,
        username: string | null | undefined,
        profile_picture_url: string | null | undefined,
        subject: string | null | undefined
      ) {
        const accessToken = await getAccessToken();
        const res = await fetch(`/api/users/linking/x`, {
          method: "POST",
          cache: "no-store",
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            privy_did: privy_did,
            name: name,
            username: username,
            profile_picture_url: profile_picture_url,
            subject: subject,
          }),
        });
        if (!userProfileData?.profile?.photo_source && profile_picture_url) {
          handleSelectPhoto(profile_picture_url);
        }
      }

      async function updateWalletUser(
        privy_did: string,
        wallet_address: string | null | undefined
      ) {
        const accessToken = await getAccessToken();
        const res = await fetch(`/api/users/linking/wallet`, {
          method: "POST",
          cache: "no-store",
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            privy_did: privy_did,
            wallet_address: [wallet_address],
          }),
        });
      }

      switch (linkMethod) {
        case "github":
          updateGithubUser(
            user?.id,
            user?.github?.email,
            user?.github?.name,
            user?.github?.username,
            user?.github?.subject
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
            user?.farcaster?.bio
          );
          break;
        case "linkedin":
          updateLinkedInUser(
            user?.id,
            user?.linkedin?.email,
            user?.linkedin?.name,
            user?.linkedin?.vanityName,
            user?.linkedin?.subject
          );
          break;
        case "telegram":
          updateTelegramUser(
            user?.id,
            user?.telegram?.telegramUserId,
            user?.telegram?.username,
            user?.telegram?.photoUrl,
            user?.telegram?.firstName,
            user?.telegram?.lastName
          );
          break;
        case "twitter":
          updateTwitterUser(
            user?.id,
            user?.twitter?.name,
            user?.twitter?.username,
            user?.twitter?.profilePictureUrl,
            user?.twitter?.subject
          );
          break;
        case "siwe":
          updateWalletUser(
            user?.id,
            linkedAccount?.type === "wallet" ? linkedAccount?.address : null
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
    setAddProfile(false);
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
    if (selectedProfile) {
      setAdditionalProfile(selectedProfile);
      onSetProfile && onSetProfile(selectedProfile);
      setSelectedProfile(null);
      setAddProfile(true);
    } else {
      setAdditionalProfile(null);
      setSelectedProfile(null);
      onSetProfile && onSetProfile("");
      setAddProfile(true);
    }
  };

  const handleUnlink = (linkMethod: string, address?: string) => {
    if (
      userProfileData &&
      userProfileData?.profile?.preferred_profile === linkMethod
    ) {
      updateUserProfileData(null);
    }

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
            <Label>Select Primary</Label>
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
              if (linkedAccount.type === "linkedin") {
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
                      handleUnlink={handleUnlink}
                      setProfile={setSelectedProfile}
                    />
                    <div className='w-[40%] flex justify-center'>
                      <Checkbox
                        className='w-6 h-6'
                        checked={
                          bestProfile === accountName ||
                          (bestProfile === "x" && accountName === "twitter")
                        }
                        onCheckedChange={(e) => {
                          if (e.valueOf() === true) {
                            setBestProfile(accountName);
                            onSetBestProfile && onSetBestProfile(accountName);
                          } else {
                            setBestProfile(null);
                            onSetBestProfile && onSetBestProfile("");
                          }
                        }}
                      />
                    </div>
                  </div>
                );
              }
            })}
        </div>

        {(addProfile || (!!linkedAccounts && linkedAccounts?.length === 0)) && (
          <div>
            <LinkAccountSelect
              profiles={profiles}
              selectedProfile={selectedProfile}
              setSelectedProfile={setSelectedProfile}
              handleLink={handleLink}
            />
          </div>
        )}
      </div>
      {!additionalProfile &&
        !addProfile &&
        !!linkedAccounts &&
        linkedAccounts?.length > 0 && (
          <Button
            variant='link'
            className='w-full mt-0 pt-0 text-blue-700'
            onClick={() => {
              setAddProfile(true);
              setSelectedProfile(null);
            }}
          >
            + Add another
          </Button>
        )}{" "}
    </>
  );
};

interface LinkAccountSelectProps {
  profiles: string[];
  selectedProfile: string | null;
  setSelectedProfile: (profile: string | null) => void;
  handleLink: (linkMethod: string) => void;
}

export const LinkAccountSelect: React.FC<LinkAccountSelectProps> = ({
  profiles,
  selectedProfile,
  setSelectedProfile,
  handleLink,
}) => {
  return (
    <div className='flex items-center rounded-lg text-black'>
      <Select
        onValueChange={(value) =>
          setSelectedProfile(profiles.find((p) => p === value) || null)
        }
      >
        <SelectTrigger className='w-full bg-white'>
          <SelectValue placeholder='Select profile' />
        </SelectTrigger>
        <SelectContent>
          {profiles.map((profile) => (
            <SelectItem key={profile} value={profile}>
              <span>{profile}</span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button
        className='ml-4 bg-[#2640eb]'
        onClick={() => handleLink(selectedProfile?.toLocaleLowerCase() ?? "")}
      >
        Link
      </Button>
    </div>
  );
};

interface UnlinkAccountButtonProps {
  profile: string | null;
  handleUnlink: (linkMethod: string) => void;
  setProfile: (profile: string | null) => void;
}

export const UnlinkAccountButton: React.FC<UnlinkAccountButtonProps> = ({
  profile,
  handleUnlink,
  setProfile,
}) => {
  if (!profile) return null;
  return (
    <div className='flex items-center bg-white rounded-lg text-black px-5 pr-2 w-full'>
      <span className='flex-grow'>
        {profile.length > 10
          ? `${profile.slice(0, 6)}...${profile.slice(-4)}`
          : profile}
      </span>
      <Button
        variant='ghost'
        size='icon'
        onClick={() => {
          setProfile(null);
          handleUnlink(profile.toLowerCase());
        }}
      >
        <X className='h-4 w-4' />
      </Button>
    </div>
  );
};

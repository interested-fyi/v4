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
import { X, Github, Linkedin, Twitter } from "lucide-react";
import warpcast from "/public/svg/warpcast.svg";
import Telegram from "/public/svg/telegram.svg";

type Profile = {
  name: PROFILE_TYPE;
  icon:
    | typeof Github
    | typeof Linkedin
    | typeof warpcast
    | typeof Telegram
    | typeof Twitter;
};

enum PROFILE_TYPE {
  GITHUB = "github",
  LINKEDIN = "linkedin",
  TELEGRAM = "telegram",
  TWITTER = "twitter",
  FARCASTER = "farcaster",
}

const profiles: Profile[] = [
  { name: PROFILE_TYPE.GITHUB, icon: Github },
  { name: PROFILE_TYPE.LINKEDIN, icon: Linkedin },
  { name: PROFILE_TYPE.FARCASTER, icon: warpcast },
  { name: PROFILE_TYPE.TELEGRAM, icon: Telegram },
  { name: PROFILE_TYPE.TWITTER, icon: Twitter },
];

export const ProfileConnections = ({
  setTempPhotoUrl,
  userProfileData,
}: {
  setTempPhotoUrl: (photo_url: string) => void;
  userProfileData: { success: boolean; profile: any } | undefined;
}) => {
  const [bestProfile, setBestProfile] = useState<Profile | null>(null);
  const [additionalProfile, setAdditionalProfile] = useState<Profile | null>(
    null
  );
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [addProfile, setAddProfile] = useState(false);

  const {
    user,
    getAccessToken,
    unlinkGithub,
    unlinkFarcaster,
    unlinkLinkedIn,
    unlinkTelegram,
    unlinkTwitter,
  } = usePrivy();

  const { linkGithub, linkFarcaster, linkLinkedIn, linkTelegram, linkTwitter } =
    useLinkAccount({
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
          if (!userProfileData?.profile.photo_source && pfp) {
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
          if (!userProfileData?.profile.photo_source && photo_url) {
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
          if (!userProfileData?.profile.photo_source && profile_picture_url) {
            handleSelectPhoto(profile_picture_url);
          }
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
        }
      },
    });

  const updateUserProfileData = async (
    userProfileData: PROFILE_TYPE | null
  ) => {
    const accessToken = await getAccessToken();
    const res = await fetch(`/api/users/profiles/${user?.id}`, {
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
    const accessToken = await getAccessToken();
    const res = await fetch(`/api/users/profiles/update-photo/${user?.id}`, {
      method: "POST",
      cache: "no-store",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        photoSource: photoUrl,
        privyDid: user?.id,
      }),
    });
    if (res.ok) {
      setTempPhotoUrl(photoUrl);
    }
  };

  useEffect(() => {
    if (userProfileData) {
      setBestProfile(
        profiles.find(
          (p) => p.name === userProfileData.profile.preferred_profile
        ) || null
      );
    }
  }, [userProfileData]);

  const handleLink = (linkMethod: string, isBestProfile: boolean) => {
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
    }
    if (selectedProfile) {
      if (isBestProfile) {
        setBestProfile(selectedProfile);
        try {
          updateUserProfileData(selectedProfile.name);
        } catch (e) {
          console.log(e);
        }
      } else {
        setAdditionalProfile(selectedProfile);
      }
      setSelectedProfile(null);
    }
  };

  const handleUnlink = (linkMethod: string) => {
    if (
      userProfileData &&
      userProfileData.profile.preferred_profile === linkMethod
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
    }
  };

  return (
    <>
      <div className='flex flex-col gap-2'>
        <Label>Best profile:</Label>
        {bestProfile ? (
          <UnlinkAccountButton
            profile={bestProfile}
            handleUnlink={handleUnlink}
            setProfile={setBestProfile}
          />
        ) : (
          <LinkAccountSelect
            profiles={profiles}
            selectedProfile={selectedProfile}
            setSelectedProfile={setSelectedProfile}
            handleLink={handleLink}
            isBestProfile={true}
          />
        )}
        {userProfileData &&
          user?.linkedAccounts?.map((linkedAccount: any) => {
            const accountName = linkedAccount.type.replace("_oauth", "");
            if (accountName === "wallet") return;

            const profileData = profiles.find(
              (p) => p.name === linkedAccount.type.replace("_oauth", "")
            );

            if (
              accountName !== userProfileData.profile.preferred_profile &&
              profileData
            ) {
              return (
                <div key={linkedAccount}>
                  <UnlinkAccountButton
                    profile={profileData}
                    handleUnlink={handleUnlink}
                    setProfile={setSelectedProfile}
                  />
                </div>
              );
            }
            return null;
          })}
        {addProfile && (
          <div>
            <LinkAccountSelect
              profiles={profiles}
              selectedProfile={selectedProfile}
              setSelectedProfile={setSelectedProfile}
              handleLink={handleLink}
              isBestProfile={false}
            />
          </div>
        )}
      </div>

      {bestProfile && !additionalProfile && !addProfile && (
        <Button
          variant='link'
          className='w-full mt-2 text-blue-700'
          onClick={() => {
            setAddProfile(true);
            setSelectedProfile(null);
          }}
        >
          + Add another
        </Button>
      )}
    </>
  );
};

interface LinkAccountSelectProps {
  profiles: Profile[];
  selectedProfile: Profile | null;
  setSelectedProfile: (profile: Profile | null) => void;
  handleLink: (linkMethod: string, isBestProfile: boolean) => void;
  isBestProfile: boolean;
}

export const LinkAccountSelect: React.FC<LinkAccountSelectProps> = ({
  profiles,
  selectedProfile,
  setSelectedProfile,
  handleLink,
  isBestProfile,
}) => {
  return (
    <div className='flex items-center mt-2  rounded-lg text-black'>
      <Select
        onValueChange={(value) =>
          setSelectedProfile(profiles.find((p) => p.name === value) || null)
        }
      >
        <SelectTrigger className='w-full bg-white'>
          <SelectValue placeholder='Select profile' />
        </SelectTrigger>
        <SelectContent>
          {profiles.map((profile) => (
            <SelectItem key={profile.name} value={profile.name}>
              {profile.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button
        className='ml-4 bg-[#2640eb]'
        onClick={() =>
          handleLink(
            selectedProfile?.name.toLocaleLowerCase() ?? "",
            isBestProfile
          )
        }
      >
        Link
      </Button>
    </div>
  );
};

interface UnlinkAccountButtonProps {
  profile: Profile;
  handleUnlink: (linkMethod: string) => void;
  setProfile: (profile: Profile | null) => void;
}

export const UnlinkAccountButton: React.FC<UnlinkAccountButtonProps> = ({
  profile,
  handleUnlink,
  setProfile,
}) => {
  if (!profile) return null;
  return (
    <div className='flex items-center mt-2 bg-white rounded-lg text-black px-5 pr-2'>
      {profile.icon ? <profile.icon className='mr-2' /> : null}
      <span className='flex-grow'>{profile.name}</span>
      <Button
        variant='ghost'
        size='icon'
        onClick={() => {
          setProfile(null);
          handleUnlink(profile.name.toLowerCase());
        }}
      >
        <X className='h-4 w-4' />
      </Button>
    </div>
  );
};

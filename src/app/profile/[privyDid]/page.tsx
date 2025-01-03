"use client";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { usePrivy } from "@privy-io/react-auth";
import { UserCombinedProfile } from "@/types/return_types";
import { useParams } from "next/navigation";
import EndorseDialog from "@/components/composed/dialog/EndorseDialog";
import { useEffect, useState } from "react";
import { SearchIcon } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { fetchEthAddresses, fetchUserProfile } from "@/lib/api/helpers";
import SwitchButtonGroup from "@/components/composed/buttons/SwitchButtonGroup";
import ProfileSkeleton from "@/components/composed/profile/ProfileSkeleton";
import SocialLinks from "@/components/composed/profile/SocialLinks";
import ActivityTab from "@/components/composed/profile/ActivityTab";
import EndorementsTab from "@/components/composed/profile/EndorsementsTab";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SOCIALFEED } from "@/types/feeds";
import { getEnsName } from "@wagmi/core";
import { wagmiConfig } from "@/lib/wagmiClient";
import {
  EthAddress,
  EthAddresses,
} from "@/components/composed/profile/EthAddresses";
import POAPDisplay from "@/components/composed/profile/POAPDisplay";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

enum TAB {
  ACTIVITY,
  ENDORSEMENT,
}

export default function ProfilePage() {
  const [endorseDialogOpen, setEndorseDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TAB>(TAB.ACTIVITY);
  const [activityFeed, setActivityFeed] = useState<SOCIALFEED>(
    SOCIALFEED.FARCASTER
  );
  const [addressData, setAddressData] = useState<EthAddress[] | null>(null);
  const { user } = usePrivy();
  const params = useParams();
  const { toast } = useToast();

  const privyDid = params.privyDid as string;
  const { data: userProfileData, isLoading: userProfileLoading } = useQuery({
    enabled: !!privyDid,
    queryKey: ["user", privyDid.replace("did:privy:", "")],
    queryFn: async () => fetchUserProfile({ userId: privyDid }),
  });

  const { data: ethAddresses, isLoading: ethAddressesLoading } = useQuery({
    enabled: !!userProfileData?.profile?.farcaster_fid,
    queryKey: ["ethAddresses", privyDid.replace("did:privy:", "")],
    queryFn: async () => {
      if (userProfileData?.profile?.farcaster_fid)
        return fetchEthAddresses([userProfileData?.profile?.farcaster_fid]);
    },
  });

  const privyConnectedAddresses = user?.linkedAccounts
    ?.filter((acc) => acc.type === "wallet" && acc.walletClientType !== "privy")
    .map((acc) => (acc.type === "wallet" ? acc.address : null));
  useEffect(() => {
    if (ethAddresses?.[0]?.ethAddresses.length > 0 || privyConnectedAddresses) {
      // Create an async function to fetch ENS names
      const combinedAddresses =
        privyConnectedAddresses && ethAddresses
          ? [...privyConnectedAddresses, ...ethAddresses[0].ethAddresses]
          : privyConnectedAddresses
          ? privyConnectedAddresses
          : ethAddresses[0].ethAddresses;
      const fetchEnsNames = async () => {
        try {
          const ensData = (await Promise.all(
            combinedAddresses.map(async (address: `0x${string}`) => {
              try {
                const ensName = await getEnsName(wagmiConfig, { address });
                return { address, ensName };
              } catch (err) {
                console.error("Error fetching ENS name:", err);
                return { address, ensName: null };
              }
            })
          )) as EthAddress[];

          setAddressData(ensData);
        } catch (error) {
          console.error("Error in fetching ENS names:", error);
        }
      };

      fetchEnsNames();
    }
  }, [ethAddresses, privyConnectedAddresses, userProfileData]);

  const handleCopyToClipboard = async () => {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(
        `${window.location.origin}/profile/${privyDid}`
      );
    }
    toast({
      title: "Copied to clipboard",
      description: "Your profile link has been copied to your clipboard.",
    });
  };

  if (userProfileLoading) {
    return <ProfileSkeleton />;
  }

  const socialLinks = [
    {
      platform: "telegram",
      url: userProfileData?.profile?.telegram_username
        ? `https://t.me/${userProfileData?.profile?.telegram_username}`
        : null,
      image: "/svg/blue-logos/telegram.svg",
      alt: "telegram",
    },
    {
      platform: "github",
      url: userProfileData?.profile?.github_username
        ? `https://github.com/${userProfileData?.profile?.github_username}`
        : null,
      image: "/svg/blue-logos/github.svg",
      alt: "github",
    },
    {
      platform: "linkedin",
      url: userProfileData?.profile?.linkedin_name
        ? `https://linkedin.com/in/${userProfileData?.profile?.linkedin_name}`
        : null,
      image: "/svg/blue-logos/linkedin.svg",
      alt: "linkedin",
    },
    {
      platform: "farcaster",
      url: userProfileData?.profile?.farcaster_username
        ? `https://warpcast.com/${userProfileData?.profile?.farcaster_username}`
        : null,
      image: "/svg/blue-logos/farcast.svg",
      alt: "farcaster",
    },
    {
      platform: "x",
      url: userProfileData?.profile?.x_username
        ? `https://x.com/${userProfileData?.profile?.x_username}`
        : null,
      image: "/svg/blue-logos/x.svg",
      alt: "x",
    },
  ];

  const connectedSocials = socialLinks.filter((social) => social.url);

  return (
    <div className='flex flex-col items-center min-h-screen bg-[#2640eb] text-white p-4 pt-0 px-0 md:p-8'>
      <div className='relative flex md:flex-row flex-col w-full max-w-5xl bg-white overflow-hidden'>
        <div className='bg-[#2640eb] h-[135px]'></div>
        <div className='relative px-4 pb-4 md:pt-4 bg-[#e1effe]'>
          <Avatar className='w-[140px] h-[140px] border-4 border-white rounded-full absolute -top-[100px] md:relative md:top-0 left-1/2 transform -translate-x-1/2'>
            <AvatarImage
              src={userProfileData?.profile?.photo_source ?? ""}
              alt='Profile picture'
            />
            <AvatarFallback>
              {userProfileData?.profile?.name?.slice(0, 2) ??
                user?.google?.name?.slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div className='pt-16 md:pt-2 flex flex-col gap-2 text-center max-w-[343px] mx-auto'>
            <h1 className='text-[#2640eb] text-xl font-semibold font-body leading-[30px]'>
              {userProfileData?.profile?.name ?? "Chester LaCroix"}
            </h1>
            {addressData ? <EthAddresses addresses={addressData} /> : null}
            <p className='text-gray-700 text-sm font-semibold font-body leading-[21px]'>
              {userProfileData?.profile?.bio ??
                "Short bio here? Do we have this in the profile editing flow somewhere - yes we do"}
            </p>
            <div className='absolute -top-28 right-0'>
              {user?.id === userProfileData?.profile?.privy_did ? null : ( // </Button> //   /> //     width={16} //     height={16} //     alt='edit' //     src='/svg/pencil.svg' //   <Image // <Button className='h-8 pl-[11px] pr-3 py-2 bg-[#919cf4] hover:bg-[#919cf4] hover:bg-opacity-90 rounded-lg justify-center items-center gap-2 inline-flex'>
                <Button
                  onClick={handleCopyToClipboard}
                  className='h-8 pl-[11px] pr-3 py-2 bg-[#919cf4] hover:bg-[#919cf4] hover:bg-opacity-90 rounded-lg justify-center items-center gap-2 inline-flex'
                >
                  <Image
                    src='/svg/share.svg'
                    alt='like'
                    height={16}
                    width={16}
                  />
                </Button>
              )}
            </div>
            <div className='w-full inline-flex items-center justify-center space-x-2'>
              {userProfileData?.profile?.position ||
              userProfileData?.profile?.employment_type ? (
                <div className='inline-flex items-center justify-center  rounded-lg px-3 py-1'>
                  <SearchIcon className='w-5 h-5 stroke-blue-600' />
                </div>
              ) : null}
              {userProfileData?.profile?.employment_type ? (
                <div className='inline-flex items-center justify-center bg-blue-100 rounded-lg px-3 py-1'>
                  <span className='text-sm font-medium text-blue-800'>
                    {userProfileData?.profile?.employment_type?.[0]}
                  </span>
                </div>
              ) : null}
              {userProfileData?.profile?.position ? (
                <div className='inline-flex items-center justify-center bg-blue-100 rounded-lg px-3 py-1'>
                  <span className='text-sm font-medium text-blue-800'>
                    {userProfileData?.profile?.position?.[0]}
                  </span>
                </div>
              ) : null}
            </div>
          </div>
          <div className='flex justify-center gap-2 mt-8 max-w-[343px] mx-auto'>
            {/* <Button
              className='flex-1 bg-white border border-black text-gray-700 text-xs font-medium font-body leading-[18px] hover:bg-[#2640eb] hover:text-yellow-200
            '
            >
              Support builder
              <Image
                className='ml-2'
                src={"/svg/gift.svg"}
                alt='gift'
                height={16}
                width={16}
              />
            </Button> */}
            <EndorseButton setEndorseDialogOpen={setEndorseDialogOpen} />
            {endorseDialogOpen && userProfileData?.profile && (
              <EndorseDialog
                isOpen={endorseDialogOpen}
                onClose={() => setEndorseDialogOpen(false)}
                user={userProfileData?.profile as UserCombinedProfile}
              />
            )}
          </div>

          {/* <div className='w-full flex justify-center mt-4'>
            <div className='w-[343px] h-[34px] relative'>
              <div className='w-[343px] h-[34px] pl-3 pr-[11px] py-2 left-0 top-1 absolute opacity-40 bg-white rounded-lg border border-gray-700 blur-[3px] justify-center items-center gap-2 inline-flex'>
                <div className='text-gray-700 text-xs font-medium font-body leading-[18px]'>
                  Schedule a call
                </div>
                <div className='w-4 h-4 relative' />
              </div>
              <Button
                variant={"link"}
                className='w-[343px]  hover:no-underline bg-transparent absolute text-center text-[#2640eb] text-sm font-semibold font-body leading-[21px]'
              >
                Unlock scheduling for $15
              </Button>
            </div>
          </div> */}
          <SocialLinks connectedSocials={connectedSocials} />
        </div>
        <div className='w-full flex flex-col md:items-center md:justify-start md:gap-4 md:mt-4 px-2'>
          {/* <div className='mt-8'>
            <SwitchButtonGroup
              buttons={[
                {
                  text: "ACTIVITY",
                  onClick: () => {
                    setActiveTab(TAB.ACTIVITY);
                  },
                  isActive: activeTab === TAB.ACTIVITY,
                },
                {
                  text: "ENDORSEMENTS",
                  onClick: () => {
                    setActiveTab(TAB.ENDORSEMENT);
                  },
                  isActive: activeTab === TAB.ENDORSEMENT,
                },
              ]}
              svgOnClick={() => {
                if (activeTab === TAB.ACTIVITY) {
                  setActiveTab(TAB.ENDORSEMENT);
                } else {
                  setActiveTab(TAB.ACTIVITY);
                }
              }}
            />
          </div>
          <div className='w-full flex flex-col'>
            <h2 className='text-gray-600 text-xl font-bold font-body text-center mt-7 mb-6'>
              {activeTab === TAB.ACTIVITY ? "Activity" : "Endorsements"}
            </h2>
            {activeTab === TAB.ENDORSEMENT && (
              <EndorementsTab
                userProfileData={userProfileData}
                privyDid={privyDid}
              />
            )}
            {activeTab === TAB.ACTIVITY ? (
              <>
                {userProfileData?.profile?.farcaster_name ||
                userProfileData?.profile?.github_username ? (
                  <Select
                    onValueChange={(value) =>
                      setActivityFeed(value as SOCIALFEED)
                    }
                  >
                    <SelectTrigger className='w-[180px] mb-2 text-black placeholder:text-gray-700'>
                      <SelectValue
                        className='text-black placeholder:text-black'
                        placeholder='Select a feed'
                      />
                    </SelectTrigger>
                    <SelectContent className='text-body text-black'>
                      {userProfileData?.profile?.github_username && (
                        <SelectItem
                          className='text-black'
                          value={SOCIALFEED.GITHUB}
                        >
                          Github
                        </SelectItem>
                      )}
                      {userProfileData?.profile?.farcaster_name && (
                        <SelectItem
                          className='text-black'
                          value={SOCIALFEED.FARCASTER}
                        >
                          Farcaster
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                ) : null}
                <ActivityTab
                  userProfileData={userProfileData}
                  activeFeed={activityFeed}
                />
              </>
            ) : null}
          </div> */}
          <Tabs defaultValue='activity' className='w-full '>
            <TabsList className='h-14 sm:h-10 my-2 md:my-0'>
              <TabsTrigger className='h-12 sm:h-8' value='activity'>
                activity
              </TabsTrigger>
              <TabsTrigger className='h-12 sm:h-8' value='onchain'>
                onchain
              </TabsTrigger>
              <TabsTrigger className='h-12 sm:h-8' value='endorsements'>
                endorsements
              </TabsTrigger>
            </TabsList>
            <TabsContent
              className='pb-4 h-full min-h-96 place-self-start w-full'
              value='activity'
            >
              <>
                {userProfileData?.profile?.farcaster_name ||
                userProfileData?.profile?.github_username ? (
                  <Select
                    onValueChange={(value) =>
                      setActivityFeed(value as SOCIALFEED)
                    }
                  >
                    <SelectTrigger className='w-[180px] mb-2 text-black placeholder:text-gray-700'>
                      <SelectValue
                        className='text-black placeholder:text-black'
                        placeholder='Select a feed'
                      />
                    </SelectTrigger>
                    <SelectContent className='text-body text-black'>
                      {userProfileData?.profile?.github_username && (
                        <SelectItem
                          className='text-black'
                          value={SOCIALFEED.GITHUB}
                        >
                          Github
                        </SelectItem>
                      )}
                      {userProfileData?.profile?.farcaster_name && (
                        <SelectItem
                          className='text-black'
                          value={SOCIALFEED.FARCASTER}
                        >
                          Farcaster
                        </SelectItem>
                      )}
                      {userProfileData?.profile?.x_username && (
                        <SelectItem className='text-black' value={SOCIALFEED.X}>
                          X
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                ) : null}
                <ActivityTab
                  userProfileData={userProfileData}
                  activeFeed={activityFeed}
                />
              </>
            </TabsContent>
            <TabsContent
              className='pb-4 h-full min-h-96 place-self-start w-full'
              value='onchain'
            >
              <POAPDisplay address={addressData?.[0].address ?? ""} />
            </TabsContent>
            <TabsContent
              className='pb-4 h-full min-h-96 place-self-start w-full'
              value='endorsements'
            >
              <EndorementsTab
                userProfileData={userProfileData}
                privyDid={privyDid}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

function EndorseButton({
  setEndorseDialogOpen,
}: {
  setEndorseDialogOpen: (val: boolean) => void;
}) {
  return (
    <Button
      className='flex-1 bg-white border border-black text-gray-700 text-xs font-medium font-body leading-[18px] hover:bg-[#2640eb] hover:text-yellow-200'
      onClick={() => setEndorseDialogOpen(true)}
    >
      Endorse
      <Image
        className='ml-2'
        src={"/svg/hand.svg"}
        alt='hand'
        height={16}
        width={16}
      />
    </Button>
  );
}

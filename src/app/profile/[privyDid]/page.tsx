"use client";
import Link from "next/link";
import { updateWalletUser } from "@/lib/updateSocialConnections";
import posthog from "posthog-js";
import { completeTask } from "@/lib/completeTask";
import { TaskMap } from "@/components/composed/profile/ProfileConnections";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { useLinkAccount, usePrivy, User } from "@privy-io/react-auth";
import { UserCombinedProfile } from "@/types/return_types";
import { useParams } from "next/navigation";
import EndorseDialog from "@/components/composed/dialog/EndorseDialog";
import { useEffect, useState } from "react";
import { Loader, SearchIcon } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { fetchEthAddresses, fetchUserProfile } from "@/lib/api/helpers";
import ProfileSkeleton from "@/components/composed/profile/ProfileSkeleton";
import SocialLinks from "@/components/composed/profile/SocialLinks";
import ActivityTab from "@/components/composed/profile/ActivityTab";
import EndorementsTab from "@/components/composed/profile/EndorsementsTab";
import { motion } from "framer-motion";
import { Star, Activity, Zap, Sparkles, TrendingUp, Flame } from "lucide-react";
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

export default function ProfilePage() {
  const [endorseDialogOpen, setEndorseDialogOpen] = useState(false);
  const [activityFeed, setActivityFeed] = useState<SOCIALFEED>(
    SOCIALFEED.FARCASTER
  );
  const [addressData, setAddressData] = useState<EthAddress[] | null>(null);
  const [openTab, setOpenTab] = useState("activity");
  const { user } = usePrivy();
  const params = useParams();
  const { toast } = useToast();

  const privyDid = params.privyDid as string;
  const { data: userProfileData, isLoading: userProfileLoading } = useQuery({
    enabled: !!privyDid,
    queryKey: ["user", privyDid.replace("did:privy:", "")],
    queryFn: async () => fetchUserProfile({ userId: privyDid }),
  });

  const { data: ethAddresses } = useQuery({
    enabled: !!userProfileData?.profile?.farcaster_fid,
    queryKey: ["ethAddresses", privyDid.replace("did:privy:", "")],
    queryFn: async () => {
      if (userProfileData?.profile?.farcaster_fid)
        return fetchEthAddresses([userProfileData?.profile?.farcaster_fid]);
    },
  });

  useEffect(() => {
    const privyConnectedAddresses = userProfileData?.profile?.wallet_addresses
      ? userProfileData?.profile?.wallet_addresses
      : null;

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

      const setTabFromQuery = () => {
        const tab = new URLSearchParams(window.location.search).get("tab");
        if (tab) {
          setOpenTab(tab);
        }
      };
      setTabFromQuery();
      fetchEnsNames();
    }
  }, [userProfileData, ethAddresses]);

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

  const handleTabChange = (tab: string) => {
    setOpenTab(tab);
    window.history.pushState({}, "", `${window.location.pathname}?tab=${tab}`);
  };
  const connectedSocials = socialLinks.filter((social) => social.url);

  const isOwnProfile = user?.id === userProfileData?.profile?.privy_did;

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
            {!isOwnProfile && (
              <EndorseButton setEndorseDialogOpen={setEndorseDialogOpen} />
            )}
            {endorseDialogOpen && userProfileData?.profile && (
              <EndorseDialog
                isOpen={endorseDialogOpen}
                onClose={() => setEndorseDialogOpen(false)}
                user={userProfileData?.profile as UserCombinedProfile}
              />
            )}
          </div>

          <SocialLinks connectedSocials={connectedSocials} />
        </div>
        <div className='w-full flex flex-col md:items-center md:justify-start md:gap-4 md:mt-4 px-2'>
          <Tabs defaultValue='activity' className='w-full ' value={openTab}>
            <TabsList className='h-14 sm:h-10 my-2 md:my-0'>
              <TabsTrigger
                className='h-12 sm:h-8'
                value='activity'
                onClick={() => handleTabChange("activity")}
              >
                activity
              </TabsTrigger>
              <TabsTrigger
                className='h-12 sm:h-8'
                value='onchain'
                onClick={() => handleTabChange("onchain")}
              >
                onchain
              </TabsTrigger>
              <TabsTrigger
                className='h-12 sm:h-8'
                value='endorsements'
                onClick={() => handleTabChange("endorsements")}
              >
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
              <div className='flex flex-col gap-4 justify-start items-center min-h-screen bg-white p-4'>
                <DegenScoreBeacon
                  address={
                    userProfileData?.profile?.wallet_addresses?.[0] ?? ""
                  }
                  user={userProfileData?.profile}
                />
                <POAPDisplay addresses={addressData ?? []} />
              </div>
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

const fetchDegenScore = async ({ address }: { address: string }) => {
  const res = await fetch(`https://beacon.degenscore.com/v2/beacon/${address}`);
  return res.json() as Promise<DegenScoreResponse>;
};

export interface DegenScoreResponse {
  name: string;
  description: string;
  image: string;
  properties: {
    DegenScore: number;
    "Onchain Actions": number;
    "Onchain Activity": number;
  };
  updatedAt: string;
  external_url: string;
  animation_url: string;
  traits: {
    actions: {
      name: string;
      description: string;
      score: number;
      metadata: {
        actions: {
          actions: {
            name: string;
            description: string;
            actionTier: string;
          }[];
        };
      };
    };
    activity: {
      name: string;
      description: string;
      score: number;
      metadata: {
        activity: {
          title: string;
          rank: string;
          categoryMetric: {
            frequency: string;
            variety: string;
            gasSpent: string;
            rush: string;
          };
          titleDetails: {
            adjective: {
              value: string;
              source: string;
            };
            noun: {
              value: string;
              source: string;
            };
          };
        };
      };
    };
    degen_score: {
      name: string;
      description: string;
      score: number;
      metadata: {
        degenscore: {
          updatedAt: string;
        };
      };
    };
  };
}

const ActionTierColors: Record<string, string> = {
  ACTION_TIER_EPIC: "bg-purple-600",
  ACTION_TIER_UNCOMMON: "bg-green-500",
};

const MetricColors: Record<string, string> = {
  METRIC_HIGH: "bg-blue-700",
  METRIC_DEGEN: "bg-red-500",
  METRIC_MEDIUM: "bg-[#2640EB]",
};
function DegenScoreBeacon({
  address,
  user,
}: {
  address: string;
  user: UserCombinedProfile | undefined;
}) {
  const { data: userProfileData } = useQuery({
    enabled: !!user,
    queryKey: ["user", user?.privy_did?.replace("did:privy:", "")],
    queryFn: async () => fetchUserProfile({ userId: user?.privy_did ?? "" }),
  });

  const enabled = !!userProfileData?.profile?.degen_score_wallet;

  const { data, isLoading } = useQuery({
    enabled,
    queryKey: ["degenScore", address],
    queryFn: () =>
      fetchDegenScore({
        address: userProfileData?.profile?.degen_score_wallet ?? "",
      }),
  });

  return (
    <motion.div
      className='w-full max-w-4xl  rounded-3xl shadow-2xl overflow-hidden'
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className='p-8'>
        <div className='flex items-center mb-6'>
          {data?.image && (
            <Image
              src={data?.image || "/placeholder.svg"}
              alt={data?.name || "DegenScore Beacon"}
              width={80}
              height={80}
              className='w-20 h-20 mr-4 rounded-full border-4 border-blue-700'
            />
          )}
          <div>
            <h1 className='text-4xl font-bold text-black mb-2'>
              {data?.name || "DegenScore Beacon"}
            </h1>
            {data?.properties?.DegenScore && (
              <div className='flex items-center'>
                <Sparkles className='w-5 h-5 text-blue-700 mr-2' />
              </div>
            )}
          </div>
        </div>
        {data?.description && (
          <p className='text-white mb-8 bg-blue-800 bg-opacity-50 p-4 rounded-xl'>
            {data?.description}
          </p>
        )}

        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
          <ScoreCard
            title='DegenScore'
            score={data?.properties?.DegenScore}
            icon={<Star className='w-8 h-8 ' />}
          />
          <ScoreCard
            title='Onchain Actions'
            score={data?.properties?.["Onchain Actions"]}
            icon={<Activity className='w-8 h-8 ' />}
          />
          <ScoreCard
            title='Onchain Activity'
            score={data?.properties?.["Onchain Activity"]}
            icon={<Zap className='w-8 h-8 ' />}
          />
        </div>

        {data?.traits?.actions?.metadata?.actions?.actions && (
          <div className='bg-white bg-opacity-10 rounded-2xl p-6 mb-8 backdrop-blur-sm'>
            <h2 className='text-2xl font-bold text-blue-700 mb-4 flex items-center'>
              <TrendingUp className='w-6 h-6 mr-2' />
              Top Onchain Actions
            </h2>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              {data?.traits.actions.metadata?.actions.actions.map(
                (action, index) => (
                  <div
                    key={index}
                    className='bg-blue-800 bg-opacity-50 rounded-lg p-4 border border-blue-700 hover:border-yellow-200 transition-colors'
                  >
                    <h3 className='text-lg font-semibold text-white mb-2'>
                      {action.name}
                    </h3>
                    <p className='text-blue-200 text-sm mb-2'>
                      {action.description}
                    </p>
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        ActionTierColors[action.actionTier] || "bg-gray-500"
                      }`}
                    >
                      {action.actionTier.replace("ACTION_TIER_", "")}
                    </span>
                  </div>
                )
              )}
            </div>
          </div>
        )}

        {data?.traits?.activity?.metadata?.activity && (
          <div className='bg-white bg-opacity-10 rounded-2xl p-6 backdrop-blur-sm'>
            <h2 className='text-2xl font-bold text-black flex items-center'>
              <Flame className='w-6 h-6 mr-2' />
              Onchain Activity
            </h2>
            <p className='text-blue-700 text-xl font-semibold mb-4'>
              {data?.traits.activity.metadata?.activity.title}
            </p>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              {Object.entries(
                data?.traits.activity.metadata?.activity.categoryMetric
              ).map(([key, value]) => (
                <div
                  key={key}
                  className='bg-blue-800 bg-opacity-50 rounded-lg p-4'
                >
                  <h3 className='text-lg font-semibold text-white mb-2'>
                    {key}
                  </h3>
                  <div className='h-2 rounded-full bg-gray-700'>
                    <div
                      className={`h-full rounded-full ${
                        MetricColors[value] || "bg-gray-500"
                      }`}
                      style={{ width: "70%" }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {!data?.traits?.actions?.metadata?.actions?.actions &&
        !data?.traits?.activity?.metadata?.activity &&
        !isLoading && <DegenScoreUnavailable />}
    </motion.div>
  );
}

function ScoreCard({
  title,
  score,
  icon,
}: {
  title: string;
  score?: number;
  icon: React.ReactNode;
}) {
  return (
    <div className='bg-white bg-opacity-10 rounded-xl p-6 flex items-center backdrop-blur-sm border border-blue-700 hover:border-yellow-200 hover:bg-blue-700 hover:text-white text-blue-700 transition-colors'>
      {icon}
      <div className='ml-4'>
        <h2 className='text-lg font-semibold '>{title}</h2>
        {score !== undefined ? (
          <p className='text-3xl font-bold '>{score}</p>
        ) : (
          <p className='text-xl text-gray-400'>N/A</p>
        )}
      </div>
    </div>
  );
}
function DegenScoreUnavailable() {
  const { user, getAccessToken } = usePrivy();
  const { privyDid }: { privyDid: string } = useParams();
  const [checkingDegenScore, setCheckingDegenScore] = useState(false);
  const { refetch } = useQuery({
    enabled: !!user,
    queryKey: ["user", user?.id?.replace("did:privy:", "")],
    queryFn: async () => fetchUserProfile({ userId: user?.id ?? "" }),
  });
  const { linkWallet } = useLinkAccount({
    onSuccess: async (user, linkMethod, linkedAccount) => {
      const stepId = TaskMap["degenScore"];
      const accessToken = await getAccessToken();
      if (!accessToken) return;

      if (linkedAccount?.type === "wallet") {
        await updateWalletUser(user.id, linkedAccount.address, accessToken);
        const hasScore = await handleDegenScore(
          user?.id,
          getAccessToken,
          setCheckingDegenScore
        );
        await refetch();
        if (!hasScore) {
          alert("no score found");
          return;
        }
        await completeTask(user.id, stepId, accessToken);
        posthog.capture("quest_completed", {
          user_id: user.id,
          task_id: stepId,
          account: linkMethod,
        });
      }
    },
  });

  const isOwner = user?.id?.replace("did:privy:", "") === privyDid;

  if (!isOwner) return null;

  return (
    <div className='text-white text-center p-4 bg-blue-800 bg-opacity-50 rounded-xl'>
      No detailed trait data available.
      <DegenScoreMintingCard />
      <DegenScoreCheckSection
        checkingDegenScore={checkingDegenScore}
        handleDegenScore={async () => {
          const hasScore = await handleDegenScore(
            user?.id,
            getAccessToken,
            setCheckingDegenScore
          );
          if (!hasScore) {
            linkWallet();
          } else {
            const accessToken = await getAccessToken();
            await completeTask(user.id, TaskMap["degenScore"], accessToken!);
          }
        }}
      />
    </div>
  );
}

function DegenScoreMintingCard() {
  return (
    <motion.div
      className='w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden p-6 mx-auto'
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className='text-2xl font-bold text-[#2640EB] mb-4 flex items-center justify-center'>
        <Sparkles className='w-6 h-6 mr-2 text-[#E8FC6C]' />
        Mint Your DegenScore
      </h2>
      <p className='text-[#2640EB] text-center mb-6'>
        Visit the DegenScore website to mint your own DegenScore and display it
        on your profile.
      </p>
      <Link href='https://degenscore.com' target='_blank' passHref>
        <Button className='w-full bg-[#2640EB] hover:bg-[#1c2fa6] text-white font-bold py-3 px-6 rounded-full transition-colors duration-300 flex items-center justify-center'>
          <Sparkles className='w-5 h-5 mr-2' />
          Get Your DegenScore
        </Button>
      </Link>
    </motion.div>
  );
}

function DegenScoreCheckSection({
  checkingDegenScore,
  handleDegenScore,
}: {
  checkingDegenScore: boolean;
  handleDegenScore: () => void;
}) {
  return (
    <span className='text-white text-sm mt-4 block text-center'>
      Already have a DegenScore?
      <div className='flex flex-col gap-0 pt-2 items-center'>
        {checkingDegenScore ? (
          <div className='flex items-center gap-0 flex-col'>
            <span className='text-xs items-center flex gap-1 text-black'>
              <Loader className='w-5 h-5 animate-spin' /> Searching for
              DegenScore <Loader className='w-5 h-5 animate-spin' />
            </span>
            <span className='text-white text-xs'>
              If no score is found, connect the wallet containing your
              DegenScore
            </span>
          </div>
        ) : (
          <ConnectWalletButton onClick={handleDegenScore} />
        )}
      </div>
    </span>
  );
}

async function handleDegenScore(
  privyDid: string | null,
  getAccessToken: () => Promise<string | null>,
  setCheckingDegenScore: (val: boolean) => void
) {
  setCheckingDegenScore(true);
  try {
    const accessToken = await getAccessToken();
    const response = await fetch("/api/degenscore", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.status === 200) {
      const data = await response.json();
      if (data?.properties?.DegenScore) {
        alert(
          `You have a DegenScore! Please wait while we update your profile!`
        );
        await completeTask(privyDid!, TaskMap["degenScore"], accessToken!);
        return true;
      }
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Error fetching DegenScore:", error);
    return false;
  } finally {
    setCheckingDegenScore(false);
  }
}

const ConnectWalletButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <Button
      variant={"link"}
      className='h-fit pb-0'
      onClick={async () => {
        await onClick();
      }}
    >
      Link DegenScore
    </Button>
  );
};

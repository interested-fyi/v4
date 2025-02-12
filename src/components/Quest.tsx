"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Check,
  Github,
  Linkedin,
  Link,
  Wallet,
  MessageCircle,
  XIcon as BrandX,
  ArrowRight,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePrivy, useLinkAccount } from "@privy-io/react-auth";
import { useQuery } from "@tanstack/react-query";
import {
  updateFarcasterUser,
  updateGithubUser,
  updateLinkedInUser,
  updateTelegramUser,
  updateTwitterUser,
  updateWalletUser,
} from "@/lib/updateSocialConnections";
import { completeTask } from "@/lib/completeTask";
import { QuestPoints } from "./composed/quest/QuestPoints";
import QuestRow from "./composed/quest/QuestRow";
import posthog from "posthog-js";
import { useRouter } from "next/navigation";
import Leaderboard, {
  LeaderboardEntry,
} from "./composed/quest/QuestLeaderboard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

export interface QuestStep {
  id: string;
  title: string;
  icon: React.ReactNode;
  points: number;
  completed: boolean;
  linkMethod: string;
}
export const fetchCompletedTasks = async (privyDid: string) => {
  try {
    const response = await fetch(`/api/quests/status?privy_did=${privyDid}`);
    if (!response.ok) {
      throw new Error("Failed to fetch completed tasks");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching completed tasks:", error);
    return [];
  }
};

export const fetchTopDegens = async () => {
  try {
    const response = await fetch(`/api/quests/leaderboard/degen`, {
      method: "GET",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch top degens");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching top degens:", error);
    return [];
  }
};

export const fetchTopUsers = async () => {
  try {
    const response = await fetch(`/api/quests/leaderboard`, {
      method: "GET",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch top users");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching top users:", error);
    return [];
  }
};

export default function Quest() {
  const { user, ready, authenticated, getAccessToken } = usePrivy();
  const [questPoints] = useState(10);
  const [totalPoints, setTotalPoints] = useState(0);
  const router = useRouter();

  const { data, isLoading, refetch } = useQuery<{
    completedTaskIds: string[];
    totalPoints: number;
  }>({
    enabled: !!user,
    queryKey: ["completedTasks", user?.id],
    queryFn: async () => {
      if (user) {
        return await fetchCompletedTasks(user.id);
      }
      return {
        completedTaskIds: [],
        totalPoints: 0,
      };
    },
  });
  const { data: topUsers } = useQuery({
    queryKey: ["topUsers", data?.totalPoints],
    queryFn: fetchTopUsers,
  });

  const { data: topDegens } = useQuery({
    queryKey: ["topDegens", data?.totalPoints],
    queryFn: fetchTopDegens,
  });
  const [steps, setSteps] = useState<QuestStep[]>([
    {
      id: "x",
      title: "Connect X",
      icon: <BrandX className='h-5 w-5' />,
      points: 10,
      completed: false,
      linkMethod: "twitter",
    },
    {
      id: "linkedin",
      title: "Connect LinkedIn",
      icon: <Linkedin className='h-5 w-5' />,
      points: 10,
      completed: false,
      linkMethod: "linkedin",
    },
    {
      id: "github",
      title: "Connect Github",
      icon: <Github className='h-5 w-5' />,
      points: 10,
      completed: false,
      linkMethod: "github",
    },
    {
      id: "farcaster",
      title: "Connect Farcaster",
      icon: <Link className='h-5 w-5' />,
      points: 10,
      completed: false,
      linkMethod: "farcaster",
    },
    {
      id: "telegram",
      title: "Connect Telegram",
      icon: <MessageCircle className='h-5 w-5' />,
      points: 10,
      completed: false,
      linkMethod: "telegram",
    },
    {
      id: "wallet",
      title: "Connect Wallet",
      icon: <Wallet className='h-5 w-5' />,
      points: 10,
      completed: false,
      linkMethod: "siwe",
    },
    {
      id: "salary_quiz",
      title: "Complete Salary Quiz",
      icon: <Check className='h-5 w-5' />,
      points: 10,
      completed: false,
      linkMethod: "quiz",
    },
    {
      id: "give_endorsement",
      title: "Endorse a Peer",
      icon: <Check className='h-5 w-5' />,
      points: 20,
      completed: false,
      linkMethod: "give_endorsement",
    },
    {
      id: "receive_endorsement",
      title: "Receive an Endorsement",
      icon: <Check className='h-5 w-5' />,
      points: 20,
      completed: false,
      linkMethod: "receive_endorsement",
    },
    {
      id: "degen_score",
      title: "Complete Degen Score",
      icon: <Check className='h-5 w-5' />,
      points: 30,
      completed: false,
      linkMethod: "degen_score",
    },
  ]);

  useEffect(() => {
    console.count();
    if (data) {
      const updatedSteps = steps.map((step) => ({
        ...step,
        completed: data.completedTaskIds?.includes(step.id),
      }));
      if (data.totalPoints) {
        setTotalPoints(data.totalPoints);
      }
      setSteps(updatedSteps);
    }
  }, [data]);

  useEffect(() => {
    if (!ready) return;
    if (!authenticated) {
      router.push("/?message=login");
    } else {
      posthog.identify(user?.id);
    }
  }, [authenticated, ready]);

  const {
    linkGithub,
    linkLinkedIn,
    linkTwitter,
    linkTelegram,
    linkFarcaster,
    linkWallet,
  } = useLinkAccount({
    onError: async (error, details) => {
      const account =
        details.linkMethod === "siwe" ? "wallet" : details.linkMethod;
      const task =
        details.linkMethod === "twitter"
          ? "x"
          : details.linkMethod === "siwe"
          ? "wallet"
          : details.linkMethod;
      console.error("Error linking account:", error);
      if (
        user?.linkedAccounts.find(
          (linkedAccount) =>
            linkedAccount.type.replace("_oauth", "") === account
        ) &&
        (!error.includes("failed_to_link_account") ||
          !error.includes("exited_link_flow"))
      ) {
        alert("Account already linked");
        const accessToken = await getAccessToken();
        if (!accessToken) return;
        await completeTask(user.id, task, accessToken);
        posthog.capture("quest_completed", {
          user_id: user.id,
          task_id: task,
          account: account,
        });
        refetch();
      }
    },
    onSuccess: async (user, linkMethod, linkedAccount) => {
      // Update completed status for the specific linked account
      setSteps((prevSteps) =>
        prevSteps.map((step) =>
          step.linkMethod === linkMethod ? { ...step, completed: true } : step
        )
      );

      // Add points for the completed quest
      setTotalPoints((prev) => prev + questPoints);

      // Find the completed step
      const completedStep = steps.find(
        (step) => step.linkMethod === linkMethod
      );
      if (completedStep) {
        const accessToken = await getAccessToken();
        if (!accessToken) return;
        // Call the API to mark the task as complete
        await completeTask(user.id, completedStep.id, accessToken);
        posthog.capture("quest_completed", {
          user_id: user.id,
          task_id: completedStep.id,
        });
      }

      const accessToken = await getAccessToken();
      if (!accessToken) {
        return;
      }
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

  // Link method map
  const linkMethodMap = {
    github: linkGithub,
    linkedin: linkLinkedIn,
    twitter: linkTwitter,
    telegram: linkTelegram,
    farcaster: linkFarcaster,
    siwe: linkWallet,
  };

  // Handle quest start
  const handleStartQuest = async (linkMethod: string) => {
    const linkFunction =
      linkMethodMap[linkMethod as keyof typeof linkMethodMap];
    if (linkFunction) {
      await linkFunction();
      return;
    }
    if (linkMethod === "degen_score") {
      router.push(`/profile/${user?.id.replace("did:privy:", "")}?tab=onchain`);
    }
    if (linkMethod === "quiz") {
      router.push("/salary-quiz");
    }
    if (linkMethod === "give_endorsement") {
      router.push("/explore-talent");
    }
    if (linkMethod === "receive_endorsement") {
      try {
        const res = await fetch(
          `/api/quests/status/receive-endorsement?privy_did=${user?.id}`
        );
        const data = await res.json();

        if (data.success) {
          const accessToken = await getAccessToken();
          completeTask(user?.id!, "receive_endorsement", accessToken!);
          alert(
            "You have received an endorsement! We're updating your points now..."
          );
          posthog.capture("quest_completed", {
            user_id: user?.id,
            task_id: "receive_endorsement",
          });
          await refetch();
          return;
        } else {
          alert("You have not received an endorsement yet");
          return;
        }
      } catch (e) {
        alert("You have not received an endorsement yet");
        console.error(e);
      } finally {
        return;
      }
    }
    return;
  };

  const completedSteps = useCallback(
    () =>
      steps.filter((step) => step.completed && step.id !== "daily_login")
        .length,
    [steps]
  );
  const progress = (completedSteps() / steps.length) * 100;

  return (
    <div className='bg-blue-700 w-full min-h-screen flex flex-col items-center justify-center pt-4'>
      {topUsers && (
        <div className='w-full max-w-2xl mx-auto p-2 md:p-0'>
          <Tabs>
            <TabsList>
              <TabsTrigger value='Top 10 Leaderboard'>
                <span>Top 10 Questors</span>
              </TabsTrigger>
              <TabsTrigger value='Top Degens'>
                <span>Top Degens</span>
              </TabsTrigger>
            </TabsList>
            <TabsContent value='Top 10 Leaderboard'>
              <Leaderboard entries={topUsers?.users} title='Top 10 Questors' />
            </TabsContent>
            <TabsContent value='Top Degens'>
              <Leaderboard
                entries={topDegens?.users}
                title='Degen Leaderboard'
              />
            </TabsContent>
          </Tabs>
        </div>
      )}

      <div className='w-full min-h-screen bg-blue-700 flex items-center justify-center p-2 md:p-4'>
        <Card className='w-full max-w-2xl bg-white/90 backdrop-blur shadow-xl'>
          {!!data &&
          !data?.completedTaskIds.includes("daily_login") &&
          !isLoading ? (
            <motion.div
              initial={{
                width: 0,
                opacity: 0,
              }}
              animate={{
                width: "100%",
                opacity: 1,
              }}
              transition={{
                duration: 0.5,
                delay: 0.5,
              }}
              className='p-4 pb-0'
            >
              <div className='flex flex-col items-center justify-center'>
                <h3 className='text-xl font-bold text-center bg-clip-text max-w-[305px] text-transparent bg-gradient-to-r from-purple-700 via-blue-700 to-blue-600'>
                  Looks like you haven&apos;t completed the daily checkin yet!
                </h3>
                <p className='text-sm text-center text-gray-500'>
                  Complete the daily checkin quest to unlock more rewards
                </p>
              </div>
              <QuestRow
                step={{
                  id: "daily_login",
                  title: "Daily Checkin",
                  icon: <ArrowRight className='h-5 w-5' />,
                  points: 5,
                  completed:
                    data?.completedTaskIds?.includes("daily_login") ?? false,
                  linkMethod: "daily_login",
                }}
                index={0}
                handleStartQuest={handleStartQuest}
              />
            </motion.div>
          ) : null}
          <CardHeader className='text-center'>
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <CardTitle className='text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-700 via-blue-500 to-yellow-200'>
                Quest
              </CardTitle>
            </motion.div>
            <p className='mt-2 text-muted-foreground max-w-96 mx-auto pb-4'>
              Connect your accounts to unlock rewards.
            </p>

            <div className='mt-6 space-y-2'>
              <Progress value={progress} className='h-3 bg-gray-200'>
                <motion.div
                  className='h-full bg-gradient-to-r from-blue-700 to-yellow-200 rounded-full'
                  style={{ width: `${progress}%` }}
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                />
              </Progress>
              <div className='flex justify-between items-center text-sm'>
                <span className='text-muted-foreground'>
                  {completedSteps()} of {steps.length} quests completed
                </span>
                <QuestPoints totalPoints={totalPoints} />
              </div>
            </div>
          </CardHeader>
          <CardContent className='space-y-4 p-2 md:p-6'>
            {steps.map((step, index) => (
              <div key={step.id + index} className='flex flex-col gap-2'>
                <QuestRow
                  key={step.id + index}
                  step={step}
                  index={index}
                  handleStartQuest={handleStartQuest}
                />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
      <div className='w-full max-w-2xl pt-4 pb-8'></div>
    </div>
  );
}

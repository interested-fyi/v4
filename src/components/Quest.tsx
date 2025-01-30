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

export default function Quest() {
  const { user } = usePrivy();
  const [questPoints] = useState(10);
  const [totalPoints, setTotalPoints] = useState(0);

  const { getAccessToken } = usePrivy();
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
  const [steps, setSteps] = useState<QuestStep[]>([
    {
      id: "x",
      title: "Connect X",
      icon: <BrandX className='h-5 w-5' />,
      points: questPoints,
      completed: false,
      linkMethod: "twitter",
    },
    {
      id: "linkedin",
      title: "Connect LinkedIn",
      icon: <Linkedin className='h-5 w-5' />,
      points: questPoints,
      completed: false,
      linkMethod: "linkedin",
    },
    {
      id: "github",
      title: "Connect Github",
      icon: <Github className='h-5 w-5' />,
      points: questPoints,
      completed: false,
      linkMethod: "github",
    },
    {
      id: "farcaster",
      title: "Connect Farcaster",
      icon: <Link className='h-5 w-5' />,
      points: questPoints,
      completed: false,
      linkMethod: "farcaster",
    },
    {
      id: "telegram",
      title: "Connect Telegram",
      icon: <MessageCircle className='h-5 w-5' />,
      points: questPoints,
      completed: false,
      linkMethod: "telegram",
    },
    {
      id: "wallet",
      title: "Connect Wallet",
      icon: <Wallet className='h-5 w-5' />,
      points: questPoints,
      completed: false,
      linkMethod: "siwe",
    },
    {
      id: "salary_quiz",
      title: "Complete Salary Quiz",
      icon: <Check className='h-5 w-5' />,
      points: questPoints,
      completed: false,
      linkMethod: "quiz",
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
        await completeTask(user.id, task);
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
        // Call the API to mark the task as complete
        await completeTask(user.id, completedStep.id);
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
    }
  };

  const completedSteps = useCallback(
    () =>
      steps.filter((step) => step.completed && step.id !== "daily_login")
        .length,
    [steps]
  );
  const progress = (completedSteps() / steps.length) * 100;

  return (
    <div className='min-h-screen bg-blue-700 flex items-center justify-center p-2 md:p-4'>
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
  );
}

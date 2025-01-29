"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  Github,
  Linkedin,
  Link,
  Wallet,
  MessageCircle,
  XIcon as BrandX,
  ArrowRight,
  Loader,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { usePrivy, useLinkAccount } from "@privy-io/react-auth";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  updateFarcasterUser,
  updateGithubUser,
  updateLinkedInUser,
  updateTelegramUser,
  updateTwitterUser,
  updateWalletUser,
} from "@/lib/updateSocialConnections";
import { completeTask } from "@/lib/completeTask";
import Image from "next/image";

interface QuestStep {
  id: string;
  title: string;
  icon: React.ReactNode;
  points: number;
  completed: boolean;
  linkMethod: string;
}
const fetchCompletedTasks = async (privyDid: string) => {
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
      console.log("🚀 ~ useEffect ~ data:", data);
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
      console.error("Error linking account:", error);
      if (
        user?.linkedAccounts.find(
          (account) => account.type === details.linkMethod
        )
      ) {
        alert("Account already linked");
        await completeTask(user.id, details.linkMethod);
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
  const handleStartQuest = (linkMethod: string) => {
    const linkFunction =
      linkMethodMap[linkMethod as keyof typeof linkMethodMap];
    if (linkFunction) {
      try {
        linkFunction();
      } catch (error) {
        alert("Failed to start quest");
      }
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
    <div className='min-h-screen bg-blue-700 flex items-center justify-center p-4'>
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
            className='p-4'
          >
            <QuestRow
              step={{
                id: "daily_login",
                title: "Daily Login",
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
          <p className='mt-2 text-muted-foreground'>
            Connect your accounts to unlock rewards
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
              <motion.span
                key={totalPoints}
                className='font-semibold flex gap-2 items-center text-blue-700'
                initial={{ scale: 1 }}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.3 }}
              >
                <svg
                  width='16'
                  height='12'
                  viewBox='0 0 38 32'
                  fill='white'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <g id='Layer 2'>
                    <g id='OBJECTS'>
                      <path
                        id='Union'
                        fill-rule='evenodd'
                        clip-rule='evenodd'
                        d='M37.4532 21.727C37.2388 20.7064 36.8384 19.7339 36.2719 18.8582L36.1252 18.5134L34.555 14.7055C34.3372 14.102 34.0412 13.5297 33.6746 13.0033L30.571 6.09177C30.4387 5.77947 30.2739 5.48191 30.0795 5.20399L29.1476 2.89282C28.7996 1.90311 28.104 1.07346 27.1901 0.558163C26.2763 0.042862 25.2064 -0.123028 24.1794 0.0913388C23.1524 0.305706 22.2382 0.885742 21.6068 1.72359C20.9754 2.56144 20.6698 3.60008 20.7467 4.64637V5.32138C20.0791 4.74176 18.5456 3.85397 16.8214 5.60753L16.8728 4.64637C16.9367 3.69182 16.6836 2.74286 16.153 1.94685C15.6223 1.15083 14.8437 0.552287 13.9379 0.244145L13.7472 0.200122L13.439 0.119415L13.0502 0.0313703H12.7567H12.6613C12.4157 0.0275734 12.1703 0.0447556 11.9276 0.0827297C11.16 0.204779 10.4391 0.530581 9.84033 1.02615C9.24152 1.52172 8.78666 2.16889 8.5232 2.90016L7.56939 5.21133C7.38793 5.49218 7.23318 5.7894 7.10715 6.09911L3.96689 13.0033C3.60025 13.5297 3.30425 14.102 3.08645 14.7055L1.50898 18.5061L1.3549 18.8582C0.78766 19.7327 0.389466 20.7058 0.180977 21.727C-0.0756461 22.9526 -0.0591694 24.2196 0.229236 25.4381C0.517641 26.6565 1.07089 27.7965 1.84968 28.777C2.62846 29.7575 3.61364 30.5544 4.73522 31.1111C5.8568 31.6677 7.08723 31.9706 8.33906 31.998C9.59089 32.0254 10.8334 31.7767 11.9783 31.2696C13.1231 30.7625 14.1422 30.0095 14.9632 29.0641C15.7841 28.1186 16.3867 27.0039 16.7282 25.7993C17.0696 24.5946 17.1415 23.3295 16.9388 22.0939L17.0268 18.2419V17.2808V16.6938C17.544 16.3386 18.1567 16.1484 18.7841 16.1484C19.4115 16.1484 20.0241 16.3386 20.5413 16.6938V17.2881V18.2493L20.6293 22.1012C20.4298 23.3356 20.5042 24.5988 20.8473 25.8013C21.1904 27.0037 21.7938 28.1159 22.6147 29.0592C23.4357 30.0024 24.454 30.7535 25.5976 31.2592C26.7412 31.7649 27.9821 32.0129 29.2322 31.9855C30.4823 31.9582 31.7112 31.6562 32.8316 31.1009C33.9519 30.5456 34.9365 29.7507 35.7154 28.7725C36.4943 27.7943 37.0484 26.6567 37.3386 25.4404C37.6288 24.2241 37.6479 22.9589 37.3945 21.7344L37.4532 21.727ZM15.9043 24.9773C15.6012 26.4372 14.8722 27.7745 13.8095 28.8203C12.7468 29.866 11.3979 30.5734 9.93338 30.8529C8.46883 31.1325 6.95428 30.9717 5.58107 30.3908C4.20786 29.81 3.0376 28.8352 2.21813 27.5896C1.39866 26.344 0.966742 24.8835 0.976944 23.3926C0.987146 21.9016 1.43901 20.4471 2.27545 19.2129C3.11189 17.9786 4.29538 17.0199 5.67641 16.4579C7.05744 15.896 8.57405 15.7559 10.0346 16.0555C11.0069 16.2539 11.9304 16.6424 12.7521 17.1987C13.5738 17.7549 14.2775 18.468 14.8229 19.297C15.3683 20.126 15.7446 21.0545 15.9302 22.0293C16.1157 23.0041 16.1069 24.006 15.9043 24.9773ZM20.8201 11.8147C20.2179 11.4025 19.4935 11.2071 18.7657 11.2605C18.0379 11.3138 17.3498 11.6127 16.8141 12.1082V10.1638C17.3601 9.64887 18.08 9.3584 18.8305 9.35024C19.581 9.34208 20.307 9.61684 20.8641 10.1198L20.8201 11.8147ZM30.6297 30.7956C29.1808 31.0967 27.6751 30.9614 26.303 30.4068C24.931 29.8523 23.7541 28.9034 22.9212 27.6802C22.0884 26.4569 21.6369 25.0142 21.6238 23.5343C21.6107 22.0545 22.0367 20.604 22.8479 19.3663C23.6591 18.1285 24.819 17.159 26.1811 16.5803C27.5431 16.0017 29.0462 15.8399 30.5002 16.1153C31.9542 16.3907 33.294 17.0911 34.35 18.1278C35.4061 19.1645 36.1311 20.4911 36.4333 21.9398C36.6342 22.9024 36.6433 23.8951 36.4603 24.8612C36.2773 25.8274 35.9057 26.7479 35.3667 27.5704C34.8277 28.3928 34.132 29.101 33.3192 29.6544C32.5064 30.2078 31.5925 30.5956 30.6297 30.7956ZM8.802 23.4659C8.802 24.1116 8.99349 24.7429 9.35225 25.2798C9.71101 25.8167 10.2209 26.2352 10.8175 26.4823C11.4141 26.7294 12.0706 26.7941 12.704 26.6681C13.3373 26.5421 13.9191 26.2312 14.3757 25.7746C14.8323 25.3179 15.1433 24.7362 15.2692 24.1028C15.3952 23.4695 15.3306 22.813 15.0834 22.2164C14.8363 21.6198 14.4178 21.1099 13.8809 20.7511C13.344 20.3924 12.7127 20.2009 12.067 20.2009C11.2011 20.2009 10.3706 20.5449 9.7583 21.1572C9.14599 21.7695 8.802 22.5999 8.802 23.4659ZM14.3415 22.5707C14.3415 22.8436 14.2606 23.1102 14.109 23.3371C13.9574 23.5639 13.742 23.7407 13.49 23.8451C13.2379 23.9495 12.9606 23.9768 12.693 23.9236C12.4254 23.8704 12.1797 23.739 11.9867 23.5461C11.7938 23.3532 11.6625 23.1074 11.6092 22.8398C11.556 22.5723 11.5833 22.2949 11.6877 22.0429C11.7921 21.7908 11.9689 21.5754 12.1958 21.4238C12.4226 21.2723 12.6893 21.1914 12.9621 21.1914C13.1451 21.1885 13.3268 21.222 13.4967 21.29C13.6666 21.358 13.8213 21.4591 13.9517 21.5875C14.0822 21.7159 14.1857 21.8689 14.2564 22.0378C14.3271 22.2066 14.3635 22.3877 14.3635 22.5707H14.3415ZM30.7655 20.7476C31.3034 20.3897 31.9353 20.1994 32.5814 20.2009C33.4461 20.2028 34.2746 20.5477 34.8854 21.1598C35.4961 21.7719 35.8391 23.4659 35.8391 23.4659C35.8391 24.1119 35.6474 24.7435 35.2883 25.2806C34.9292 25.8176 34.4189 26.2361 33.8218 26.483C33.2248 26.7299 32.5679 26.7942 31.9344 26.6676C31.3009 26.541 30.7191 26.2293 30.2628 25.772C29.8065 25.3146 29.4961 24.7322 29.3709 24.0983C29.2458 23.4645 29.3115 22.8078 29.5597 22.2113C29.808 21.6149 30.2276 21.1054 30.7655 20.7476ZM32.7102 23.7177C32.937 23.8692 33.2037 23.9501 33.4765 23.9501C33.8418 23.9482 34.1915 23.8022 34.4498 23.544C34.708 23.2857 34.854 22.936 34.8559 22.5708C34.8559 22.2979 34.775 22.0313 34.6234 21.8044C34.4719 21.5776 34.2564 21.4008 34.0044 21.2964C33.7523 21.192 33.475 21.1647 33.2074 21.2179C32.9399 21.2711 32.6941 21.4025 32.5012 21.5954C32.3083 21.7883 32.1769 22.0341 32.1237 22.3017C32.0704 22.5692 32.0978 22.8466 32.2022 23.0986C32.3066 23.3507 32.4834 23.5661 32.7102 23.7177Z'
                        fill='blue'
                      />
                    </g>
                  </g>
                </svg>
                {totalPoints}{" "}
              </motion.span>
            </div>
          </div>
        </CardHeader>
        <CardContent className='space-y-4 p-6'>
          {steps.map((step, index) => (
            <QuestRow
              step={step}
              index={index}
              handleStartQuest={handleStartQuest}
            />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function QuestRow({
  step,
  index,
  handleStartQuest,
}: {
  step: QuestStep;
  index: number;
  handleStartQuest: (linkMethod: string) => void;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = usePrivy();
  const router = useRouter();
  const { refetch } = useQuery<{
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

  const completeQuest = async () => {
    setIsLoading(true);

    if (step.linkMethod === "quiz") {
      router.push("/salary-quiz");
    } else if (step.linkMethod === "daily_login") {
      if (!user) return;

      await completeTask(user?.id, "daily_login");
      await refetch();
    } else {
      try {
        handleStartQuest(step.linkMethod);
      } catch (error) {
        alert("Error starting quest");
        console.error("Error starting quest:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <motion.div
      key={step.id}
      initial={{
        x: -50,
        opacity: 0,
      }}
      animate={{
        x: 0,
        opacity: 1,
      }}
      transition={{
        duration: 0.3,
        delay: index * 0.1,
      }}
    >
      <div className='flex items-center justify-between rounded-lg border border-purple-100 bg-white p-4 transition-all hover:shadow-md hover:border-purple-300'>
        <div className='flex items-center gap-4'>
          <div className='rounded-full bg-gradient-to-br from-blue-700 to-yellow-200 p-2 text-white'>
            {step.icon}
          </div>
          <div>
            <h3 className='font-medium'>{step.title}</h3>
            <AnimatePresence mode='wait'>
              {step.completed ? (
                <motion.div
                  key='completed'
                  initial={{
                    opacity: 0,
                    y: -10,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  exit={{
                    opacity: 0,
                    y: 10,
                  }}
                  transition={{
                    duration: 0.2,
                  }}
                >
                  <Badge
                    variant='secondary'
                    className='bg-green-100 text-green-800'
                  >
                    <Check className='mr-1 h-3 w-3' />
                    Completed
                  </Badge>
                </motion.div>
              ) : (
                <motion.span
                  key='points'
                  className='text-sm text-blue-700 font-semibold flex gap-1'
                  initial={{
                    opacity: 0,
                    y: 10,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  exit={{
                    opacity: 0,
                    y: -10,
                  }}
                  transition={{
                    duration: 0.2,
                  }}
                >
                  +{step.points}{" "}
                  <Image
                    src='/svg/small-binocular.svg'
                    width={16}
                    height={16}
                    alt='binoculars'
                  />
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </div>
        <Button
          variant={step.completed ? "secondary" : "default"}
          disabled={step.completed || !user || isLoading}
          onClick={completeQuest}
          className={`${
            step.completed
              ? "bg-green-100 text-green-800"
              : "bg-blue-700 text-white hover:opacity-90"
          } transition-all duration-300 min-w-40`}
        >
          {step.completed ? (
            "Completed"
          ) : isLoading ? (
            <Loader className='h-4 w-4 animate-spin' />
          ) : (
            <>
              Start Quest
              <ArrowRight className=' h-4 w-4' />
            </>
          )}
        </Button>
      </div>
    </motion.div>
  );
}

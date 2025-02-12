"use client";
import { fetchCompletedTasks, QuestStep } from "@/components/Quest";
import { AnimatePresence, motion } from "framer-motion";
import { completeTask } from "@/lib/completeTask";
import { usePrivy } from "@privy-io/react-auth";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight, Check, Loader } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import posthog from "posthog-js";

export default function QuestRow({
  step,
  index,
  handleStartQuest,
}: {
  step: QuestStep;
  index: number;
  handleStartQuest: (linkMethod: string) => void;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const { user, getAccessToken } = usePrivy();
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
    try {
      if (step.linkMethod === "quiz") {
        router.push("/salary-quiz");
      } else if (step.linkMethod === "daily_login") {
        if (!user) return;
        const accessToken = await getAccessToken();
        if (!accessToken) return;
        await completeTask(user?.id, "daily_login", accessToken);
        posthog.capture("quest_completed", {
          user_id: user.id,
          task_id: "daily_login",
        });
        await refetch();
      } else {
        await handleStartQuest(step.linkMethod);
      }
    } catch (error) {
      alert("Error starting quest");
      console.error("Error starting quest:", error);
    } finally {
      setIsLoading(false);
    }
    setIsLoading(false);
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
      <div className='flex w-full flex-col gap- justify-between rounded-lg border border-purple-100 bg-white p-4 transition-all hover:shadow-md hover:border-purple-300'>
        <div className='flex items-center justify-between '>
          <div className='flex items-center gap-4'>
            <div className='rounded-full bg-gradient-to-br from-blue-700 to-yellow-200 p-2 text-white'>
              {step.icon}
            </div>
            <div>
              <h3 className='md:text-normal text-sm font-medium'>
                {step.title}
              </h3>
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
                      className='bg-green-100 text-green-800 '
                    >
                      <Check className='mr-1 h-2 w-2 md:h-3 md:w-3' />
                      Completed
                    </Badge>
                  </motion.div>
                ) : (
                  <motion.span
                    key='points'
                    className='text-xs md:text-sm text-blue-700 font-semibold flex gap-1'
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
            } transition-all duration-300 w-32 md:min-w-40`}
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
        {step.id === "wallet" && (
          <span className='text-muted-foreground text-xs'>
            Connected Wallets will be credited with your endorsments and be
            eligible for rewards!
          </span>
        )}
      </div>
    </motion.div>
  );
}

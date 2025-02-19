"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { UserCombinedProfile } from "@/types/return_types";
import { usePrivy } from "@privy-io/react-auth";
import { useSmartWallets } from "@privy-io/react-auth/smart-wallets";
import easAbi from "@ethereum-attestation-service/eas-contracts/deployments/optimism/EAS.json";
import { SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import { optimism, optimismSepolia } from "viem/chains";
import { Chain } from "viem";
import { publicClient } from "@/lib/viemClient";
import { useState } from "react";
import { getEndorsementUid } from "@/functions/general/get-endorsement-uid";
import { LoaderIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { completeTask } from "@/lib/completeTask";

export default function EndorseDialog({
  isOpen,
  onClose,
  user,
}: {
  isOpen: boolean;
  onClose: () => void;
  user: UserCombinedProfile;
}) {
  const [form, setForm] = useState<{
    relationship: string | null;
    endorsement: string | null;
  }>({
    relationship: null,
    endorsement: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const { user: privyUser, getAccessToken } = usePrivy();
  const { client } = useSmartWallets();

  const handleEndorse = async (form: {
    relationship: string | null;
    endorsement: string | null;
  }) => {
    setIsLoading(true);
    if (privyUser?.id === user.privy_did) {
      alert("You cannot endorse yourself");
      return;
    }
    const accessToken = await getAccessToken();
    if (client && accessToken && form.relationship && form.endorsement) {
      try {
        const allUserAddresses = user?.wallet_addresses
          ? [...user?.wallet_addresses, user?.smart_wallet_address]
          : [user?.smart_wallet_address];
        const schemaEncoder = new SchemaEncoder(
          "string relationship, string endorsement"
        );
        const encodedData = schemaEncoder.encodeData([
          { name: "relationship", type: "string", value: form.relationship },
          { name: "endorsement", type: "string", value: form.endorsement },
        ]);
        const contractParams = {
          address: process.env
            .NEXT_PUBLIC_EAS_CONTRACT_ADDRESS as `0x${string}`,
          abi: easAbi.abi,
          functionName: "multiAttest",
          args: [
            [
              {
                schema:
                  process.env.NEXT_PUBLIC_VERCEL_ENV !== "production"
                    ? process.env.NEXT_PUBLIC_SEPOLIA_ENDORSEMENT_SCHEMA_UID
                    : process.env.NEXT_PUBLIC_ENDORSEMENT_SCHEMA_UID, // schema uid
                data: allUserAddresses?.map(
                  (address) => ({
                    recipient: address as `0x${string}`,
                    expirationTime: 0,
                    revocable: true,
                    refUID: "0x" + "00".repeat(32),
                    data: encodedData,
                    value: 0,
                  }) // attestation data
                ),
              },
            ],
          ],
          chain:
            process.env.NEXT_PUBLIC_VERCEL_ENV !== "production"
              ? (optimismSepolia as Chain)
              : (optimism as Chain),
          account: client?.account,
        };
        const { request } = await publicClient.simulateContract(contractParams);
        const txHash = await client?.writeContract(request);
        const uid = await getEndorsementUid(txHash);
        // if result and txhash, exist, then schema is registered. need to save schemaUID and txHash to supabase
        const res = await fetch(`/api/users/save-attestation`, {
          method: "POST",
          cache: "no-store",
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            attestation_uid: uid,
            attestation_tx_hash: txHash,
            recipient: user?.privy_did,
            recipient_address: user?.smart_wallet_address as `0x${string}`,
            additional_recipients: allUserAddresses.filter(
              (address) => address !== user?.smart_wallet_address
            ),
            endorser: privyUser?.id,
            endorser_address: privyUser?.smartWallet?.address,
            relationship: form.relationship,
            endorsement: form.endorsement,
            privy_did: privyUser?.id,
          }),
        });
        const resData = (await res.json()).success;
        setIsLoading(false);

        await completeTask(
          privyUser?.id ?? "",
          "give_endorsement",
          accessToken
        );

        onClose();
        return {
          success: resData.success,
          attestation: resData.attestation,
        };
      } catch (error) {
        console.error(error);
      }
    }
    setIsLoading(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[425px] bg-[#e1effe] font-body m-auto py-8'>
        <DialogHeader className='flex flex-col gap-3'>
          <DialogTitle className='text-2xl font-bold font-heading text-center mt-4'>
            ENDORSE {user.name?.toUpperCase()}
          </DialogTitle>
          <div className='text-gray-700 text-sm font-semibold font-body leading-[21px]'>
            Please indicate your relationship to {user?.name} and the reason for
            your endorsement.
          </div>
        </DialogHeader>
        <div className='flex flex-col items-center gap-0 mb-0 w-full'>
          <div className='mt-4 w-full'>
            <Label className='text-sm font-medium' htmlFor='name'>
              Your relationship to {user?.name}:
            </Label>
            <Select
              onValueChange={(val) => {
                setForm({ ...form, relationship: val as string });
              }}
              value={form.relationship ?? ""}
            >
              <SelectTrigger className='w-full'>
                <SelectValue placeholder='Select your relation' />
              </SelectTrigger>
              <SelectContent className='relative z-50 px-2'>
                <SelectItem value={"coworker"}>Coworker</SelectItem>
                <SelectItem value={"client"}>
                  Client/Service Provider
                </SelectItem>
                <SelectItem value={"builder"}>Builder/Teammate</SelectItem>
                <SelectItem value={"investor"}>Investor</SelectItem>
                <SelectItem value={"peer"}>Peer</SelectItem>
                <SelectItem value={"sherpa"}>Sherpa</SelectItem>
                <SelectItem value={"connector"}>Connector</SelectItem>
                <SelectItem value={"politician"}>Politician</SelectItem>
                <SelectItem value={"tastemaker"}>Tastemaker</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className='mt-4 w-full'>
            <Label className='text-sm font-medium' htmlFor='name'>
              Reason for endorsement:
            </Label>
            <Textarea
              className='rounded-lg mt-2 w-full'
              id='endorsement'
              rows={4}
              defaultValue={form?.endorsement ?? ""}
              onChange={(e) =>
                setForm({ ...form, endorsement: e.target.value })
              }
              placeholder={`${user?.name} is excellent at...`}
            />
          </div>
          <Button
            className='w-full text-sm font-body font-medium leading-[21px] mt-4 bg-[#2640eb]'
            disabled={!form.relationship || !form.endorsement || isLoading}
            onClick={() => handleEndorse(form)}
          >
            {isLoading ? (
              <LoaderIcon className='w-6 h-6 m-auto animate-spin' />
            ) : (
              "Endorse"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

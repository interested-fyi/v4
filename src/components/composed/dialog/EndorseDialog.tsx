import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { UserCombinedProfile } from "@/types/return_types";
import { usePrivy } from "@privy-io/react-auth";
import { useSmartWallets } from "@privy-io/react-auth/smart-wallets";
import easAbi from "@ethereum-attestation-service/eas-contracts/deployments/optimism/EAS.json";
import { SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import { optimism, optimismSepolia } from "viem/chains";
import { Chain, createPublicClient, http } from "viem";
import { publicClient } from "@/lib/viemClient";
import { useState } from "react";
import { getEndorsementUid } from "@/functions/general/get-endorsement-uid";
import { LoaderIcon } from "lucide-react";

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
    const accessToken = await getAccessToken();
    if (client && accessToken && form.relationship && form.endorsement) {
      try {
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
          functionName: "attest",
          args: [
            {
              schema:
                process.env.NEXT_PUBLIC_VERCEL_ENV !== "production"
                  ? process.env.NEXT_PUBLIC_SEPOLIA_ENDORSEMENT_SCHEMA_UID
                  : process.env.NEXT_PUBLIC_ENDORSEMENT_SCHEMA_UID, // schema uid
              data: {
                recipient: user?.smart_wallet_address as `0x${string}`,
                expirationTime: 0,
                revocable: true,
                refUID: "0x" + "00".repeat(32),
                data: encodedData,
                value: 0,
              }, // attestation data
            },
          ],
          chain:
            process.env.NEXT_PUBLIC_VERCEL_ENV !== "production"
              ? (optimismSepolia as Chain)
              : (optimism as Chain),
          account: client?.account,
        };

        const { request, result } = await publicClient.simulateContract(
          contractParams
        );
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
            endorser: privyUser?.id,
            endorser_address: privyUser?.smartWallet?.address,
            relationship: form.relationship,
            endorsement: form.endorsement,
            privy_did: privyUser?.id,
          }),
        });
        const resData = (await res.json()).success;
        setIsLoading(false);
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
            <Input
              className='rounded-lg mt-2 w-full'
              id='relationship'
              defaultValue={form?.relationship ?? ""}
              onChange={(e) =>
                setForm({ ...form, relationship: e.target.value })
              }
              placeholder='Coworker'
            />
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

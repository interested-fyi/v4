import { publicClient } from "@/lib/viemClient";
import { parseEventLogs } from "viem";
import easAbi from "@ethereum-attestation-service/eas-contracts/deployments/optimism/EAS.json";

export const getEndorsementUid = async (txHash: `0x${string}`) => {
    const transaction = await publicClient.getTransactionReceipt({hash: txHash});
    const logs = parseEventLogs({
        abi: easAbi.abi,
        eventName: 'Attested',
        logs: transaction?.logs,
    });
    const attestLog = logs[0] as any;
    const uid = attestLog?.args?.uid;
    return uid;
}
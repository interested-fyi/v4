import { publicClient } from "../../lib/viemClient"; // Note: no .ts extension
import schemaRegistryAbi from "@ethereum-attestation-service/eas-contracts/deployments/optimism/SchemaRegistry.json";
import { Chain, optimism, optimismSepolia } from "viem/chains";
import * as dotenv from 'dotenv';
dotenv.config();

// Jest test function
test('simulateContract on SchemaRegistry contract', async () => {
    const contractParams = {
      address: process.env.NEXT_PUBLIC_SCHEMA_REGISTRY_ADDRESS as `0x${string}`,
      abi: schemaRegistryAbi.abi,
      functionName: 'register',
      args: [
          'string relationshipTest, string endorsementTest', //schema string
          '0x0000000000000000000000000000000000000000', // resolver address
          true // revocable or not
      ],
      chain:
        process.env.NODE_ENV !== "production"
          ? optimismSepolia as Chain
          : optimism as Chain,
      account: "0x08143826FEcD65D2fABc8d5D37a667028fdbA409" as `0x${string}`,
    }
    console.log('Contract Params:', JSON.stringify(contractParams));
    const { request, result } = await publicClient.simulateContract(contractParams);

    // Output the result to examine what comes back
    console.log('Request:', request);
    console.log('Result:', result);

    // You can make assertions here based on the expected result
    expect(result).toBeDefined(); // This just checks if `result` exists
});
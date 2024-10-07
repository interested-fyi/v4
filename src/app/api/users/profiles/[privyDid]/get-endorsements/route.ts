import { NextRequest, NextResponse } from "next/server";
import supabase from "@/lib/supabase";
import { PrivyClient } from "@privy-io/server-auth";

const privyClient = new PrivyClient(
  process.env.NEXT_PUBLIC_PRIVY_APP_ID!,
  process.env.PRIVY_SECRET!
);

export async function GET(
  req: NextRequest,
  { params }: { params: { privyDid: string } }
) {
  const recipient_address = req.nextUrl.searchParams.get("recipient_address");

  const endpoint = process.env.VERCEL_ENV !== "production" ? "https://optimism-sepolia.easscan.org/graphql" : "https://optimism.easscan.org/graphql";
  const query = `
    query EndorsementsQuery {
        schema(where: { id: "${process.env.VERCEL_ENV !== "production" ? process.env.NEXT_PUBLIC_SEPOLIA_ENDORSEMENT_SCHEMA_UID : process.env.NEXT_PUBLIC_ENDORSEMENT_SCHEMA_UID}" }) {
            attestations(where: { recipient: { equals: "${recipient_address}" }}) {
                attester,
                id,
                schemaId,
                timeCreated,
                revoked,
                revocationTime,
                recipient,
                expirationTime,
                decodedDataJson
            }
        }
    }
  `

  try {
    console.log(`Recipient Address--: ${recipient_address}`);
    const response = await fetch(endpoint, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ query })
    });
    console.log(`Response: ${JSON.stringify(response.statusText)}`);

    if (response.ok) {
        const data = await response.json();

        const endorsementsRaw = data?.data?.schema?.attestations;
        const endorsements = endorsementsRaw.map((endorsement: any) => {
            const decodedDataJson = JSON.parse(endorsement.decodedDataJson);
            return {
                endorser: endorsement.attester,
                id: endorsement.id,
                schemaId: endorsement.schemaId,
                timeCreated: endorsement.timeCreated,
                revoked: endorsement.revoked,
                revocationTime: endorsement.revocationTime,
                recipient: endorsement.recipient,
                expirationTime: endorsement.expirationTime,
                relationship: decodedDataJson.find((item: any) => item.name === "relationship")?.value?.value,
                endorsement: decodedDataJson?.find((item: any) => item.name === "endorsement")?.value?.value,
            }
        });
        console.log(`Endorsements: ${JSON.stringify(endorsements)}`);
        return NextResponse.json(
            {
              success: true,
              endorsements: {
                ...data,
              },
            },
            { status: 200 }
          );
    } else {
        throw new Error("Failed to fetch endorsements");
    }

    
  } catch (error) {
    console.log(`Error: ${error}`);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}

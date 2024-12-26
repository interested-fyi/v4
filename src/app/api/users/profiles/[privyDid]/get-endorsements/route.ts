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

  const endpoint = process.env.NEXT_PUBLIC_VERCEL_ENV !== "production" ? "https://optimism-sepolia.easscan.org/graphql" : "https://optimism.easscan.org/graphql";
  const query = `
    query EndorsementsQuery {
        schema(where: { id: "${process.env.NEXT_PUBLIC_VERCEL_ENV !== "production" ? process.env.NEXT_PUBLIC_SEPOLIA_ENDORSEMENT_SCHEMA_UID : process.env.NEXT_PUBLIC_ENDORSEMENT_SCHEMA_UID}" }) {
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
    const response = await fetch(endpoint, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ query })
    });

    if (response.ok) {
        const data = await response.json();

        const endorsementsRaw = data?.data?.schema?.attestations;
        const endorsements = [];
        for (const endorsement of endorsementsRaw) {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/users/get-profile-from-wallet?walletAddress=${endorsement.attester}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                const endorserData = response.ok ? (await response.json())?.profile : null;

                const decodedDataJson = JSON.parse(endorsement.decodedDataJson);

                endorsements.push({
                    endorser: endorsement.attester,
                    endorserData: endorserData,
                    id: endorsement.id,
                    schemaId: endorsement.schemaId,
                    timeCreated: new Date((endorsement?.timeCreated ?? 0) * 1000),
                    revoked: endorsement.revoked,
                    revocationTime: new Date((endorsement?.revocationTime ?? 0) * 1000),
                    recipient: endorsement.recipient,
                    expirationTime: new Date((endorsement?.expirationTime ?? 0) * 1000),
                    relationship: decodedDataJson.find((item: any) => item.name === "relationship")?.value?.value,
                    endorsement: decodedDataJson?.find((item: any) => item.name === "endorsement")?.value?.value,
                });
            } catch (error) {
                console.log(`Error: ${error}`);
            }
        }
        return NextResponse.json(
            {
              success: true,
              endorsements: endorsements,
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

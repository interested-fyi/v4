import { NextRequest, NextResponse } from "next/server";
import supabase from "@/lib/supabase";

// Function to clean and normalize titles
function cleanTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[\(\[].*?[\)\]]/g, "") // Remove text in parentheses/brackets
    .replace(/[^\w\s-]/g, " ") // Remove special chars except hyphen
    .replace(/\s+/g, " ") // Normalize whitespace
    .replace(/new$/i, "") // Remove 'new' suffix
    .trim();
}

// Calculate similarity between two strings (0-1)
function calculateSimilarity(str1: string, str2: string): number {
  const s1 = cleanTitle(str1);
  const s2 = cleanTitle(str2);

  // Convert strings to word sets for comparison
  const words1 = new Set(s1.split(" "));
  const words2 = new Set(s2.split(" "));

  // Calculate intersection and union
  const intersection = new Set([...words1].filter((x) => words2.has(x)));
  const union = new Set([...words1, ...words2]);

  // Jaccard similarity
  return intersection.size / union.size;
}

// Group similar titles together
function groupSimilarTitles(titles: string[]): string[] {
  const SIMILARITY_THRESHOLD = 0.8;
  const seen = new Set<string>();
  const result: string[] = [];

  for (const title of titles) {
    if (seen.has(title)) continue;

    // Find similar titles
    const similar = titles.filter(
      (t) =>
        !seen.has(t) &&
        (t === title || calculateSimilarity(title, t) >= SIMILARITY_THRESHOLD)
    );

    // Mark all similar titles as seen
    similar.forEach((t) => seen.add(t));

    // Add the most common version or the first one if tied
    const canonical = similar.reduce((a, b) =>
      similar.filter((t) => t === a).length >=
      similar.filter((t) => t === b).length
        ? a
        : b
    );

    result.push(canonical);
  }

  return result.sort();
}

export async function GET(req: NextRequest) {
  try {
    const { data, error } = await supabase.rpc("fetch_filters");

    if (error) {
      throw new Error(`Error fetching filters: ${error.message}`);
    }

    // Extract and deduplicate titles using fuzzy matching
    const roleTitles = groupSimilarTitles(
      data.map((item: any) => item.role_title).filter(Boolean)
    );

    const filters = {
      roleTitles,
      locations: groupSimilarTitles(
        Array.from(
          new Set(data.map((item: any) => item.location).filter(Boolean))
        )
      ),
      departments: groupSimilarTitles(
        Array.from(
          new Set(data.map((item: any) => item.department).filter(Boolean))
        )
      ),
    };

    return NextResponse.json(
      {
        success: true,
        roleTitles: filters.roleTitles,
        locations: filters.locations,
        departments: filters.departments,
      },
      { status: 200 }
    );
  } catch (e: any) {
    return NextResponse.json(
      { success: false, message: `Error fetching filters: ${e.message}` },
      { status: 500 }
    );
  }
}

import { connectDb } from "@/dbconfig/dbconfig";
import User from "@/models/user.model";
import { NextResponse } from "next/server";

// Always read fresh leaderboard data rather than serving a cached response.
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    // Wait for MongoDB to be connected before querying users.
    await connectDb();

    const users = await User.find({})
      .select("_id fullname username topSpeed testAttempted")
      .sort({ topSpeed: -1 })
      .limit(50)
      .lean();

    return NextResponse.json(
      {
        message: users.length > 0 ? "Leaderboard loaded" : "No leaderboard users found",
        users,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      },
    );
  } catch (error) {
    console.error("[LEADERBOARD_GET] Failed to load leaderboard:", error);

    return NextResponse.json(
      {
        message: "Failed to load leaderboard. Please try again later.",
        users: [],
      },
      { status: 500 },
    );
  }
}

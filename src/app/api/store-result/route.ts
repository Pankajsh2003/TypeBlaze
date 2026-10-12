import { connectDb } from "@/dbconfig/dbconfig";
import { getDataFromToken } from "@/lib/getDataFromToken";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
  try {
    // Wait for MongoDB to be ready before querying it.
    await connectDb();

    const body = (await request.json()) as {
      speed?: unknown;
      accuracy?: unknown;
    };

    const speed = Number(body?.speed);
    const accuracy = Number(body?.accuracy);

    if (!Number.isFinite(speed) || speed < 0) {
      return NextResponse.json(
        { message: "Invalid typing speed." },
        { status: 400 },
      );
    }

    if (!Number.isFinite(accuracy) || accuracy < 0 || accuracy > 100) {
      return NextResponse.json(
        { message: "Accuracy must be a number from 0 to 100." },
        { status: 400 },
      );
    }

    // Results belong to a user account, so require a valid login token.
    let reqUserId: string | null | undefined;
    try {
      reqUserId = getDataFromToken(request) as string | null | undefined;
    } catch {
      return NextResponse.json(
        { message: "Please log in to save your typing result." },
        { status: 401 },
      );
    }

    if (!reqUserId) {
      return NextResponse.json(
        { message: "Please log in to save your typing result." },
        { status: 401 },
      );
    }

    if (accuracy < 40) {
      return NextResponse.json(
        { message: "Accuracy must be at least 40% to save this result." },
        { status: 403 },
      );
    }

    const user = await User.findById(reqUserId);
    if (!user) {
      return NextResponse.json(
        { message: "User account was not found. Please log in again." },
        { status: 404 },
      );
    }

    const currentAvgSpeed = Number(user.avgSpeed) || 0;
    const currentTestAttempted = Number(user.testAttempted) || 0;
    const currentTopSpeed = Number(user.topSpeed) || 0;
    const currentAccuracy = Number(user.accuracy) || 0;

    const newTestAttempted = currentTestAttempted + 1;
    const newAvgSpeed = Math.round(
      (currentAvgSpeed * currentTestAttempted + speed) / newTestAttempted,
    );
    const newTopSpeed = Math.max(currentTopSpeed, speed);
    const newAccuracy = Math.max(currentAccuracy, accuracy);

    if (!Array.isArray(user.history)) {
      user.history = [];
    }

    user.history.push({
      speed,
      accuracy,
      testPlayed: new Date(),
    });

    user.testAttempted = newTestAttempted;
    user.avgSpeed = newAvgSpeed;
    user.topSpeed = newTopSpeed;
    user.accuracy = newAccuracy;
    user.lastActive = new Date();

    await user.save();

    return NextResponse.json(
      {
        message: "Result stored successfully.",
        result: {
          speed,
          accuracy,
          avgSpeed: newAvgSpeed,
          topSpeed: newTopSpeed,
          testAttempted: newTestAttempted,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Failed to store typing result:", error);
    return NextResponse.json(
      { message: "Failed to store the result. Please try again." },
      { status: 500 },
    );
  }
}

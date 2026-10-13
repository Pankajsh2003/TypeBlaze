import { connectDb } from "@/dbconfig/dbconfig";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    // Ensure the database connection is ready before querying or creating users.
    await connectDb();

    const body: unknown = await request.json();
    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { message: "Invalid request body" },
        { status: 400 }
      );
    }

    const payload = body as Record<string, unknown>;
    const fullname = typeof payload.fullname === "string" ? payload.fullname.trim() : "";
    const username = typeof payload.username === "string" ? payload.username.trim().toLowerCase() : "";
    const email = typeof payload.email === "string" ? payload.email.trim().toLowerCase() : "";
    const password = typeof payload.password === "string" ? payload.password : "";

    if (!fullname || !username || !email || !password) {
      return NextResponse.json(
        { message: "Please fill in all fields" },
        { status: 400 }
      );
    }

    if (fullname.length < 3 || fullname.length > 50) {
      return NextResponse.json(
        { message: "Full name must be between 3 and 50 characters" },
        { status: 400 }
      );
    }

    if (username.length < 3 || username.length > 20) {
      return NextResponse.json(
        { message: "Username must be between 3 and 20 characters" },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { message: "Please enter a valid email address" },
        { status: 400 }
      );
    }

    // Match the minimum password length defined in the User schema.
    if (password.length < 5) {
      return NextResponse.json(
        { message: "Password must be at least 5 characters long" },
        { status: 400 }
      );
    }

    // Check for email and username conflicts before attempting the insert.
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    })
      .select("email username")
      .lean();

    if (existingUser) {
      if (existingUser.email === email) {
        return NextResponse.json(
          { message: "An account with this email already exists" },
          { status: 409 }
        );
      }

      if (existingUser.username === username) {
        return NextResponse.json(
          { message: "This username is already taken" },
          { status: 409 }
        );
      }
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    const createdUser = await User.create({
      fullname,
      username,
      email,
      password: hashedPassword,
      // The schema supplies defaults for the other user fields.
      history: [],
    });

    return NextResponse.json(
      {
        message: "Account created successfully",
        success: true,
        user: {
          id: createdUser._id.toString(),
          fullname: createdUser.fullname,
          username: createdUser.username,
          email: createdUser.email,
        },
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("Signup failed:", error);

    // Unique indexes still protect against duplicate accounts if two requests race.
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code?: number }).code === 11000
    ) {
      const duplicateError = error as { keyValue?: Record<string, unknown> };
      if (duplicateError.keyValue?.email) {
        return NextResponse.json(
          { message: "An account with this email already exists" },
          { status: 409 }
        );
      }
      if (duplicateError.keyValue?.username) {
        return NextResponse.json(
          { message: "This username is already taken" },
          { status: 409 }
        );
      }
      return NextResponse.json(
        { message: "An account with these details already exists" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { message: "Failed to create account. Please try again later." },
      { status: 500 }
    );
  }
}

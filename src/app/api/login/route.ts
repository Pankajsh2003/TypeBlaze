import { connectDb } from "@/dbconfig/dbconfig";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const body: unknown = await request.json();

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json(
        { message: "Invalid request body" },
        { status: 400 }
      );
    }

    const payload = body as Record<string, unknown>;

    const email =
      typeof payload.email === "string"
        ? payload.email.trim().toLowerCase()
        : "";

    const password =
      typeof payload.password === "string"
        ? payload.password
        : "";

    if (!email || !password) {
      return NextResponse.json(
        { message: "Please enter your email and password" },
        { status: 400 }
      );
    }

    await connectDb();

    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return NextResponse.json(
        { message: "User does not exist. Please sign up first." },
        { status: 401 }
      );
    }

    const validPassword = await bcryptjs.compare(
      password,
      existingUser.password
    );

    if (!validPassword) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    const tokenSecret = process.env.TOKEN_SECRET;

    if (!tokenSecret) {
      console.error("Login configuration error: TOKEN_SECRET is missing");

      return NextResponse.json(
        { message: "Login service configuration error" },
        { status: 500 }
      );
    }

    const token = jwt.sign(
      {
        id: existingUser._id.toString(),
        email: existingUser.email,
      },
      tokenSecret,
      { expiresIn: "1d" }
    );

    const user = {
      id: existingUser._id.toString(),
      name: existingUser.fullname,
      email: existingUser.email,
      isPremium: existingUser.isPremium || false,
      token,
    };

    const response = NextResponse.json(
      {
        message: "Login successful",
        success: true,
        user,
        token,
      },
      { status: 200 }
    );

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 86400,
    });

    return response;
  } catch (error: unknown) {
    console.error("Login API failed:", error);

    return NextResponse.json(
      { message: "Login failed. Please try again." },
      { status: 500 }
    );
  }
}

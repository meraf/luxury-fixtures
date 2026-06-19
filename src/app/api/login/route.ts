import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    const user = await prisma.user.findUnique({
      where: { email },
    });

    // DEBUG: Print to your terminal/console to verify the DB record
    console.log("Prisma Found User:", user); 

    if (!user || user.password !== password) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Ensure we are explicitly mapping the ID
    const userPayload = {
      id: user.id, // This MUST exist in your database
      email: user.email,
      name: user.name,
      role: user.role
    };

    const response = NextResponse.json(
      { 
        success: true, 
        user: userPayload 
      },
      { status: 200 }
    );

    // Cookie configuration
    const host = request.headers.get("host") || "";
    const isLocalhost = host.includes("localhost") || host.includes("127.0.0.1");
    const isProd = process.env.NODE_ENV === "production";

    response.cookies.set("token", "authenticated-session-active", {
      httpOnly: true,
      secure: isProd && !isLocalhost,
      sameSite: "lax",
      maxAge: 60 * 60 * 24,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}   
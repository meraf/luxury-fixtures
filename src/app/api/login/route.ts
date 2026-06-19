import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || user.password !== password) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const response = NextResponse.json(
      { 
        success: true, 
        user: { id: user.id, email: user.email, name: user.name, role: user.role } 
      },
      { status: 200 }
    );

    // Detect if running on localhost to prevent cookie rejection over HTTP
    const host = request.headers.get("host") || "";
    const isLocalhost = host.includes("localhost") || host.includes("127.0.0.1");
    const isProd = process.env.NODE_ENV === "production";

    // Set cookie precisely matching what middleware expects
    response.cookies.set("token", "authenticated-session-active", {
      httpOnly: true,
      secure: isProd && !isLocalhost, // Only force secure HTTPS if we are NOT on localhost
      sameSite: "lax",               // Changed to "lax" to ensure it persists during hard context switches
      maxAge: 60 * 60 * 24,          // 1 day session expiration
      path: "/",                     // Accessible globally across all app structures
    });

    return response;
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
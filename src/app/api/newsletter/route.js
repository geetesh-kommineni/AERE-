import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function POST(request) {
  const { name, email } = await request.json();
  if (!email)
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  const db = getDb();
  try {
    db.prepare("INSERT INTO newsletter (name, email) VALUES (?, ?)").run(
      name || "",
      email,
    );
    return NextResponse.json(
      { success: true, message: "Welcome — you're on the list." },
      { status: 201 },
    );
  } catch {
    return NextResponse.json({
      success: true,
      message: "You're already subscribed.",
    });
  }
}

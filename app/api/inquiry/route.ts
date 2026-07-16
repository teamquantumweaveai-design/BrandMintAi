import { NextResponse } from "next/server";
import { z } from "zod";

// Zod validation schema
const inquirySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please provide a valid email address."),
  company: z.string().optional(),
  type: z.enum(["Venture Incubation", "Enterprise Automation", "Custom IP Forge", "General"]),
  message: z.string().min(10, "Message must be at least 10 characters."),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Server-side validation check
    const validation = inquirySchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation failed", issues: validation.error.format() },
        { status: 400 }
      );
    }

    // Simulate database network latency
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return NextResponse.json(
      {
        success: true,
        message: "Secure handshake complete. Inquiry logged in telemetry queue.",
        received: validation.data,
      },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

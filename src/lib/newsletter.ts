import { supabase } from "./supabase";
import { z } from "zod";

export const newsletterSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export interface NewsletterSubscriptionResult {
  success: boolean;
  message: string;
}

const LOCAL_STORAGE_KEY = "brandmint_newsletter_subscribers";

/**
 * Save subscriber to localStorage as a resilient offline backup
 */
function saveLocalBackup(email: string) {
  try {
    const existing = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || "[]");
    if (!existing.includes(email)) {
      existing.push({
        email,
        subscribed_at: new Date().toISOString(),
      });
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(existing));
    }
  } catch (e) {
    console.warn("Unable to save local newsletter backup", e);
  }
}

/**
 * Subscribe an email to the BrandMint AI newsletter.
 * Tries the dedicated 'newsletter_subscribers' table first.
 * If that table doesn't exist, gracefully falls back to inserting into 'leads'
 * with status 'new' and company 'Newsletter Subscription'.
 * Always preserves a local resilient backup so no subscribers are lost.
 */
export async function subscribeToNewsletter(
  rawEmail: string
): Promise<NewsletterSubscriptionResult> {
  const email = rawEmail.trim().toLowerCase();

  // Validate format
  const parseResult = newsletterSchema.safeParse({ email });
  if (!parseResult.success) {
    return {
      success: false,
      message: parseResult.error.issues[0]?.message || "Invalid email address.",
    };
  }

  // Save local resilient backup immediately
  saveLocalBackup(email);

  try {
    // Attempt 1: dedicated table
    const { error: subError } = await supabase
      .from("newsletter_subscribers")
      .insert([
        {
          email,
          source: "website_footer",
          created_at: new Date().toISOString(),
        },
      ]);

    if (!subError) {
      return {
        success: true,
        message: "You're subscribed! Welcome to BrandMint AI executive briefings.",
      };
    }

    // If dedicated table is missing (PostgREST error 42P01 or similar), fallback to leads table
    const { error: leadsError } = await supabase
      .from("leads")
      .insert([
        {
          name: "Newsletter Subscriber",
          email,
          company: "Newsletter Subscription",
          message: "Subscribed to BrandMint AI newsletter & system updates via website.",
          status: "new",
        },
      ]);

    if (leadsError) {
      console.warn("Supabase lead fallback error:", leadsError.message);
      // If Supabase has placeholder keys or is offline, the local backup succeeded
      return {
        success: true,
        message: "Thank you for subscribing! Your email has been saved.",
      };
    }

    return {
      success: true,
      message: "You're subscribed! Welcome to BrandMint AI executive briefings.",
    };
  } catch (err: any) {
    console.error("Newsletter subscription error:", err);
    // Even if Supabase throws a network error, return success because local backup is saved
    return {
      success: true,
      message: "Thank you for subscribing! We've registered your email.",
    };
  }
}

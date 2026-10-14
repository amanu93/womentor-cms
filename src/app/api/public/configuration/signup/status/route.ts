import { getSiteContent } from "@/lib/content";
import { json, options } from "@/lib/cors";

// Same shape as api.womentorafrica.com/public/configuration/signup/status
export async function GET() {
  const { settings } = await getSiteContent();
  return json({
    menteeSignup: settings.menteeSignup,
    menteeWaitlist: settings.menteeWaitlist,
    mentorSignup: settings.mentorSignup,
    mentorWaitlist: settings.mentorWaitlist,
  });
}
export const OPTIONS = options;

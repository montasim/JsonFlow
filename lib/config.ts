// App configuration from environment variables
export const config = {
  appName: process.env.NEXT_PUBLIC_APP_NAME || "JsonFlow",
  appUrl: process.env.NEXT_PUBLIC_APP_URL || "https://github.com/montasim/JsonFlow",
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "montasimmamun@gmail.com",
} as const;

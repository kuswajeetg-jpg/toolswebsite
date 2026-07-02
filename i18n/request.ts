import { getRequestConfig } from "next-intl/server";

const locales = ["en", "hi"];

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  // Validate locale and fallback to default if undefined or invalid
  if (!locale || !locales.includes(locale)) {
    locale = "en";
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});

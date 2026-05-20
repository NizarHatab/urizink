import AboutPageView from "@/components/sections/about-page-view";
import { getAboutPageContent } from "@/services/home-content.service";

export const dynamic = "force-dynamic";

export default async function Page() {
  const content = await getAboutPageContent();
  return <AboutPageView content={content} />;
}

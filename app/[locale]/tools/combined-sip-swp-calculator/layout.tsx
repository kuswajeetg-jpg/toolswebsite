import SeoArticle from "@/components/tools/SeoArticle";

export const metadata = {
  title: "Combined SIP & SWP Calculator | Mutual Fund Planner",
  description: "Plan your complete financial lifecycle. Calculate SIP returns for wealth accumulation and SWP withdrawals for retirement income.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <SeoArticle toolId="combined-sip-swp-calculator" />
    </>
  );
}

import { setRequestLocale } from "next-intl/server";
import { ToolWorkspace } from "@/components/ToolWorkspace";

export default async function ConvertPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ToolWorkspace mode="convert" />;
}

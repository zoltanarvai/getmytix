import { notFound } from "next/navigation";
import { events } from "@/lib/domain";
import { StartBuyingSession } from "@/components/organisms";
import { PageTitles } from "@/components/molecules";

type StartProps = {
  params: {
    subdomain: string;
  };
};

export default async function Start({ params: { subdomain } }: StartProps) {
  const event = await events.getEventBySubdomain(subdomain);

  if (!event) {
    return notFound();
  }

  return (
    <main className="flex min-h-screen flex-col max-w-screen-lg m-auto gap-2">
      <PageTitles title={event.name} subtitle={event.description} />

      <section className="flex items-center justify-center mt-6">
        <StartBuyingSession hideTitle />
      </section>
    </main>
  );
}

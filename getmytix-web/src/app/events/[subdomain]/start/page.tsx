import { notFound } from "next/navigation";
import { getEvent } from "@/lib/domain/events";
import { StartBuyingSession } from "@/components/organisms";

type StartProps = {
  params: {
    subdomain: string;
  };
};

export default async function Start({ params: { subdomain } }: StartProps) {
  const event = await getEvent(subdomain);

  if (!event) {
    return notFound();
  }

  return (
    <main className="flex min-h-screen flex-col max-w-screen-lg m-auto gap-2">
      <section className="flex self-center flex-col mt-20 items-center">
        <h1 className="text-6xl font-bold tracking-tight">{event.name}</h1>
        <h2 className="text-2xl text-gray-500 mt-2 text-center">
          {event.description}
        </h2>
      </section>

      <section className="flex items-center justify-center mt-6">
        <StartBuyingSession hideTitle />
      </section>
    </main>
  );
}

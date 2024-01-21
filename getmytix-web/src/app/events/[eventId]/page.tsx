import Image from "next/image";
import { notFound } from "next/navigation";
import { getEvent } from "@/lib/domain/events";
import { StartBuyingSession } from "@/components/organisms";
import { EventDetailBox } from "@/components/molecules";

type EventProps = {
  params: {
    eventId: string;
  };
};

export default async function Event({ params: { eventId } }: EventProps) {
  const event = await getEvent(eventId);

  if (!event) {
    return notFound();
  }

  return (
    <main className="flex min-h-screen flex-col max-w-screen-lg m-auto gap-2">
      <section className="flex self-start flex-col">
        <h1 className="text-4xl font-bold">VITORLAZAS 2024</h1>
        <h2 className="text-2xl font-bold">
          Bontsunk vitrlat, epitsunk eletre szolo kapcsolatokat
        </h2>
      </section>

      <Image
        src="https://networkingkonferencia.hu/wp-content/uploads/2023/05/FB-esemeny-boritok-5.png"
        alt="esemeny logo"
        width={0}
        height={0}
        sizes="100vw"
        style={{ width: "100%", height: "auto" }}
        className="rounded-xl"
      />

      <EventDetailBox
        title="Esemeny reszletek"
        icon="📅"
        description="Vitorlazzuk korbe a balaton, egyutt. Balatonfuredrol indulva, izgalmas esemenyeken resztvehetunk es elvezhetjuk a Balaton nyujtotta lehetosegeket."
      />
      <section className="flex gap-2">
        <EventDetailBox
          title="Ido"
          icon="🕒"
          description="2024.05.01 13:00 - 17:00"
        />
        <EventDetailBox
          title="Helyszin"
          icon="📍"
          description="Balatonfured, Marina kikoto"
        />
      </section>
      <section className="flex flex-1 items-center justify-center m-8">
        <StartBuyingSession />
      </section>
    </main>
  );
}

import Image from "next/image";
import { notFound } from "next/navigation";
import { Bars4Icon, ClockIcon, MapPinIcon } from "@heroicons/react/24/solid";
import { getEvent } from "@/lib/domain/events";
import { StartBuyingSession } from "@/components/organisms";
import { EventDetailBox } from "@/components/molecules";

type EventProps = {
  params: {
    subdomain: string;
  };
};

const formatDateTime = (startDateTime: string, endDateTime?: string) => {
  if (!endDateTime) {
    return new Date(startDateTime).toLocaleString("hu-HU");
  }

  console.log(startDateTime, endDateTime);

  const startDate = new Date(startDateTime).toLocaleString("hu-HU");
  const endDate = new Date(endDateTime).toLocaleString("hu-HU");

  console.log(startDate, endDate);

  return `${startDate} - ${endDate}`;
};

const formatDescription = (description: string) => {
  return description.replace(/\n/g, "<br />");
};

const formatAddress = (city: string, street: string, zipCode: string) => {
  return `${city}, ${street} ${zipCode}`;
};

export default async function Event({ params: { subdomain } }: EventProps) {
  const event = await getEvent(subdomain);

  if (!event) {
    return notFound();
  }

  return (
    <main className="flex min-h-screen flex-col max-w-screen-lg m-auto gap-2">
      <section className="flex self-center flex-col my-20 items-center">
        <h1 className="text-6xl font-bold tracking-tight">{event.name}</h1>
        <h2 className="text-2xl text-gray-500 mt-2">{event.description}</h2>
      </section>

      <Image
        src={event.banner}
        alt="esemeny logo"
        width={0}
        height={0}
        sizes="100vw"
        style={{ width: "100%", height: "auto" }}
        className="rounded-xl"
      />

      <EventDetailBox
        title="Esemény részletei"
        icon={<Bars4Icon className="w-6 h-6  text-gray-500" />}
        description={formatDescription(event.longDescription)}
        descriptionAsHtml
      />
      <section className="flex gap-2">
        <EventDetailBox
          title="Időpont"
          icon={<ClockIcon className="w-6 h-6 text-gray-500" />}
          description={formatDateTime(event.startDateTime, event.endDateTime)}
        />
        <EventDetailBox
          title="Helyszín"
          icon={<MapPinIcon className="w-6 h-6  text-gray-500" />}
          description={formatAddress(
            event.address.city,
            event.address.street,
            event.address.zipCode
          )}
        />
      </section>
      <section className="flex flex-1 items-center justify-center m-8">
        <StartBuyingSession />
      </section>
    </main>
  );
}

import { notFound } from "next/navigation";
import { events } from "@/lib/domain";
import { PageTitles } from "@/components/molecules";

type VerifyProps = {
  params: {
    subdomain: string;
  };
};

export default async function Verify({ params: { subdomain } }: VerifyProps) {
  const event = await events.getEventBySubdomain(subdomain);

  if (!event) {
    return notFound();
  }

  return (
    <main className="flex min-h-screen flex-col max-w-screen-lg m-auto gap-2">
      <PageTitles title={event.name} subtitle={event.description} />

      <section className="flex items-center justify-center mt-6">
        Scan or enter the code to verify your ticket.
        {/* 
            SCAN button with SCAN text

            OR (text)

            Enter code input: with input field and submit button
        */}
      </section>
    </main>
  );
}

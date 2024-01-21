import { Montserrat } from "next/font/google";

const fontMontserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
});

type EventDetailBoxProps = {
  icon: React.ReactNode;
  title: string;
  description: React.ReactNode;
};

export const EventDetailBox = ({
  icon,
  title,
  description,
}: EventDetailBoxProps) => {
  return (
    <section className="rounded-xl border-grey p-6 flex-1">
      <div className="flex gap-4">
        <div>{icon}</div>
        <h3
          className={`uppercase font-bold text-xl antialiased ${fontMontserrat.className}`}
        >
          {title}
        </h3>
      </div>
      <p className="mt-2">{description}</p>
    </section>
  );
};

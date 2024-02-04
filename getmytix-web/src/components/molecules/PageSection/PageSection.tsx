import { Montserrat } from "next/font/google";

const fontMontserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
});

export function PageSection({
  title,
  children,
  classNames,
}: {
  title: string;
  children: React.ReactNode;
  classNames?: string;
}) {
  return (
    <>
      <h2
        className={`uppercase font-bold text-xl antialiased ${
          fontMontserrat.className
        } ${classNames || ""}`}
      >
        {title}
      </h2>
      <section className="mt-2 flex flex-1 flex-col gap-2">{children}</section>
    </>
  );
}

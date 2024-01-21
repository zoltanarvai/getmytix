import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Montserrat } from "next/font/google";

const fontMontserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
});

type EventDetailBoxProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
  descriptionAsHtml?: boolean;
};

export const EventDetailBox = ({
  icon,
  title,
  description,
  descriptionAsHtml,
}: EventDetailBoxProps) => {
  return (
    <Card className="bg-gray-100 flex-1">
      <CardHeader className="flex flex-row gap-2 items-center">
        <div>{icon}</div>
        <CardTitle
          className={`uppercase font-bold text-xl antialiased ${fontMontserrat.className}`}
        >
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {descriptionAsHtml ? (
          <p dangerouslySetInnerHTML={{ __html: description }} />
        ) : (
          <p>{description}</p>
        )}
      </CardContent>
    </Card>
  );
};

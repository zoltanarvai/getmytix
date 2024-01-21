export const TwoColumnLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => <div className="flex md:flex-row flex-col gap-10">{children}</div>;

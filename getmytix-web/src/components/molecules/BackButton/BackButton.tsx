"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

type BackButtonProps = {
  title: string;
};

export function BackButton({ title }: BackButtonProps) {
  const router = useRouter();

  return <Button onClick={() => router.back()}>{title}</Button>;
}

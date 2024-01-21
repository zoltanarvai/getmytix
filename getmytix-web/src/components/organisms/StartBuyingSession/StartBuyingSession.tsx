"use client";

import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { createSession } from "@/app/server-actions/session";

const formSchema = z.object({
  email: z.string().email({
    message: "Helytelen e-mail cím formátum",
  }),
});

type StartBuyingSessionProps = {
  hideTitle?: boolean;
};

export function StartBuyingSession({ hideTitle }: StartBuyingSessionProps) {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    await createSession({
      email: data.email,
    });

    router.push(`tickets`);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {!hideTitle && <h1 className="text-2xl font-bold">Csatlakozom!</h1>}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col items-center gap-4"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="add meg az e-mail címed"
                    // type="email"
                    className="w-96 text-center text-md"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="text-xl font-bold rounded-full px-6 py-6"
          >
            Jegyvásárlás
          </Button>
        </form>
      </Form>
    </div>
  );
}

"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { Montserrat } from "next/font/google";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { TwoColumnLayout } from "./TwoColumnLayout";
import { Column } from "./Column";
import { CustomerData, formSchema } from "./customer-details-form-schema";

const fontMontserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
});

type CustomerDetailsFormProps = {
  onCustomerDetailsSubmitted: (data: CustomerData) => void;
};

export function CustomerDetailsForm({
  onCustomerDetailsSubmitted,
}: CustomerDetailsFormProps) {
  const form = useForm<CustomerData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      street: "",
      streetNumber: "",
      city: "",
      zip: "",
      state: "",
      country: "",
      phone: "",
    },
  });

  const onSubmit = async (data: CustomerData) => {
    onCustomerDetailsSubmitted(data);
  };

  return (
    <Card className="flex flex-col gap-4 py-4 mb-8">
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <TwoColumnLayout>
              <Column>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold">Teljes név</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Teljes név"
                          className="text-md max-w-96"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="street"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold">Utca</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Utca"
                          className="text-md max-w-96"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="streetNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold">Házszám</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Házszám"
                          className="text-md max-w-96"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold">Város</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Város"
                          className="text-md max-w-96"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </Column>

              <Column>
                <FormField
                  control={form.control}
                  name="zip"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold">Irányítószám</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Irányítószám"
                          className="text-md max-w-96"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold">Megye</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Megye"
                          className="text-md max-w-96"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold">Ország</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ország"
                          className="text-md max-w-96"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold">Telefonszám</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Telefonszám"
                          className="text-md max-w-96"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </Column>
            </TwoColumnLayout>
            <Button
              type="submit"
              className="text-xl font-bold rounded-full px-6 py-6 self-center mt-8 w-44"
            >
              Fizetés
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

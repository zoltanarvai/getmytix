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
    console.log(">>> here");
    onCustomerDetailsSubmitted(data);
  };

  return (
    <div className="flex flex-col justify-start w-full mt-8">
      <h2
        className={`uppercase font-bold text-xl antialiased ${fontMontserrat.className}`}
      >
        Vásárló adatai
      </h2>

      <Card className="flex flex-col gap-4 p-4 mt-2">
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={(x) => {
                console.log(">>> here", x.target);
                debugger;
                form.handleSubmit(onSubmit)(x);
              }}
              className="flex flex-col gap-4"
            >
              <TwoColumnLayout>
                <Column>
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Teljes név</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Teljes név"
                            className="md:w-96 w-80 text-md"
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
                        <FormLabel>Utca</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Utca"
                            className="md:w-96 w-80 text-md"
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
                        <FormLabel>Házszám</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Házszám"
                            className="md:w-96 w-80 text-md"
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
                        <FormLabel>Telefonszám</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Telefonszám"
                            className="md:w-96 w-80 text-md"
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
                        <FormLabel>Irányítószám</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Irányítószám"
                            className="md:w-96 w-80 text-md"
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
                        <FormLabel>Város</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Város"
                            className="md:w-96 w-80 text-md"
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
                        <FormLabel>Megye</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Megye"
                            className="md:w-96 w-80 text-md"
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
                        <FormLabel>Ország</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ország"
                            className="md:w-96 w-80 text-md"
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
    </div>
  );
}

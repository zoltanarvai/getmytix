"use client";

import React from "react";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form";
import {Card, CardContent} from "@/components/ui/card";
import {TwoColumnLayout} from "./TwoColumnLayout";
import {Column} from "./Column";
import {CustomerData, formSchema} from "./customer-details-form-schema";
import Link from "next/link";
import {Checkbox} from "@/components/ui/checkbox";
import {CheckedState} from "@radix-ui/react-checkbox";

type CustomerDetailsFormProps = {
    onCustomerDetailsSubmitted: (data: CustomerData) => void;
};

export function CustomerDetailsForm({
                                        onCustomerDetailsSubmitted,
                                    }: CustomerDetailsFormProps) {
    const [tosAccepted, setTosAccepted] = React.useState(false);

    const form = useForm<CustomerData>({
        resolver: zodResolver(formSchema),
        // defaultValues: {
        //     name: "Zoltan Arvai",
        //     street: "Magyar utca",
        //     streetNumber: "38/a",
        //     city: "Budapest",
        //     zip: "1053",
        //     state: "Pest",
        //     country: "Magyarorszag",
        //     phone: "435345435543",
        // },
        defaultValues: {
            name: "",
            street: "",
            streetNumber: "",
            city: "",
            zip: "",
            state: "",
            country: "",
            phone: "",
            taxNumber: "",
        },
    });

    const onCheckChanged = (checked: CheckedState) => {
        setTosAccepted(checked === true);
    };

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
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel className="font-bold">Teljes név / Cég név</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Teljes név vagy cég név"
                                                    className="text-md max-w-96"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="taxNumber"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel className="font-bold">Adószám</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Adószám"
                                                    className="text-md max-w-96"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="street"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel className="font-bold">Utca</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Utca"
                                                    className="text-md max-w-96"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="streetNumber"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel className="font-bold">Házszám</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Házszám"
                                                    className="text-md max-w-96"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="city"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel className="font-bold">Város</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Város"
                                                    className="text-md max-w-96"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                            </Column>

                            <Column>
                                <FormField
                                    control={form.control}
                                    name="zip"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel className="font-bold">Irányítószám</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Irányítószám"
                                                    className="text-md max-w-96"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="state"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel className="font-bold">Megye</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Megye"
                                                    className="text-md max-w-96"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="country"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel className="font-bold">Ország</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Ország"
                                                    className="text-md max-w-96"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="phone"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel className="font-bold">Telefonszám</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Telefonszám"
                                                    className="text-md max-w-96"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                            </Column>
                        </TwoColumnLayout>

                        <div className="mt-6 w-4/5 max-md:w-full m-auto">
                            <Checkbox id="terms" onCheckedChange={onCheckChanged}/>
                            <label htmlFor="terms" className="text-sm font-medium ml-2">
                                Tudomásul veszem, hogy a MediaWorks Hungary Zrt (Budapest, Üllői út 48, 1082) adatkezelő
                                által a jegyertekesites.figyelo.hu
                                felhasználói adatbázisában tárolt alábbi személyes adataim
                                átadásra kerülnek az OTP Mobil Kft., mint adatfeldolgozó
                                részére. Az adatkezelő által továbbított adatok köre az alábbi:
                                Név, számlázási cím, telefonszám, e-mail cím. Az adatfeldolgozó
                                által végzett adatfeldolgozási tevékenység jellege és célja a
                                SimplePay Adatkezelési tájékoztatóban, az alábbi linken
                                tekinthető meg:{" "}
                                <Link href="http://simplepay.hu/vasarlo-aff" target="_blank"
                                      className="underline cursor-pointer">
                                    http://simplepay.hu/vasarlo-aff
                                </Link>
                            </label>
                        </div>

                        <Button
                            type="submit"
                            className="text-xl font-bold px-6 py-6 self-center mt-8 w-44"
                            disabled={!tosAccepted}
                        >
                            Fizetés
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}

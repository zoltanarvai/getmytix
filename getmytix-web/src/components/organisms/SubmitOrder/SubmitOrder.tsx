"use client";

import React from "react";
import {createOrder} from "@/app/server-actions/create-order";
import {CustomerData, CustomerDetailsForm} from "../CustomerDetailsForm";

type SubmitOrderProps = {
    subdomain: string;
    clientSlug: string;
    shoppingCartId: string;
};

export function SubmitOrder({subdomain, clientSlug, shoppingCartId}: SubmitOrderProps) {
    const onSubmit = async (data: CustomerData) => {
        const paymentResponse = await createOrder({
            subdomain,
            clientSlug,
            shoppingCartId,
            customerDetails: {
                name: data.name,
                street: data.street,
                streetNumber: data.streetNumber,
                city: data.city,
                zip: data.zip,
                state: data.state,
                country: data.country,
                phone: data.phone,
                taxNumber: data.taxNumber
            },
        });

        if (paymentResponse.mode === "confirmation") {
            // Navigate to free checkout complete page
            window.location.href = paymentResponse.redirectUrl;
        } else {
            // Navigate to payment page
            window.location.href = paymentResponse.redirectUrl;
        }
    };

    return <CustomerDetailsForm onCustomerDetailsSubmitted={onSubmit}/>;
}

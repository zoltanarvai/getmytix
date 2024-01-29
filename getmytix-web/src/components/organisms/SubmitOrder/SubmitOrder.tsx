"use client";

import React from "react";
import { createOrder } from "@/app/server-actions/create-order";
import { CustomerDetailsForm } from "../CustomerDetailsForm";
import { CustomerData } from "../CustomerDetailsForm";

type SubmitOrderProps = {
  sessionId: string;
  subdomain: string;
  shoppingCartId: string;
};

export function SubmitOrder({
  sessionId,
  subdomain,
  shoppingCartId,
}: SubmitOrderProps) {
  const onSubmit = async (data: CustomerData) => {
    const paymentUrl = await createOrder({
      sessionId,
      subdomain,
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
      },
    });

    debugger;

    // Navigate to payment page
    window.location.href = paymentUrl;
  };

  return <CustomerDetailsForm onCustomerDetailsSubmitted={onSubmit} />;
}

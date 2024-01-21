"use client";

import React from "react";
import { createOrder } from "@/app/server-actions/create-order";
import { CustomerDetailsForm } from "../CustomerDetailsForm";
import { CustomerData } from "../CustomerDetailsForm";

type SubmitOrderProps = {
  sessionId: string;
  subdomain: string;
};

export function SubmitOrder({ sessionId, subdomain }: SubmitOrderProps) {
  const onSubmit = async (data: CustomerData) => {
    const orderId = await createOrder({
      shoppingCart: {
        sessionId,
        subdomain,
      },
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

    // Navigate to payment page
    window.location.href = `https://www.barion.com`;
  };

  return <CustomerDetailsForm onCustomerDetailsSubmitted={onSubmit} />;
}

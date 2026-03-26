"use server";

import { supabase } from "@/lib/supabase";
import { parsePriceToCents } from "@/lib/checkout/pricing";

export type CartItem = {
  slug: string;
  name: string;
  price: string;
  size: string;
  quantity: number;
};

export type CustomerData = {
  email: string;
  fullName: string;
  phoneNumber: string;
  phoneNumberPrefix: string;
  legalId: string;
  legalIdType: string;
};

export type ShippingAddress = {
  addressLine1: string;
  city: string;
  phoneNumber: string;
  region: string;
  country: string;
};

export type CheckoutResult =
  | { success: true; orderId: string }
  | { success: false; error: string };

export async function createOrderRecord(
  customerData: CustomerData,
  shippingAddress: ShippingAddress,
  paymentMethod: string,
  items: CartItem[]
): Promise<CheckoutResult> {
  try {
    const { data: customer, error: customerError } = await supabase
      .from("customers")
      .insert({
        email: customerData.email,
        full_name: customerData.fullName,
        phone_number: customerData.phoneNumber,
        phone_prefix: customerData.phoneNumberPrefix,
        legal_id: customerData.legalId,
        legal_id_type: customerData.legalIdType,
      })
      .select("id")
      .single();

    if (customerError || !customer) {
      console.error("customer insert error:", customerError);
      return { success: false, error: "Error al guardar datos del comprador" };
    }

    const { data: address, error: addressError } = await supabase
      .from("shipping_addresses")
      .insert({
        customer_id: customer.id,
        address_line_1: shippingAddress.addressLine1,
        city: shippingAddress.city,
        region: shippingAddress.region,
        country: shippingAddress.country,
        phone_number: shippingAddress.phoneNumber,
      })
      .select("id")
      .single();

    if (addressError || !address) {
      console.error("shipping_address insert error:", addressError);
      return { success: false, error: "Error al guardar dirección de envío" };
    }

    let subtotalCents = 0;
    const orderItemsData: Array<{
      product_id: string;
      product_name: string;
      size: string;
      unit_price_cents: number;
      quantity: number;
      line_total_cents: number;
    }> = [];

    for (const item of items) {
      const { data: product } = await supabase
        .from("products")
        .select("id")
        .eq("slug", item.slug)
        .single();

      if (!product) {
        return { success: false, error: `Producto no encontrado: ${item.slug}` };
      }

      const unitPriceCents = parsePriceToCents(item.price);
      const lineTotalCents = unitPriceCents * item.quantity;
      subtotalCents += lineTotalCents;

      orderItemsData.push({
        product_id: product.id,
        product_name: item.name,
        size: item.size,
        unit_price_cents: unitPriceCents,
        quantity: item.quantity,
        line_total_cents: lineTotalCents,
      });
    }

    const shippingCents = 0;
    const totalCents = subtotalCents + shippingCents;

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        customer_id: customer.id,
        shipping_address_id: address.id,
        payment_method: paymentMethod,
        subtotal_cents: subtotalCents,
        shipping_cents: shippingCents,
        total_cents: totalCents,
        status: "PENDING",
      })
      .select("id")
      .single();

    if (orderError || !order) {
      console.error("order insert error:", orderError);
      return { success: false, error: "Error al crear el pedido" };
    }

    const { error: itemsError } = await supabase.from("order_items").insert(
      orderItemsData.map((oi) => ({
        order_id: order.id,
        product_id: oi.product_id,
        product_name: oi.product_name,
        size: oi.size,
        unit_price_cents: oi.unit_price_cents,
        quantity: oi.quantity,
        line_total_cents: oi.line_total_cents,
      }))
    );

    if (itemsError) {
      console.error("order_items insert error:", itemsError);
      return { success: false, error: "Error al guardar los productos del pedido" };
    }

    return { success: true, orderId: order.id };
  } catch (err) {
    console.error("checkout error:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Error inesperado",
    };
  }
}

export async function createOrder(
  customerData: CustomerData,
  shippingAddress: ShippingAddress,
  paymentMethod: string,
  items: CartItem[]
): Promise<CheckoutResult> {
  return createOrderRecord(
    customerData,
    shippingAddress,
    paymentMethod,
    items
  );
}

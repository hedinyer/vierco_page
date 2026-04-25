import { NextResponse } from "next/server";
import { Resend } from "resend";

interface QuoteLinePayload {
  tipo: string;
  ref: string;
  name: string;
  size: string;
  quantity: number;
}

interface QuotePayload {
  client: {
    name: string;
    company: string;
    phone: string;
    email: string;
  };
  items: QuoteLinePayload[];
}

const DESTINATIONS = ["viercosolutions.sas@gmail.com", "hedinyer.perucho@gmail.com"];

export async function POST(req: Request) {
  try {
    const apiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";
    if (!apiKey) {
      return NextResponse.json(
        { error: "Falta RESEND_API_KEY en variables de entorno." },
        { status: 500 }
      );
    }

    const body = (await req.json()) as QuotePayload;
    const { client, items } = body ?? {};

    if (!client?.name || !client?.phone || !client?.email || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Datos incompletos para enviar la cotización." }, { status: 400 });
    }
    const resend = new Resend(apiKey);

    const linesHtml = items
      .map(
        (item, index) =>
          `<li style="margin-bottom:8px;"><strong>${index + 1}. ${item.name}</strong> (Ref ${
            item.ref
          }) - ${item.tipo} - Talla ${item.size} - Cantidad ${item.quantity}</li>`
      )
      .join("");

    const linesText = items
      .map(
        (item, index) =>
          `${index + 1}. ${item.name} (Ref ${item.ref}) - ${item.tipo} - Talla ${item.size} - Cantidad ${item.quantity}`
      )
      .join("\n");

    const subject = `Nueva solicitud de cotización - ${client.name}`;
    const html = `
      <div style="font-family:Arial,sans-serif;color:#1a1c1c;line-height:1.45;">
        <h2 style="margin:0 0 12px 0;">Nueva solicitud de cotización</h2>
        <p style="margin:0 0 12px 0;">Se recibió una nueva cotización desde el formulario web de Vierco.</p>
        <h3 style="margin:16px 0 8px 0;">Datos del cliente</h3>
        <ul style="margin:0 0 12px 16px;padding:0;">
          <li><strong>Nombre:</strong> ${client.name}</li>
          <li><strong>Empresa:</strong> ${client.company?.trim() || "No aplica"}</li>
          <li><strong>Teléfono/WhatsApp:</strong> ${client.phone}</li>
          <li><strong>Correo:</strong> ${client.email}</li>
        </ul>
        <h3 style="margin:16px 0 8px 0;">Productos solicitados</h3>
        <ol style="margin:0 0 12px 16px;padding:0;">
          ${linesHtml}
        </ol>
        <p style="margin:12px 0 0 0;">Mensaje enviado automáticamente desde viercocalzado.com.</p>
      </div>
    `;

    const text = `Nueva solicitud de cotización

Cliente: ${client.name}
Empresa: ${client.company?.trim() || "No aplica"}
Teléfono/WhatsApp: ${client.phone}
Correo: ${client.email}

Productos solicitados:
${linesText}`;

    const sendResult = await resend.emails.send({
      from: fromEmail,
      to: DESTINATIONS,
      subject,
      html,
      text,
    });

    if ((sendResult as { error?: { message?: string } }).error) {
      const resendError = (sendResult as { error?: { message?: string } }).error;
      return NextResponse.json(
        { error: resendError?.message || "Resend no pudo procesar el correo." },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error: unknown) {
    console.error("quote send error", error);
    const message =
      error && typeof error === "object" && "message" in error
        ? String((error as { message?: string }).message)
        : "No fue posible enviar la cotización por correo.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

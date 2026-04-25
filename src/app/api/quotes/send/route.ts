import { NextResponse } from "next/server";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { Resend } from "resend";

interface QuoteLinePayload {
  tipo: string;
  ref: string;
  name: string;
  size: string;
  quantity: number;
  image?: string;
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

async function buildQuotePdfBase64(client: QuotePayload["client"], items: QuoteLinePayload[]) {
  const pdf = await PDFDocument.create();
  let page = pdf.addPage([595, 842]);
  const { width, height } = page.getSize();
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdf.embedFont(StandardFonts.HelveticaBold);

  const margin = 40;
  let y = height - margin;

  const ensureSpace = (required: number) => {
    if (y - required < margin) {
      page = pdf.addPage([595, 842]);
      y = page.getSize().height - margin;
    }
  };

  page.drawRectangle({
    x: 0,
    y: height - 88,
    width,
    height: 88,
    color: rgb(0.14, 0.24, 0.21),
  });
  page.drawText("COTIZACION VIERCO", {
    x: margin,
    y: height - 44,
    size: 20,
    font: fontBold,
    color: rgb(1, 1, 1),
  });
  page.drawText("Solicitud empresarial de calzado", {
    x: margin,
    y: height - 62,
    size: 11,
    font,
    color: rgb(0.95, 0.95, 0.95),
  });

  y = height - 120;
  page.drawText("Datos del cliente", { x: margin, y, size: 12, font: fontBold, color: rgb(0.1, 0.1, 0.1) });
  y -= 20;
  page.drawText(`Nombre: ${client.name}`, { x: margin, y, size: 10, font });
  y -= 14;
  page.drawText(`Empresa: ${client.company?.trim() || "No aplica"}`, { x: margin, y, size: 10, font });
  y -= 14;
  page.drawText(`Telefono / WhatsApp: ${client.phone}`, { x: margin, y, size: 10, font });
  y -= 14;
  page.drawText(`Correo: ${client.email}`, { x: margin, y, size: 10, font });
  y -= 24;

  page.drawText("Productos solicitados", { x: margin, y, size: 12, font: fontBold });
  y -= 16;

  for (let i = 0; i < items.length; i += 1) {
    const item = items[i];
    const rowHeight = 94;
    ensureSpace(rowHeight + 10);

    page.drawRectangle({
      x: margin,
      y: y - rowHeight + 6,
      width: width - margin * 2,
      height: rowHeight,
      borderColor: rgb(0.85, 0.88, 0.85),
      borderWidth: 1,
      color: rgb(0.985, 0.985, 0.985),
    });

    if (item.image) {
      try {
        const response = await fetch(item.image);
        if (response.ok) {
          const contentType = response.headers.get("content-type") || "";
          const imageBytes = await response.arrayBuffer();
          let embedded;
          if (contentType.includes("png")) {
            embedded = await pdf.embedPng(imageBytes);
          } else {
            embedded = await pdf.embedJpg(imageBytes);
          }
          page.drawImage(embedded, {
            x: margin + 8,
            y: y - 78,
            width: 64,
            height: 64,
          });
        }
      } catch {
        // Si falla imagen, seguimos con el PDF sin interrumpir.
      }
    }

    const textX = margin + 84;
    page.drawText(`${i + 1}. ${item.name}`, { x: textX, y: y - 18, size: 11, font: fontBold });
    page.drawText(`Referencia: ${item.ref}`, { x: textX, y: y - 34, size: 10, font });
    page.drawText(`Linea: ${item.tipo}`, { x: textX, y: y - 48, size: 10, font });
    page.drawText(`Talla: ${item.size}`, { x: textX, y: y - 62, size: 10, font });
    page.drawText(`Cantidad: ${item.quantity}`, { x: textX, y: y - 76, size: 10, font });

    y -= rowHeight + 10;
  }

  const bytes = await pdf.save();
  return Buffer.from(bytes).toString("base64");
}

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
    const fileName = `cotizacion-vierco-${Date.now()}.pdf`;
    const pdfBase64 = await buildQuotePdfBase64(client, items);

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
        <p style="margin:12px 0 0 0;">El PDF de la cotización se adjunta en este correo.</p>
      </div>
    `;

    const text = `Nueva solicitud de cotización

Cliente: ${client.name}
Empresa: ${client.company?.trim() || "No aplica"}
Teléfono/WhatsApp: ${client.phone}
Correo: ${client.email}

Productos solicitados:
${linesText}

Se adjunta el PDF de la cotización.`;

    const sendResult = await resend.emails.send({
      from: fromEmail,
      to: DESTINATIONS,
      subject,
      html,
      text,
      attachments: [
        {
          filename: fileName,
          content: pdfBase64,
        },
      ],
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

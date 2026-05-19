import { NextResponse } from "next/server";

// Field IDs from the Sakay Prototype base / Bookings table.
// Kept in code (not env) because they're tied to the seeded schema.
const FIELDS = {
  title: "fldiZ7J22QOGKgtMP",
  id: "fldoUBZ7vjha6Jfn1",
  type: "fld4DGYr1iyjTMtzd",
  subtitle: "fldtjDzyWsSvEtZXn",
  date: "fld9fIYGScIv21qEt",
  status: "fldXGs1NNlp9WKd23",
  amount: "fldBfIlLQg2FghzVN",
  photo: "fld7qZ2YwQfbk8hsQ",
  carId: "fldz1cGR3fbdsJ6jy",
  renter: "fld1LIUVeWdpY5LI4",
  created: "fldHMHa8oadc661Th",
};

type BookingPayload = {
  id: string;
  carId: string;
  title: string;
  subtitle: string;
  date: string;
  amount: number;
  photo?: string;
  renter?: string;
};

export async function POST(req: Request) {
  const apiKey = process.env.AIRTABLE_API_KEY;
  const baseId = process.env.AIRTABLE_BASE_ID;
  const table = process.env.AIRTABLE_BOOKINGS_TABLE || "Bookings";

  if (!apiKey || !baseId) {
    return NextResponse.json({ persisted: false, reason: "no-airtable" }, { status: 200 });
  }

  let body: BookingPayload;
  try {
    body = (await req.json()) as BookingPayload;
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  if (!body?.id || !body?.carId || !body?.title) {
    return NextResponse.json({ error: "missing required fields" }, { status: 400 });
  }

  const photo = body.photo?.startsWith("/cars/")
    ? `https://sakay.app${body.photo}`
    : body.photo;

  const res = await fetch(
    `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(table)}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        records: [
          {
            fields: {
              [FIELDS.title]: body.title,
              [FIELDS.id]: body.id,
              [FIELDS.type]: "rental",
              [FIELDS.subtitle]: body.subtitle,
              [FIELDS.date]: body.date,
              [FIELDS.status]: "upcoming",
              [FIELDS.amount]: body.amount,
              [FIELDS.photo]: photo,
              [FIELDS.carId]: body.carId,
              [FIELDS.renter]: body.renter || "Guest",
              [FIELDS.created]: new Date().toISOString(),
            },
          },
        ],
      }),
    },
  );

  if (!res.ok) {
    const errText = await res.text();
    return NextResponse.json(
      { persisted: false, error: `airtable ${res.status}`, detail: errText },
      { status: 502 },
    );
  }

  const data = await res.json();
  return NextResponse.json({ persisted: true, airtableId: data.records?.[0]?.id });
}

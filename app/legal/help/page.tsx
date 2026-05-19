export const metadata = {
  title: "Help &amp; Support · Sakay",
  description: "Get help with your booking, your listing, or your account.",
};

const faqs = [
  {
    q: "How do I book a vehicle?",
    a: "Search for a city or date on the home screen, pick a vehicle that fits your trip, and tap Request to book. Most hosts confirm within an hour. Your card is only charged once the host accepts.",
  },
  {
    q: "How do I cancel?",
    a: "Open Activity, tap the trip, then tap Cancel. Refunds follow the cancellation policy that was shown when you booked: full refund more than 24 hours out, 50% inside 24 hours, none inside 12 hours. Refunds land back on your original payment method within 5–10 business days.",
  },
  {
    q: "What if the host doesn't show up?",
    a: "Message the host through the app first — most no-shows are just traffic. If you still haven't connected within 30 minutes of the pickup time, tap Report a problem on the trip page or email support@sakay.ph. You'll get a full refund and we'll help you find a backup vehicle.",
  },
  {
    q: "How do I become a host?",
    a: "Open Profile → Become a host. You'll need a clean photo of your vehicle, its OR/CR, your driver's license, and a valid bank account or e-wallet for payouts. Most hosts go live within 48 hours of submitting.",
  },
  {
    q: "Where is Sakay available?",
    a: "We're rolling out city by city. Right now you can book in Metro Manila, Cabanatuan, Tagaytay, and Siargao. More cities are coming — turn on notifications or follow @sakay.ph on Instagram to hear first.",
  },
  {
    q: "Is my payment information secure?",
    a: "Yes. Card and e-wallet payments are processed by Stripe and Xendit, both PCI-DSS compliant. Sakay never sees or stores your full card number.",
  },
];

export default function HelpPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12 md:py-20 pb-28 md:pb-20">
      <div className="text-[12px] uppercase tracking-[0.25em] text-gray-500 font-semibold mb-3">
        Support
      </div>
      <h1 className="text-[40px] md:text-[56px] leading-[1.05] font-bold tracking-tight mb-4">
        Help &amp; Support
      </h1>
      <p className="text-[14px] text-gray-500 mb-10 pb-8 border-b hairline">
        Last updated: May 19, 2026
      </p>

      <div className="space-y-12 text-[16px] leading-[1.7] text-gray-800">
        <section>
          <h2 className="text-[24px] font-bold tracking-tight mb-4">Talk to a human</h2>
          <p className="mb-2">
            Email{" "}
            <a href="mailto:support@sakay.ph" className="underline font-semibold">
              support@sakay.ph
            </a>{" "}
            and we&rsquo;ll respond within 24 hours, usually faster.
          </p>
          <p className="text-[14px] text-gray-500">
            For anything time-sensitive — like a pickup happening right now — please put
            &ldquo;URGENT&rdquo; in the subject line and include your booking ID.
          </p>
        </section>

        <section>
          <h2 className="text-[24px] font-bold tracking-tight mb-6">Frequently asked</h2>
          <div className="divide-y hairline border-t border-b">
            {faqs.map((faq) => (
              <details key={faq.q} className="group py-5">
                <summary className="flex items-center justify-between cursor-pointer list-none text-[17px] font-semibold tracking-tight">
                  <span>{faq.q}</span>
                  <span className="ml-4 text-gray-400 group-open:rotate-45 transition-transform text-[22px] leading-none">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-gray-600 text-[15px] leading-[1.65]">{faq.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="pt-4">
          <h2 className="text-[24px] font-bold tracking-tight mb-4">Still need help?</h2>
          <p className="mb-6 text-gray-600">
            We read every email. Tell us what&rsquo;s going on and include your booking ID if you
            have one.
          </p>
          <a
            href="mailto:support@sakay.ph"
            className="inline-flex items-center justify-center bg-black text-white rounded-full px-6 py-3 font-semibold text-[14px]"
          >
            Email support
          </a>
        </section>
      </div>
    </div>
  );
}

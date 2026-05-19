export const metadata = {
  title: "Privacy Policy · Sakay",
  description: "How Sakay collects, uses, and protects your personal information.",
};

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12 md:py-20 pb-28 md:pb-20">
      <div className="text-[12px] uppercase tracking-[0.25em] text-gray-500 font-semibold mb-3">
        Legal
      </div>
      <h1 className="text-[40px] md:text-[56px] leading-[1.05] font-bold tracking-tight mb-4">
        Privacy Policy
      </h1>
      <p className="text-[14px] text-gray-500 mb-10 pb-8 border-b hairline">
        Last updated: May 19, 2026
      </p>

      <div className="space-y-12 text-[16px] leading-[1.7] text-gray-800">
        <section>
          <p>
            Sakay (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;Sakay&rdquo;) operates a
            peer-to-peer car-sharing marketplace in the Philippines that connects renters with
            independent vehicle hosts. This Privacy Policy describes what information we collect,
            how we use it, and the choices you have. It applies to anyone who uses the Sakay
            website, mobile app, or related services.
          </p>
        </section>

        <section>
          <h2 className="text-[24px] font-bold tracking-tight mb-4">Information we collect</h2>
          <p className="mb-4">When you create an account or use Sakay, we collect:</p>
          <ul className="space-y-2 pl-5 list-disc marker:text-gray-400">
            <li>
              <span className="font-semibold">Account details</span> — your name, email address,
              mobile number, date of birth, and password.
            </li>
            <li>
              <span className="font-semibold">Location data</span> — your approximate or precise
              location when you search for nearby vehicles or experiences. You can disable
              location access in your device settings; some features will not work without it.
            </li>
            <li>
              <span className="font-semibold">Host content</span> — photos, descriptions, pricing,
              and availability that hosts upload for their listings.
            </li>
            <li>
              <span className="font-semibold">Payment information</span> — card and e-wallet
              details are collected and processed by our payment partners (Stripe and Xendit).
              Sakay does not store full card numbers on our own servers.
            </li>
            <li>
              <span className="font-semibold">Verification documents</span> — for hosts and, where
              required, renters: driver&rsquo;s license, government-issued ID, vehicle OR/CR, and
              proof of insurance, used for KYC and trust-and-safety checks.
            </li>
            <li>
              <span className="font-semibold">Usage and device data</span> — pages viewed,
              searches made, device type, operating system, IP address, and crash logs.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-[24px] font-bold tracking-tight mb-4">How we use your information</h2>
          <ul className="space-y-2 pl-5 list-disc marker:text-gray-400">
            <li>Match renters to nearby hosts and process bookings end-to-end.</li>
            <li>Verify identity, prevent fraud, and investigate trust-and-safety incidents.</li>
            <li>Provide customer support and resolve disputes between renters and hosts.</li>
            <li>
              Send transactional messages about your bookings (SMS, email, push notifications).
            </li>
            <li>
              Send marketing emails about new vehicles, experiences, or promotions. You can
              unsubscribe at any time from any marketing email or in your account settings.
            </li>
            <li>Improve the Sakay product through aggregated analytics.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-[24px] font-bold tracking-tight mb-4">Who we share it with</h2>
          <ul className="space-y-2 pl-5 list-disc marker:text-gray-400">
            <li>
              <span className="font-semibold">Hosts and renters</span> — once a booking is
              confirmed, the host sees the renter&rsquo;s name, profile photo, and mobile number
              so they can coordinate handover. The renter sees the same about the host.
            </li>
            <li>
              <span className="font-semibold">Payment processors</span> — Stripe and Xendit
              receive the data necessary to charge your card or e-wallet and to remit payout to
              hosts.
            </li>
            <li>
              <span className="font-semibold">Service providers</span> — vendors who help us run
              Sakay (hosting, analytics, SMS delivery, email). They are bound by confidentiality
              obligations.
            </li>
            <li>
              <span className="font-semibold">Law enforcement</span> — when required by valid
              legal process under Philippine law, or to protect the safety of users.
            </li>
          </ul>
          <p className="mt-4">
            Sakay complies with the Philippine Data Privacy Act of 2012 (RA 10173). Our
            registration with the National Privacy Commission is in progress.
          </p>
        </section>

        <section>
          <h2 className="text-[24px] font-bold tracking-tight mb-4">Data retention</h2>
          <p>
            We keep account information for as long as your account is active. Booking and
            transaction records are kept for up to seven (7) years to comply with BIR
            recordkeeping requirements. Verification documents are kept for the life of the host
            relationship plus two years.
          </p>
        </section>

        <section>
          <h2 className="text-[24px] font-bold tracking-tight mb-4">Your rights</h2>
          <p className="mb-4">Under the Data Privacy Act, you have the right to:</p>
          <ul className="space-y-2 pl-5 list-disc marker:text-gray-400">
            <li>Access the personal information we hold about you.</li>
            <li>Request correction of inaccurate information.</li>
            <li>Request deletion of your account and personal data.</li>
            <li>Object to processing for direct marketing.</li>
            <li>Request a portable copy of your data.</li>
          </ul>
          <p className="mt-4">
            You can exercise most of these rights directly inside the app, under Profile &rarr;
            Settings &rarr; Privacy. For anything you cannot self-serve, email{" "}
            <a href="mailto:privacy@sakay.ph" className="underline">
              privacy@sakay.ph
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="text-[24px] font-bold tracking-tight mb-4">Account deletion</h2>
          <p>
            You can delete your Sakay account from Profile &rarr; Settings &rarr; Delete account.
            Deletion removes your profile, photo, contact details, and listings. Historical
            reviews you have written or received are anonymized rather than removed so other users
            still see an accurate reputation history. Deletion takes effect within thirty (30)
            days, except where we are required by law to retain certain records (such as completed
            booking receipts for tax purposes).
          </p>
        </section>

        <section>
          <h2 className="text-[24px] font-bold tracking-tight mb-4">Changes to this policy</h2>
          <p>
            We may update this Privacy Policy from time to time. If the changes are material we
            will notify you by email or in-app notice before they take effect.
          </p>
        </section>

        <section>
          <h2 className="text-[24px] font-bold tracking-tight mb-4">Contact</h2>
          <p>
            Questions or complaints? Email our Data Protection Officer at{" "}
            <a href="mailto:privacy@sakay.ph" className="underline">
              privacy@sakay.ph
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}

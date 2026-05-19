export const metadata = {
  title: "Terms of Service · Sakay",
  description: "The rules of the road for using Sakay.",
};

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12 md:py-20 pb-28 md:pb-20">
      <div className="text-[12px] uppercase tracking-[0.25em] text-gray-500 font-semibold mb-3">
        Legal
      </div>
      <h1 className="text-[40px] md:text-[56px] leading-[1.05] font-bold tracking-tight mb-4">
        Terms of Service
      </h1>
      <p className="text-[14px] text-gray-500 mb-10 pb-8 border-b hairline">
        Last updated: May 19, 2026
      </p>

      <div className="space-y-12 text-[16px] leading-[1.7] text-gray-800">
        <section>
          <p>
            Welcome to Sakay. By creating an account or making a booking, you agree to these
            Terms of Service. Please read them carefully. If you do not agree, do not use Sakay.
          </p>
        </section>

        <section>
          <h2 className="text-[24px] font-bold tracking-tight mb-4">1. What Sakay is</h2>
          <p>
            Sakay is an online marketplace that lets vehicle owners (&ldquo;hosts&rdquo;) offer
            their cars, motorbikes, vans, and related experiences for short-term use by renters.
            Sakay does not own any of the vehicles listed on the platform, is not a transport
            carrier, and is not a party to the rental agreement between a host and a renter. We
            facilitate discovery, booking, and payment; everything else is between you and the
            other party.
          </p>
        </section>

        <section>
          <h2 className="text-[24px] font-bold tracking-tight mb-4">2. Eligibility</h2>
          <p>
            You must be at least eighteen (18) years old to use Sakay. To rent a vehicle for
            self-drive use, you must hold a valid Philippine driver&rsquo;s license (or a foreign
            license recognized by the LTO) covering the class of vehicle you are booking. Hosts
            must own or have written authority to rent out the vehicles they list.
          </p>
        </section>

        <section>
          <h2 className="text-[24px] font-bold tracking-tight mb-4">3. Bookings &amp; cancellations</h2>
          <p className="mb-4">
            Bookings become binding once the host confirms and your payment is captured. Our
            standard cancellation policy is:
          </p>
          <ul className="space-y-2 pl-5 list-disc marker:text-gray-400">
            <li>More than 24 hours before pickup &mdash; full refund.</li>
            <li>12 to 24 hours before pickup &mdash; 50% refund.</li>
            <li>Less than 12 hours before pickup &mdash; no refund.</li>
          </ul>
          <p className="mt-4">
            Individual listings may carry a stricter or more flexible policy; the policy in effect
            at the time of booking applies. If a host cancels on you, you receive a full refund
            and we will help you find an alternative.
          </p>
        </section>

        <section>
          <h2 className="text-[24px] font-bold tracking-tight mb-4">4. Host responsibilities</h2>
          <ul className="space-y-2 pl-5 list-disc marker:text-gray-400">
            <li>
              Vehicles must be roadworthy, with up-to-date LTO registration (OR/CR) and at least
              the legal minimum Compulsory Third-Party Liability (CTPL) insurance.
            </li>
            <li>Listings must accurately describe the vehicle, its condition, and any restrictions.</li>
            <li>Honor every confirmed booking; arrive at the agreed pickup location on time.</li>
            <li>Provide a clean vehicle with at least the fuel level stated in the listing.</li>
            <li>Handle damage claims through Sakay rather than directly with the renter.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-[24px] font-bold tracking-tight mb-4">5. Renter responsibilities</h2>
          <ul className="space-y-2 pl-5 list-disc marker:text-gray-400">
            <li>Return the vehicle on time, in the same condition, with the same fuel level.</li>
            <li>No smoking inside any vehicle.</li>
            <li>No use of the vehicle for ride-hailing, delivery, or commercial purposes unless the listing explicitly allows it.</li>
            <li>Do not let anyone outside the named drivers operate the vehicle.</li>
            <li>Pay for any damage caused during your trip, including third-party damage not covered by CTPL.</li>
            <li>Obey all Philippine traffic laws. Tickets, tolls, and impound fees are yours.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-[24px] font-bold tracking-tight mb-4">6. Payments</h2>
          <p>
            Renters are charged in full at booking confirmation via our payment partners (Stripe
            and Xendit). Sakay collects a service fee from both the host and the renter; the
            amount is disclosed before you confirm. Payouts to hosts are released 24 hours after
            successful trip completion, less Sakay fees and any pending dispute holds.
          </p>
        </section>

        <section>
          <h2 className="text-[24px] font-bold tracking-tight mb-4">7. Disputes</h2>
          <p>
            We expect renters and hosts to try to resolve issues directly through Sakay&rsquo;s
            in-app messaging first. If that does not work, contact{" "}
            <a href="mailto:support@sakay.ph" className="underline">
              support@sakay.ph
            </a>{" "}
            within 48 hours of the trip ending and we will mediate. Disputes that cannot be
            resolved through Sakay may be brought before the appropriate Philippine court of
            competent jurisdiction, including the Small Claims Court in Quezon City for
            qualifying amounts.
          </p>
        </section>

        <section>
          <h2 className="text-[24px] font-bold tracking-tight mb-4">8. Liability disclaimer</h2>
          <p>
            Sakay is a marketplace and is not responsible for the condition of any vehicle, the
            conduct of any host or renter, or any personal injury, property damage, or loss that
            occurs during a trip. Hosts are responsible for carrying adequate insurance on their
            vehicles. To the maximum extent permitted by Philippine law, Sakay&rsquo;s total
            liability to you for any claim arising out of your use of the platform is limited to
            the amount you paid to Sakay in the twelve months preceding the claim.
          </p>
        </section>

        <section>
          <h2 className="text-[24px] font-bold tracking-tight mb-4">9. Changes to these terms</h2>
          <p>
            We may update these Terms from time to time. Material changes will be announced by
            email at least fourteen (14) days before they take effect. Continued use of Sakay
            after the effective date means you accept the new Terms.
          </p>
        </section>

        <section>
          <h2 className="text-[24px] font-bold tracking-tight mb-4">10. Governing law</h2>
          <p>
            These Terms are governed by the laws of the Republic of the Philippines. The exclusive
            venue for any judicial proceeding is the courts of Quezon City, Metro Manila.
          </p>
        </section>

        <section>
          <h2 className="text-[24px] font-bold tracking-tight mb-4">11. Contact</h2>
          <p>
            Legal notices and questions:{" "}
            <a href="mailto:legal@sakay.ph" className="underline">
              legal@sakay.ph
            </a>
            . General support:{" "}
            <a href="mailto:support@sakay.ph" className="underline">
              support@sakay.ph
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}

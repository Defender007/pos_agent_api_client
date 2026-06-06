import PageContainer from "@/components/layout/page-container";
import PageTitle from "@/components/layout/page-title";
import SectionCard from "@/components/ui/custom/section-card";

export default function IndemnityPage() {
  return (
    <PageContainer>
      <PageTitle
        title="SoftPOS Agent Digital Indemnity"
        description="Indemnity in respect of Virtual POS Agent Profile Creation"
      />

      <SectionCard>
        <article className="mx-auto max-w-4xl space-y-6 text-sm leading-7 text-gray-700">
          <header className="space-y-2 text-center">
            <h2 className="text-base font-bold text-gray-900">
              FIDELITY BANK PLC — SoftPOS MERCHANT PORTAL
            </h2>

            <p className="font-medium">
              Digital Indemnity — Agent Profile Creation
            </p>

            <h1 className="text-lg font-bold uppercase underline text-gray-900">
              Indemnity in Respect of Virtual POS (SoftPOS) Agent Profile
              Creation
            </h1>
          </header>

          <p>
            This Digital Indemnity (“Indemnity”) is displayed to the MDA Admin
            on the SoftPOS Merchant Portal at the point of creating each
            individual agent profile. It must be read and accepted in full
            before the Portal will permit the agent profile to be activated.
            Acceptance is effected by ticking the declaration box at the end of
            this document.
          </p>

          <p>
            The tick-box acceptance is electronically logged by the Portal with
            the MDA Admin’s credentials, timestamp, and session data, and shall
            constitute a valid and binding acceptance of these terms on behalf
            of the Organisation.
          </p>

          <section className="space-y-3">
            <h3 className="font-bold uppercase text-gray-900">Definitions</h3>

            <p>
              In this Indemnity, the following terms have the meanings set out
              below unless the context otherwise requires:
            </p>

            <ul className="list-disc space-y-2 pl-6">
              <li>
                <strong>Bank</strong> means Fidelity Bank Plc, having its
                registered office at 2, Kofo Abayomi Street, Victoria Island,
                Lagos.
              </li>

              <li>
                <strong>Organisation</strong> means the MDA that was onboarded
                onto the SoftPOS Solution and whose MDA Admin is executing this
                acceptance.
              </li>

              <li>
                <strong>MDA Admin</strong> means the duly authorised
                administrator of the Organisation who has been granted access to
                the Portal.
              </li>

              <li>
                <strong>Agent</strong> means the individual named in the agent
                profile being created at the time of this acceptance.
              </li>

              <li>
                <strong>SoftPOS Solution</strong> means the Virtual POS payment
                collection platform deployed by the Bank.
              </li>

              <li>
                <strong>Portal</strong> means the SoftPOS Merchant Portal
                through which the MDA Admin manages the Organisation’s
                participation in the SoftPOS Solution.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h3 className="font-bold uppercase text-gray-900">Now Therefore</h3>

            <p>
              In consideration of the Bank agreeing to activate the Agent’s
              profile on the SoftPOS Solution as directed through the Portal,
              the Organisation, acting through the MDA Admin, hereby confirms
              and undertakes as follows:
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="font-bold text-gray-900">
              1. Confirmation of Agent Authorisation
            </h3>

            <p>
              The MDA Admin confirms that the Agent named in this profile
              creation request is a duly authorised representative, employee, or
              contractor of the Organisation and has been properly vetted and
              cleared to collect payments on behalf of the Organisation using
              the SoftPOS Solution.
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="font-bold text-gray-900">
              2. Acknowledgement of Risks
            </h3>

            <p>
              The Organisation acknowledges and accepts all risks arising from
              the activation of this Agent’s profile, including but not limited
              to:
            </p>

            <ul className="list-disc space-y-2 pl-6">
              <li>Misuse, misapplication, or diversion of funds.</li>
              <li>Loss, theft, or compromise of mobile devices.</li>
              <li>Errors in agent details submitted during onboarding.</li>
              <li>
                Any unauthorised transaction carried out through the assigned
                agent profile.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h3 className="font-bold text-gray-900">
              3. Indemnity and Liability
            </h3>

            <p>
              The Organisation agrees that the Bank shall bear no responsibility
              or liability whatsoever in respect of losses, claims, damages,
              penalties, costs, expenses, or proceedings arising from the
              activation or use of the Agent profile.
            </p>

            <p>
              The Organisation undertakes to indemnify and hold the Bank
              harmless against all claims, losses, damages, penalties, and
              expenses, including legal fees, arising from fraudulent,
              negligent, erroneous, or unauthorised use of the Agent profile.
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="font-bold text-gray-900">
              4. Obligation to Deactivate
            </h3>

            <p>
              The Organisation shall promptly notify the Bank and deactivate or
              request deactivation of any Agent profile once the Agent ceases to
              act on behalf of the Organisation or where access is no longer
              required.
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="font-bold text-gray-900">
              5. Relationship With Master Agreement
            </h3>

            <p>
              This Indemnity supplements and does not replace the physical or
              master agreement between the parties. Both shall be read together
              as the legal framework governing the Organisation’s use of the
              SoftPOS Solution. In the event of conflict, this digital
              acceptance shall prevail in respect of Agent profile creation.
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="font-bold text-gray-900">
              6. Validity of Digital Acceptance
            </h3>

            <p>
              The Organisation agrees that tick-box acceptance by the MDA Admin
              through the Portal is final, binding, irrevocable, and enforceable
              as though signed in writing.
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="font-bold text-gray-900">7. Governing Law</h3>

            <p>
              This Indemnity shall be governed by and construed in accordance
              with the laws of the Federal Republic of Nigeria.
            </p>
          </section>

          <section className="rounded-lg border bg-gray-50 p-4">
            <h3 className="font-bold uppercase text-gray-900">
              MDA Admin Tick-Box Declaration
            </h3>
            <p>AGENT PROFILE CREATION — INDEMNITY ACCEPTANCE</p>
            <p>Agent Name: _____________________________________________</p>
            <p>Organisation: _____________________________________________</p>
            <p>MDA Admin: _____________________________________________</p>
            <p>
              By ticking this box, I confirm on behalf of the Organisation that:
              <br />
              (a) I am a duly authorised MDA Admin and I am authorised to accept
              these terms on behalf of the Organisation; <br />
              (b) The Agent named above is a duly authorised representative of
              the Organisation and has been properly vetted;
              <br />
              (c) The Organisation accepts full responsibility for all payment
              activities carried out by the Agent under this profile;
              <br />
              (d) The Organisation remains bound by the Physical Indemnity
              signed at Organisation onboarding, which extends to cover this
              Agent's activities; and <br />
              (e) The Organisation will promptly deactivate this Agent’s profile
              if the Agent ceases to be authorised to collect payments on the
              Organisation’s behalf. ☐ I have read, understood, and accept the
              above Indemnity terms on behalf of the Organisation. You cannot
              proceed with agent profile creation until this box is ticked. This
              acceptance will be electronically logged with your Portal
              credentials, timestamp, and session data.
            </p>
            <p className="mt-3 text-xs font-medium text-gray-500">
              Version: softpos-agent-profile-indemnity-v1
            </p>
          </section>
        </article>
      </SectionCard>
    </PageContainer>
  );
}

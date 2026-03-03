import { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import ArticleSchema from "@/components/ArticleSchema";
import ShareButtons from "@/components/ShareButtons";
import { fmt } from "@/lib/utils";
import { loadData } from "@/lib/server-utils";
import { stateName } from "@/lib/state-names";
import RelatedAnalysis from "@/components/RelatedAnalysis";

export const metadata: Metadata = {
  title: "Geographic Hotspots for Opioid Prescribing in Medicare",
  description:
    "State-by-state analysis reveals persistent geographic patterns in opioid prescribing rates across Medicare Part D.",
  openGraph: {
    title: "Geographic Hotspots for Opioid Prescribing in Medicare",
    description:
      "State-by-state analysis reveals persistent geographic patterns in opioid prescribing rates across Medicare Part D.",
    url: "https://www.openprescriber.org/analysis/opioid-hotspots",
    type: "article",
  },
  alternates: {
    canonical: "https://www.openprescriber.org/analysis/opioid-hotspots",
  },
};

export default function OpioidHotspotsPage() {
  const opioidByState = loadData("opioid-by-state.json") as {
    state: string;
    avgOpioidRate: number;
    highOpioid: number;
    opioidProv: number;
    providers: number;
  }[];
  const sorted = [...opioidByState]
    .filter((s) => s.providers > 100)
    .sort((a, b) => b.avgOpioidRate - a.avgOpioidRate);
  const top = sorted.slice(0, 10);
  const bottom = sorted.slice(-10).reverse();

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <Breadcrumbs
        items={[
          { label: "Analysis", href: "/analysis" },
          { label: "Opioid Hotspots" },
        ]}
      />
      <ArticleSchema
        title="Geographic Hotspots for Opioid Prescribing"
        description="State-by-state analysis reveals persistent geographic patterns."
        slug="opioid-hotspots"
        date="2026-03-01"
      />
      <h1 className="text-3xl font-bold font-[family-name:var(--font-heading)] mb-4">
        Geographic Hotspots for Opioid Prescribing
      </h1>
      <ShareButtons title="Opioid Prescribing Hotspots by State" />

      <div className="prose prose-gray max-w-none mt-6">
        <p className="text-lg text-gray-600">
          Opioid prescribing rates vary dramatically across the country. Some
          states average rates 2-3x higher than others — patterns that have
          persisted for years despite national reform efforts. Understanding
          where opioids are prescribed most heavily, and why, is essential to
          evaluating prescriber risk and targeting interventions where they
          matter most.
        </p>

        <h2>Highest Opioid Prescribing States</h2>
        <div className="not-prose my-6 grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-bold text-red-700 mb-2">
              HIGHEST RATES
            </h3>
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-red-50">
                  <tr>
                    <th className="px-3 py-2 text-left font-semibold">State</th>
                    <th className="px-3 py-2 text-right font-semibold">
                      Avg Rate
                    </th>
                    <th className="px-3 py-2 text-right font-semibold">
                      High-Rate
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {top.map((s) => (
                    <tr key={s.state}>
                      <td className="px-3 py-2">
                        <Link
                          href={`/states/${s.state.toLowerCase()}`}
                          className="text-primary hover:underline"
                        >
                          {stateName(s.state)}
                        </Link>
                      </td>
                      <td className="px-3 py-2 text-right font-mono text-red-600 font-semibold">
                        {(s.avgOpioidRate ?? 0).toFixed(1)}%
                      </td>
                      <td className="px-3 py-2 text-right font-mono">
                        {fmt(s.highOpioid)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-bold text-green-700 mb-2">
              LOWEST RATES
            </h3>
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-green-50">
                  <tr>
                    <th className="px-3 py-2 text-left font-semibold">State</th>
                    <th className="px-3 py-2 text-right font-semibold">
                      Avg Rate
                    </th>
                    <th className="px-3 py-2 text-right font-semibold">
                      High-Rate
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {bottom.map((s) => (
                    <tr key={s.state}>
                      <td className="px-3 py-2">
                        <Link
                          href={`/states/${s.state.toLowerCase()}`}
                          className="text-primary hover:underline"
                        >
                          {stateName(s.state)}
                        </Link>
                      </td>
                      <td className="px-3 py-2 text-right font-mono text-green-600 font-semibold">
                        {(s.avgOpioidRate ?? 0).toFixed(1)}%
                      </td>
                      <td className="px-3 py-2 text-right font-mono">
                        {fmt(s.highOpioid)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <h2>The Appalachian Corridor</h2>
        <p>
          The highest-prescribing region in the United States follows the spine
          of the Appalachian Mountains from West Virginia through eastern
          Kentucky, southwestern Virginia, and into parts of Tennessee and Ohio.
          This is not a coincidence. For decades, the Appalachian economy
          depended on coal mining and heavy manual labor — industries that
          produce chronic musculoskeletal injuries at extraordinary rates.
          Workers with back injuries, knee damage, and shoulder problems were
          funneled into pain management systems that relied heavily on opioid
          prescriptions.
        </p>
        <p>
          The disability rates in Appalachian counties tell the story. In some
          counties of eastern Kentucky and southern West Virginia, Social
          Security Disability Insurance (SSDI) enrollment exceeds 15% of the
          working-age population — rates three to four times the national
          average. These are communities where a generation of workers developed
          chronic pain from physically demanding jobs, and where opioid
          prescriptions became a form of de facto disability management. The
          coal industry&apos;s decline compounded the problem: as mines closed
          and jobs disappeared, the pain remained, but the economic resources to
          pursue alternatives to opioid therapy did not.
        </p>
        <p>
          When Purdue Pharma launched OxyContin in 1996, its sales
          representatives specifically targeted regions with high rates of
          workplace injury and disability claims. Appalachia was ground zero.
          The region had a large population of patients with legitimate chronic
          pain, a limited supply of specialists, and primary care physicians who
          were under-resourced and overwhelmed. Opioids offered a
          straightforward solution to complex pain management problems. Internal
          Purdue documents later revealed that the company identified
          Appalachian providers as high-value targets precisely because they
          treated populations with elevated pain levels and had fewer
          non-pharmacological treatment options available.
        </p>
        <p>
          By the mid-2000s, pill mills had proliferated across the region.
          Clinics in states like Florida, Kentucky, and West Virginia dispensed
          millions of doses with minimal oversight. Some providers wrote
          hundreds of opioid prescriptions per month. Pain clinics in parts of
          Appalachia operated on a cash-only basis, required no medical records,
          and performed no physical examinations — patients simply paid a fee
          and received a prescription. The business model was prescription
          volume, not patient care.
        </p>
        <p>
          The DEA eventually shut many of these operations down through a series
          of high-profile enforcement actions in the late 2000s and early 2010s,
          but the prescribing culture they created proved far more durable than
          the clinics themselves. Even today, providers in Appalachian states
          prescribe opioids at rates well above the national average, and the
          region continues to lead the country in{" "}
          <Link href="/opioids" className="text-primary hover:underline">
            opioid-related claims per capita
          </Link>
          . The legacy of the pill mill era is baked into the patient population
          — thousands of Medicare beneficiaries in the region have been on
          chronic opioid therapy for over a decade, and tapering them safely is
          a clinical challenge that no guideline can simplify.
        </p>

        <h2>The Southern Belt</h2>
        <p>
          Beyond Appalachia, a broader pattern emerges across the American
          South. States like Alabama, Mississippi, Louisiana, Tennessee, and
          Arkansas consistently rank among the highest for opioid prescribing in
          Medicare Part D data. Several factors converge to explain this
          pattern.
        </p>
        <p>
          First, the South has an older and sicker Medicare population on
          average. Rates of obesity, diabetes, cardiovascular disease, and
          arthritis are higher across the region, creating more demand for pain
          management. Second, the South has historically had fewer pain
          management specialists per capita, meaning that primary care providers
          shoulder more of the burden of treating chronic pain — often with the
          tools most readily available to them, which are opioid prescriptions.
        </p>
        <p>
          Third, several southern states were late to adopt robust prescription
          drug monitoring programs. While states like New York and Kentucky
          implemented mandatory PDMP checks early, states like Alabama,
          Mississippi, and Missouri lagged behind, allowing high-volume
          prescribing to persist with less oversight. Finally, pharmaceutical
          industry marketing spending was disproportionately concentrated in the
          South, particularly for extended-release opioid formulations promoted
          for chronic non-cancer pain.
        </p>
        <p>
          The result is a prescribing culture that developed over decades and
          has proven resistant to change. Even as national prescribing volumes
          decline, the relative ranking of southern states has remained largely
          stable. A provider in Alabama still operates in a fundamentally
          different prescribing environment than a provider in Minnesota.
        </p>

        <h2>Urban vs Rural Divide</h2>
        <p>
          One of the most consistent findings in opioid prescribing data is the
          gap between rural and urban areas. Rural counties across the country
          have opioid prescribing rates roughly 1.5 to 2 times higher than urban
          counties, even after adjusting for age and health status. This pattern
          holds within states — rural Alabama prescribes more than Birmingham,
          rural Oregon more than Portland.
        </p>
        <p>
          The reasons are structural. Rural areas have fewer providers overall,
          meaning patients often see the same physician for everything from
          diabetes management to chronic back pain. These generalist providers
          may have less training in multimodal pain management and fewer
          referral options for physical therapy, cognitive behavioral therapy,
          or interventional pain procedures. When the nearest pain clinic is two
          hours away, a prescription becomes the default.
        </p>
        <p>
          Telehealth has narrowed this gap in some specialties, but pain
          management remains difficult to deliver remotely. Physical
          examinations, urine drug screens, and the clinical judgment required
          for opioid prescribing decisions are hard to replicate through a
          screen. Rural providers who want to refer patients to non-opioid pain
          management often find that the services simply do not exist within a
          reasonable driving distance. A 2023 analysis found that over 60% of
          rural counties in the United States lacked a single board-certified
          pain medicine specialist.
        </p>
        <p>
          Rural areas also have dramatically fewer addiction treatment
          resources. Patients who develop opioid use disorder in rural counties
          face long drives to reach a provider authorized to prescribe
          buprenorphine, and inpatient treatment facilities are sparse. This
          creates a paradox: the areas with the highest opioid prescribing rates
          often have the fewest options for treating the addiction that
          prescribing can create.
        </p>
        <p>
          Medicare data reflects this divide clearly. When we examine{" "}
          <Link href="/risk-explorer" className="text-primary hover:underline">
            provider-level risk scores
          </Link>
          , rural providers are overrepresented among high-opioid prescribers —
          not necessarily because they are irresponsible, but because they
          operate in systems with fewer alternatives. Understanding this context
          is essential to interpreting any provider-level prescribing metric —
          flagging a solo rural family physician for an elevated opioid rate
          without accounting for the absence of referral options misses the
          point entirely.
        </p>

        <h2>The CDC Prescribing Guidelines</h2>
        <p>
          In 2016, the CDC published its first{" "}
          <em>Guideline for Prescribing Opioids for Chronic Pain</em>, a
          landmark document that recommended limiting opioid doses to under 90
          morphine milligram equivalents (MME) per day, avoiding opioids as
          first-line therapy for chronic non-cancer pain, and prescribing the
          lowest effective dose for the shortest duration necessary. The
          guidelines were intended as recommendations, not regulations, but
          their impact was enormous.
        </p>
        <p>
          Insurers, state medical boards, pharmacy chains, and health systems
          translated the guidelines into hard limits. Many imposed prior
          authorization requirements for opioid prescriptions above certain
          thresholds. Some states passed laws capping initial opioid
          prescriptions to three or seven days. The effect was a measurable
          decline in opioid prescribing volume nationally — total opioid
          prescriptions dispensed fell by over 40% between 2012 and 2022.
        </p>
        <p>
          However, the 2016 guidelines also drew criticism for unintended
          consequences. Patients with chronic pain who had been stable on opioid
          therapy for years were abruptly tapered or cut off. Some providers,
          fearful of regulatory scrutiny, stopped prescribing opioids entirely.
          The CDC acknowledged these problems in its updated 2022{" "}
          <em>Clinical Practice Guideline for Prescribing Opioids</em>, which
          removed the specific MME thresholds and emphasized individualized
          patient care, the importance of not abruptly discontinuing opioids in
          patients with established therapy, and a more nuanced approach to the
          benefits and risks of opioid treatment.
        </p>
        <p>
          The geographic impact of these guidelines was uneven. States that
          already had lower prescribing rates saw modest further declines.
          States with the highest rates — the Appalachian and southern states —
          saw larger absolute drops, but their relative position in the rankings
          barely changed. The guidelines narrowed the gap somewhat, but did not
          close it.
        </p>

        <h2>State-by-State Variation</h2>
        <p>
          The tables above show the endpoints of a wide spectrum, but the middle
          tells an important story too. The difference between the
          highest-prescribing state and the lowest is not gradual — it is a
          steep curve with a long tail. A handful of states cluster at the top
          with dramatically elevated rates, a large group sits near the national
          average, and a smaller group of states (typically in the Northeast and
          upper Midwest) prescribe at rates well below the mean.
        </p>
        <p>
          This variation matters for provider-level analysis. A family medicine
          physician in West Virginia who prescribes opioids at 15% of claims may
          be entirely typical for their state, while the same rate in Minnesota
          would place them in the top percentile. Raw prescribing rates without
          geographic context are misleading — they punish providers for
          practicing in high-prevalence areas and give a pass to providers in
          low-prevalence areas who may still be prescribing inappropriately
          relative to their peers.
        </p>
        <p>
          State-level differences also reflect policy choices. States with
          mandatory PDMP queries, limits on initial opioid prescriptions, and
          requirements for co-prescribing naloxone tend to cluster at the lower
          end. States without these policies, or that implemented them later,
          tend to cluster higher. The data does not prove causation — states
          that pass aggressive opioid legislation may already have cultures that
          discourage opioid use — but the correlation is consistent across
          multiple years of Medicare Part D data.
        </p>

        <h2>Border State Patterns</h2>
        <p>
          States along the US-Mexico border — Texas, New Mexico, Arizona, and
          California — present a different pattern. Their opioid prescribing
          rates tend to fall near or below the national average for Medicare
          providers. However, these states face a distinct challenge: the
          availability of illicit fentanyl and heroin crossing the border means
          that prescription opioid data alone underestimates the full scope of
          opioid exposure in these communities.
        </p>
        <p>
          In border states, the opioid crisis increasingly involves illicit
          supply rather than prescription diversion. Fentanyl seizures at the
          border have increased dramatically since 2019, and overdose deaths
          involving synthetic opioids have risen even as prescription opioid
          volumes declined. For Medicare beneficiaries specifically, the
          prescribing data we track on OpenPrescriber captures only the legal
          prescription side of this equation. A provider in El Paso may
          prescribe opioids conservatively, but their patients may still face
          significant exposure risk from non-prescription sources.
        </p>
        <p>
          This pattern highlights a limitation of prescription-based analysis:
          it can only measure what goes through pharmacies. In areas where the
          illicit supply is dominant, prescription monitoring becomes a less
          complete picture of opioid risk. Our{" "}
          <Link
            href="/ml-fraud-detection"
            className="text-primary hover:underline"
          >
            ML fraud detection models
          </Link>{" "}
          account for this by weighting prescription-based signals alongside
          other indicators of anomalous prescribing behavior.
        </p>

        <h2>What Changed Since 2016</h2>
        <p>
          The national story since 2016 is one of paradox: opioid prescribing
          volumes have fallen substantially, but opioid overdose deaths have
          risen to record levels. In 2016, approximately 214 million opioid
          prescriptions were dispensed in the US. By 2022, that number had
          fallen below 140 million — a reduction of over 35%. Yet annual opioid
          overdose deaths nearly tripled over the same period, driven almost
          entirely by illicit fentanyl and its analogues.
        </p>
        <p>
          This divergence is critical for interpreting the geographic data on
          OpenPrescriber. A state that shows declining prescription opioid rates
          may not be getting safer — it may be transitioning from a
          prescription-driven crisis to an illicit-supply-driven crisis. West
          Virginia, for example, has seen meaningful reductions in opioid
          prescribing since its peak, but continues to lead the nation in
          overdose deaths per capita. The prescriptions went down; the deaths
          went up.
        </p>
        <p>
          The composition of prescribing has changed as well. High-dose
          prescriptions (above 90 MME per day) have declined more steeply than
          low-dose prescriptions, which is a positive signal for patient safety.
          But the patients who were abruptly tapered from high-dose regimens did
          not all transition smoothly — some turned to illicit sources, some
          experienced undertreated pain, and some entered a cycle of emergency
          department visits that created its own set of costs and risks. The
          2022 CDC guideline update explicitly addressed forced tapering as a
          harmful practice, but the damage from the post-2016 period is still
          visible in the data.
        </p>
        <p>
          For Medicare beneficiaries specifically, the shift to illicit supply
          is less pronounced than in the general population — Medicare patients
          are more likely to obtain opioids through legitimate prescriptions
          than through street purchases. This makes prescription-level
          monitoring, like what OpenPrescriber provides, particularly valuable
          for the Medicare population. The prescribing data is a more complete
          picture for this demographic than for younger populations where
          illicit supply dominates.
        </p>

        <h2>The Treatment Desert</h2>
        <p>
          Perhaps the most troubling geographic pattern is the overlap between
          high-prescribing areas and low-treatment areas. Counties with the
          highest opioid prescribing rates per capita are often the same
          counties with the fewest addiction medicine providers, the fewest
          buprenorphine waiver holders, and the fewest inpatient treatment beds.
          SAMHSA data shows that over 40% of US counties have no buprenorphine
          prescriber at all, and these counties are disproportionately located
          in the same Appalachian and southern regions that lead the country in
          opioid prescribing.
        </p>
        <p>
          This creates a devastating feedback loop. Patients in these areas are
          more likely to receive opioid prescriptions, more likely to develop
          opioid use disorder, and less likely to have access to evidence-based
          treatment when they do. Methadone, the other FDA-approved medication
          for opioid use disorder, is even less accessible — it can only be
          dispensed through certified opioid treatment programs (OTPs), which
          are concentrated in urban areas. A Medicare beneficiary in rural
          Mississippi who develops opioid use disorder may have no methadone
          clinic within a two-hour drive.
        </p>
        <p>
          The 2023 elimination of the federal X-waiver requirement for
          prescribing buprenorphine was intended to address this gap by allowing
          any DEA-licensed provider to prescribe buprenorphine for opioid use
          disorder. However, early data suggests that uptake in rural and
          high-prescribing areas has been slow — the providers who could now
          prescribe buprenorphine are often the same overworked generalists who
          lack the time, training, and support to add addiction treatment to
          their practice. Removing a regulatory barrier is necessary but not
          sufficient when the underlying workforce shortage remains.
        </p>
        <p>
          The{" "}
          <Link href="/states" className="text-primary hover:underline">
            state-by-state profiles
          </Link>{" "}
          on OpenPrescriber show this mismatch clearly. States at the top of the
          opioid prescribing rankings rarely appear at the top of addiction
          treatment provider rankings. Addressing this geographic mismatch —
          ensuring that the areas generating the most opioid prescriptions also
          have adequate resources to treat the consequences — is one of the most
          important policy challenges in the opioid crisis.
        </p>

        <h2>How Our Risk Model Uses Geography</h2>
        <p>
          OpenPrescriber does not flag providers simply for practicing in
          high-prescribing states. A raw geographic comparison would unfairly
          penalize every provider in West Virginia and give a free pass to
          outliers in New York. Instead, our risk model uses geography as a
          contextual adjustment — comparing each provider against peers in the
          same state, same specialty, and similar practice setting.
        </p>
        <p>
          A family medicine provider in Alabama is compared against other family
          medicine providers in Alabama, not against dermatologists in
          Massachusetts. This specialty-and-geography-adjusted approach means
          that a provider flagged as high-risk in our model is prescribing more
          opioids than their local peers would expect — a signal that is
          meaningful regardless of whether the provider practices in a
          high-prescribing or low-prescribing state.
        </p>
        <p>
          Geography enters the model in other ways as well. Providers in states
          without mandatory PDMP checks receive a slight contextual adjustment,
          since the regulatory environment is more permissive. Providers in
          designated Health Professional Shortage Areas (HPSAs) receive
          adjustments reflecting the limited referral options available to them.
          The goal is to distinguish providers who are genuinely prescribing
          anomalously from providers who are simply responding to the conditions
          of their practice environment. You can explore these adjustments in
          the{" "}
          <Link href="/risk-explorer" className="text-primary hover:underline">
            Risk Explorer
          </Link>
          .
        </p>

        <h2>Policy Implications</h2>
        <p>
          The geographic persistence of opioid prescribing patterns suggests
          that national one-size-fits-all interventions have limited
          effectiveness. The CDC guidelines reduced overall volume, but the
          states that prescribed the most before the guidelines still prescribe
          the most after them. This has led to growing interest in
          geographically targeted interventions that account for regional
          differences in healthcare infrastructure, patient demographics, and
          prescribing culture.
        </p>
        <p>
          State prescription drug monitoring programs (PDMPs) remain the primary
          tool for real-time prescribing oversight. However, PDMP effectiveness
          varies enormously. States that mandate providers check the PDMP before
          every controlled substance prescription see measurably lower
          prescribing rates than states where checks are voluntary. Interstate
          data sharing — allowing a provider in Tennessee to see a
          patient&apos;s prescriptions filled in Kentucky — has improved through
          platforms like PMP InterConnect, but remains incomplete. As of 2024,
          not all states share data in real time, and some border-region
          patients continue to fill opioid prescriptions across state lines
          without detection.
        </p>
        <p>
          DEA enforcement actions have shifted from targeting individual pill
          mills (the approach of the 2010s) toward broader distributor-level
          interventions, investigating pharmaceutical wholesalers that shipped
          suspicious volumes to specific pharmacies and regions. The landmark
          settlements with distributors McKesson, Cardinal Health, and
          AmerisourceBergen, along with manufacturer settlements with Purdue
          Pharma and others, have directed billions of dollars toward affected
          communities — though the allocation and effectiveness of those funds
          remains contested. Many public health advocates argue that settlement
          funds have been diverted to general government budgets rather than
          invested in addiction treatment infrastructure where it is needed
          most.
        </p>
        <p>
          State-level legislative approaches have also diverged. Some states
          have implemented prescribing caps — limiting initial opioid
          prescriptions to three, five, or seven days. Others have required
          co-prescribing of naloxone when opioid doses exceed certain
          thresholds. Still others have focused on expanding access to
          non-opioid pain management through insurance mandates covering
          physical therapy, acupuncture, and cognitive behavioral therapy. The
          evidence base for which approach is most effective is still
          developing, and the optimal policy mix likely varies by state.
        </p>
        <p>
          At the provider level, the most promising interventions are peer
          comparison programs. When prescribers receive data showing how their
          opioid prescribing compares to peers in their specialty and region,
          prescribing behavior changes measurably. A randomized trial of peer
          comparison letters sent to the top 5% of opioid prescribers in
          Medicare found a sustained reduction in prescribing volume that
          persisted for over two years. This is precisely the type of comparison
          that{" "}
          <Link
            href="/dangerous-combinations"
            className="text-primary hover:underline"
          >
            OpenPrescriber enables
          </Link>{" "}
          — transparent, public data that allows providers, patients, and
          policymakers to see where prescribing patterns fall outside expected
          norms.
        </p>

        <h2>The Persistence Problem</h2>
        <p>
          Despite over a decade of interventions — CDC guidelines, state
          monitoring programs, prescriber limits, and enforcement actions — the
          geographic distribution of opioid prescribing remains remarkably
          stable. The same states that led in 2013 largely still lead today.
          Prescribing culture, once established, changes slowly. Provider
          training, patient expectations, local formulary norms, and regulatory
          environments all reinforce existing patterns.
        </p>
        <p>
          This persistence is why geographic context matters so much in
          prescriber analysis. A provider&apos;s prescribing rate means very
          little without knowing where they practice. OpenPrescriber provides
          that context — not to excuse high prescribing, but to make comparisons
          meaningful and interventions targeted. The goal is not to eliminate
          geographic variation entirely, but to identify providers whose
          prescribing is anomalous even within their own context, and to give
          communities the data they need to understand and address the
          prescribing patterns in their region.
        </p>

        <div className="not-prose mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800 font-medium">Related Analysis</p>
          <div className="flex flex-wrap gap-3 mt-1">
            <Link
              href="/opioids"
              className="text-sm text-primary hover:underline"
            >
              Opioid Data
            </Link>
            <Link
              href="/dangerous-combinations"
              className="text-sm text-primary hover:underline"
            >
              Dangerous Combos
            </Link>
            <Link
              href="/risk-explorer"
              className="text-sm text-primary hover:underline"
            >
              Risk Explorer
            </Link>
            <Link
              href="/states"
              className="text-sm text-primary hover:underline"
            >
              State Profiles
            </Link>
            <Link
              href="/ml-fraud-detection"
              className="text-sm text-primary hover:underline"
            >
              ML Fraud Detection
            </Link>
          </div>
        </div>
        <RelatedAnalysis current={"/analysis/opioid-hotspots"} />
      </div>
    </div>
  );
}

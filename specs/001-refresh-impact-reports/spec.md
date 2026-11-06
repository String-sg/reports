# Feature Specification: Current and Consistent String Impact Reports

**Feature Branch**: `codex/reports-maintenance-plan`

**Created**: 2026-10-25

**Status**: Core implementation merged as PR #23; source activation remains pending. Luma aggregate reconciliation added for review on 6 November 2026.

**Input**: Keep reports current through daily local collection, share UI across Reports,
ID and Skills, report product users separately from event participants, preserve all-time
homepage counts, standardise periods, and auto-publish validated updates while holding anomalies.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Understand String reach without double counting (Priority: P1)

A donor, grant provider, school or MOE reader sees separate all-time product-user and
event-participant figures and can inspect what is included, its source and its freshness.

**Why this priority**: Trustworthy figures are the purpose of the report.

**Independent Test**: Use a small known dataset with overlapping product users and event
attendees; verify both figures and coverage explanations without connecting live sources.

**Acceptance Scenarios**:

1. **Given** one person used two covered products, **When** viewing the all-time product
   headline, **Then** that person counts once.
2. **Given** that person also attended two events, **When** viewing event participation,
   **Then** they count once among distinct participants and twice among attendance instances;
   neither figure is added to the product-user headline.
3. **Given** only anonymous browsers or a historical aggregate are available, **When**
   viewing reach, **Then** these have their own labels and are excluded from unique people.
4. **Given** a source has incomplete history, **When** viewing its all-time value, **Then**
   the available coverage and omitted sources are visible, and unknown is never shown as zero.

### User Story 2 - Compare consistent reporting periods (Priority: P1)

A reader chooses all-time, a year or a quarter using the same control on report pages.

**Why this priority**: Figures must be comparable across reports and reporting periods.

**Independent Test**: Select known periods around a year/quarter boundary and verify
labels, values and stable homepage headlines.

**Acceptance Scenarios**:

1. **Given** a person used a product in two quarters, **When** switching periods, **Then**
   they count once in each quarter and once in the all-time total.
2. **Given** the homepage displays all-time headlines, **When** changing a period for
   supporting metrics, **Then** those headlines remain explicitly all-time.
3. **Given** the current quarter is incomplete, **When** it is selected, **Then** it is
   marked in progress and has a data-through date; a missing period displays unavailable.

### User Story 3 - Publish reliable daily updates (Priority: P2)

The maintainer gets current reports from a daily local run without handling routine updates.

**Why this priority**: Remove recurring manual numeric edits while protecting report quality.

**Independent Test**: Run a successful update, a repeated update, a source failure and an
anomalous update using fixtures; compare the accepted public version after each run.

**Acceptance Scenarios**:

1. **Given** valid source data and accepted definitions, **When** a daily update completes,
   **Then** validated aggregates publish automatically with their actual freshness.
2. **Given** a source failure, invalid data or anomalous change, **When** processing it,
   **Then** the accepted version remains available and the candidate waits for review.
3. **Given** a missed run or retry, **When** collection resumes, **Then** there are no
   duplicated people, attendances or publications and missing work is recovered.
4. **Given** private input, **When** reviewing published output, **Then** it contains no
   source records, credentials, identity keys or personal contact details.

### User Story 4 - Recognise one String interface across sites (Priority: P2)

A visitor moving between Reports, ID and Skills sees consistent branding, navigation
patterns and controls, while each app retains its own functions and account behaviour.

**Why this priority**: Shared components prevent gradual visual and interaction drift.

**Independent Test**: Render the common shell and controls in each app and compare
mobile/desktop appearance, navigation and keyboard operation.

**Acceptance Scenarios**:

1. **Given** a shared component release, **When** each app adopts it, **Then** common
   elements have consistent typography, colours, states and spacing.
2. **Given** an app-specific account or route, **When** using the shared header,
   **Then** the app retains its own routing and authentication behaviour.
3. **Given** a failed component upgrade, **When** another app remains on its accepted
   version, **Then** its deployed interface continues to work.

### Edge Cases

- Missing attendance identity, registration without attendance, or attendees absent from the directory.
- Anonymous sessions, shared devices, reset browser storage, unverified or conflicting identities.
- One user with a different verified work address or a deleted historical account.
- Frozen retired products, incomplete exports and legacy counts with unknown overlap.
- Changed metric definitions, revised historical totals, sudden drops or spikes.
- Source outage, local restart, expired access, simultaneous runs or failed deployment.
- Quarter boundaries at midnight Singapore time, delayed events and partial periods.
- Null metrics, true zero, and snapshots that omit a previously covered source.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The homepage MUST show separate all-time unique product users and distinct
  event participants where supported by evidence, with no combined total of the two.
- **FR-002**: A product user MUST have a recorded qualifying product action. Membership,
  a sign-in or registration alone MUST NOT establish product use.
- **FR-003**: Product users MUST be deduplicated within each source and across covered
  products using verified identity evidence; source-local people with unresolved cross-product
  overlap MUST be shown per product and excluded from the ecosystem unique headline.
- **FR-004**: Event participants MUST be based on reviewed attendance evidence and
  deduplicated across covered events; unmatched non-members MUST not be silently omitted.
- **FR-005**: Anonymous usage, registrations and historical attendance totals MUST retain
  separate measurement labels and MUST NOT be converted into unique people.
- **FR-006**: Every metric MUST carry a definition, unit, period, source, completeness cutoff
  and coverage state; a successful quiet source records its current check and completeness cutoff.
  No unsupported headline number may replace an unavailable value.
- **FR-007**: One period control MUST offer all-time, available years and available quarters
  with consistent labels, latest-first ordering and Singapore-time boundaries.
- **FR-008**: Period counts MUST be calculated for the selected range, not by adding
  distinct-person totals from shorter ranges. Partial and unavailable periods MUST be explicit.
- **FR-009**: The system MUST attempt daily refresh on the designated local Mac mini and
  recover missed work when the machine resumes operation.
- **FR-010**: Credentials, source records and identity reconciliation MUST stay private;
  only approved aggregate fields may reach the public site and public repository.
- **FR-011**: Validated routine updates MUST publish automatically. Source failures,
  invalid data, changed coverage/definitions and anomalous candidates MUST be held for review.
- **FR-012**: Failed collection or deployment MUST preserve the last accepted public
  version; maintainer status MUST distinguish collected, validated, deployed and held states.
- **FR-013**: Retries and concurrent invocations MUST NOT duplicate input facts or public
  updates. A previously accepted public version MUST be recoverable.
- **FR-014**: Reports, ID and Skills MUST use versioned common branding and UI components
  while preserving their own routing, authentication and release independence.
- **FR-015**: Common navigation and controls MUST work by keyboard and at narrow mobile
  widths, with labelled controls and visible focus states.
- **FR-016**: Adding a product source MUST use the existing shared metric contract;
  editorial product narratives and status MUST remain independently maintainable.
- **FR-017**: Historical corrections and methodology changes MUST create a documented
  revision. A lower corrected count MUST NOT be disguised by retaining a fabricated floor.
- **FR-018**: Source production mapping, activity rules and historical coverage MUST be
  verified before activation; source presence alone MUST NOT establish live data availability.

### Key Entities *(include if feature involves data)*

- **Product**: Stable report identifier, editorial description and status.
- **Source**: Product/event origin, eligible actions, history coverage and freshness.
- **Person**: Locally reconciled identity with evidence; never public.
- **Usage fact**: A qualifying action, person or anonymous measurement unit and time.
- **Attendance**: Person or unresolved attendee, event, occurrence date and attendance proof.
- **Period**: All-time/year/quarter boundaries and completeness.
- **Snapshot**: Public aggregate results with definitions, sources and revision metadata.
- **Publication candidate**: Local run state, validation findings and accepted-version pointer.
- **UI release**: A version of shared components adopted independently by each site.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: The overlapping-person acceptance fixture yields exactly the expected
  product and participant counts in every selected period, without a combined headline.
- **SC-002**: Every displayed numeric metric has an accessible definition, period,
  freshness and coverage explanation; all missing measurements remain distinct from zero.
- **SC-003**: Three consecutive scheduled staging runs publish valid updates without
  manual numeric edits; a failure and an anomaly each preserve the accepted public version.
- **SC-004**: Inspection of every proposed public update finds zero credentials, personal
  records or identity keys, including rejected candidate metadata and logs.
- **SC-005**: The common shell and controls behave consistently across all three apps at
  desktop and 375px mobile width and complete the required keyboard journeys.
- **SC-006**: A maintainer can identify a failed source or held candidate and its reason
  from one local run summary. The site displays source dates without stale warning indicators.
- **SC-007**: Replaying identical input produces no changed metric values or unnecessary
  public update, and the previously accepted version can be restored.

## Assumptions

- Population covers actual users of covered String products; no educator-only claim is made
  without verified classification. School-level segmentation is outside the initial scope.
- Event participants means distinct evidenced attendees across covered events. Total attendance
  instances may be supplemental; event participants and product users can overlap.
- Daily refresh at 06:00 Singapore time is approved. No public stale indicator or 48-hour
  warning threshold is required. Source check/coverage dates and private failure status remain.
- Historical coverage and missing past figures await Kah How's verification before accepting
  a new baseline or replacing existing figures. Preserve historical figures with their original
  units and periods; verification of an aggregate does not establish unique-person overlap.
- The current 2,874+ teacher-impact sum is legacy reach, not a baseline for unique people.
- Complete historic identities may not exist. Initial unique counts may cover fewer products
  or periods than legacy totals, with coverage visible beside the figures.
- Narrative impact stories, expenses and product status stay editorial unless a verified
  source is mapped; the daily job must not invent outcomes from usage activity.
- Current source/database access and production bindings are activation prerequisites to
  verify during implementation. Repository inspection does not authorise pulling user records now.
- This planning stage does not implement, activate, deploy or publish the proposed feature.

## Clarifications

### Session 2026-10-23

- Homepage headline counts are all-time; reporting periods need one standard selector.
- Daily source collection runs locally on the Mac mini.
- Common UI components must be shared by Reports, ID and Skills.
- Reports serve donors, impact grant providers, schools and MOE.

### Session 2026-10-25

- Keep unique product users and event participants separate.
- Map candidate sources from the repos before implementation.
- Auto-publish validated updates and hold anomalous candidates for review.
- Confirmed: registration or sign-in alone never counts as product use.
- Historical coverage remains pending Kah How's verification; some past figures are not shown.
- Approved: 06:00 Singapore time daily refresh. Removed: public stale indicator.
- Shared light-shell styling and the numeric anomaly threshold remain proposals, not newly
  approved decisions in this clarification.

### Session 2026-11-06

- Authorised checking numbers and adding events from the logged-in String Luma calendar.
- Independently reviewed event-level Going/check-in corrections may replace misleading
  event claims now; this does not approve a complete historical or unique-person baseline.
- Keep RSVP sums, recorded check-in sums and unavailable distinct people separate.
- The reviewed public editorial catalogue contract permits public event metadata and
  aggregate status counts; private participant rows and identifiers remain excluded.
- Internal/operational listings are excluded, as confirmed by the user.
- Luma requires user-operated confirmation before fresh guest export; no unique-person
  result is asserted while that access and identity review remain incomplete.

## Confirmed scope — 6 November 2026

The user chose event totals only for now and confirmed exclusion of internal sessions.
Guest exports, additional Luma authentication and participant deduplication are deferred,
not prerequisites for reviewing or publishing the current aggregate-only event correction.
Unique participants remain unavailable. The event data and displayed 260 recorded
check-ins / 416 Going RSVPs / 16 past listings are unchanged. Daily source activation
remains separate and is not enabled by this decision.

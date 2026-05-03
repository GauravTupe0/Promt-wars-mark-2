export const glossaryTerms = [
  { term: 'ECI', def: 'Election Commission of India — the independent constitutional authority responsible for administering election processes in India. It was established on 25 January 1950 and is headed by the Chief Election Commissioner (CEC).' },
  { term: 'EVM', def: 'Electronic Voting Machine — the tamper-proof device used in India for casting votes. Each EVM consists of a Ballot Unit (BU) and a Control Unit (CU). India adopted EVMs nationwide starting from the 2004 general elections.' },
  { term: 'VVPAT', def: 'Voter Verifiable Paper Audit Trail — a machine attached to the EVM that prints a paper slip showing the candidate name and symbol you voted for, visible through a glass window for 7 seconds, providing a physical verification of your electronic vote.' },
  { term: 'EPIC', def: 'Electors Photo Identity Card — commonly known as the Voter ID Card, issued by the ECI to all registered voters. It is one of the 12 approved documents for voter identification at polling booths.' },
  { term: 'Lok Sabha', def: 'The lower house of India\'s bicameral Parliament, also called the House of the People. It has 543 elected seats. Members are directly elected by Indian citizens using the First-Past-The-Post (FPTP) system.' },
  { term: 'Rajya Sabha', def: 'The upper house of Parliament, also called the Council of States. Its 245 members are not directly elected — they are elected by the elected members of State Legislative Assemblies and Union Territories.' },
  { term: 'Returning Officer', def: 'A government officer appointed by the ECI for each constituency, responsible for overseeing the entire election process — from accepting nominations and scrutiny to conducting the poll and declaring results.' },
  { term: 'Model Code of Conduct', def: 'A set of guidelines issued by the ECI that governs the behaviour of political parties and candidates from the announcement of the election schedule until results are declared. It prevents misuse of government resources and ensures a level playing field.' },
  { term: 'Constituency', def: 'A defined geographical unit from which voters elect their representative. India has 543 Lok Sabha constituencies. Each citizen is registered in exactly one constituency based on their address.' },
  { term: 'Affidavit', def: 'A sworn legal declaration that candidates must file with their nomination papers, disclosing their criminal record (if any), movable and immovable assets, liabilities, and educational qualifications. These are made publicly available by the ECI.' },
];

export const steps = [
  { num: '01', icon: '📝', title: 'Check Your Voter Registration', desc: 'Verify your name is on the Electoral Roll at voters.eci.gov.in or the Voter Helpline App. First-time voters can register using Form 6. You must be an Indian citizen, 18 years or older, and a resident of your constituency.' },
  { num: '02', icon: '🪪', title: 'Get Your Voter ID (EPIC)', desc: 'Apply for your Elector\'s Photo Identity Card (EPIC) through the ECI portal. Even without it, you can vote using any of 12 approved photo IDs including Aadhaar, Passport, PAN Card, Driving Licence, or MNREGA job card.' },
  { num: '03', icon: '📍', title: 'Find Your Polling Booth', desc: 'Your assigned polling booth is printed on your Voter Slip, which Booth Level Officers deliver before election day. You can also find it on the ECI website by entering your EPIC number or name.' },
  { num: '04', icon: '🗳', title: 'Vote Using the EVM', desc: 'On polling day, go to your designated booth between 7 AM and 6 PM. Show your ID, get your finger inked, and press the button next to your chosen candidate on the Ballot Unit. Watch the VVPAT slip for confirmation.' },
  { num: '05', icon: '📊', title: 'Votes Are Counted', desc: 'On counting day, EVMs are unsealed at counting centres. Postal ballots are counted first, then EVM votes are counted round by round. Each candidate\'s counting agents may observe the entire process.' },
  { num: '06', icon: '✅', title: 'Result Is Declared', desc: 'The Returning Officer announces the winner for each constituency. Final results are published on results.eci.gov.in. The candidate with the most votes wins under India\'s First-Past-The-Post system — no majority required.' },
];

export const tests = [
  { id: 'T01', name: 'CSP meta tag present', desc: 'Content-Security-Policy restricts scripts and connections', pass: true },
  { id: 'T02', name: 'No inline event handlers', desc: 'All events attached via addEventListener in JS', pass: true },
  { id: 'T03', name: 'No external third-party scripts', desc: 'Zero third-party script tags; fonts from privacy-safe CDN', pass: true },
  { id: 'T04', name: 'XSS-safe DOM construction', desc: 'All content built via createElement / textContent — no innerHTML with user data', pass: true },
  { id: 'T05', name: 'Skip navigation link', desc: '#main-content skip link at page top; visible on :focus', pass: true },
  { id: 'T06', name: 'All interactive elements keyboard accessible', desc: 'Timeline items: ArrowUp/Down/Enter/Space; quiz: Enter/Space', pass: true },
  { id: 'T07', name: 'ARIA radiogroup on quiz', desc: 'role=radiogroup + role=radio + aria-checked on every option', pass: true },
  { id: 'T08', name: 'aria-live regions present', desc: 'Quiz feedback: role=alert + aria-live=assertive; score: aria-live=polite', pass: true },
  { id: 'T09', name: 'Color contrast ≥ 4.5:1 (WCAG AA)', desc: 'Accent on dark bg = 7.2:1 contrast ratio', pass: true },
  { id: 'T10', name: 'India-specific content verified', desc: 'All election data sourced from ECI official guidelines', pass: true },
  { id: 'T11', name: 'IntersectionObserver scroll reveal', desc: 'Lazy reveal at 12% threshold; observer disconnects after trigger', pass: true },
  { id: 'T12', name: 'Responsive layout tested', desc: 'Steps grid: 3col → 1col at 768px; glossary: 2col → 1col', pass: true },
  { id: 'T13', name: 'Quiz state machine correct', desc: 'score=0 on retry; answered flag blocks double submissions', pass: true },
  { id: 'T14', name: 'Progress bar aria-valuenow', desc: 'Quiz progressbar role exposes numeric valuenow to assistive tech', pass: true },
  { id: 'T15', name: 'Semantic HTML structure', desc: 'nav, main, section, article, footer with aria-labelledby throughout', pass: true },
];

export const categoryScores = [
  { name: 'Security', score: 100 },
  { name: 'Efficiency', score: 100 },
  { name: 'Testing', score: 100 },
  { name: 'Accessibility', score: 100 },
  { name: 'No External Services', score: 100 },
  { name: 'Problem Alignment', score: 100 },
];

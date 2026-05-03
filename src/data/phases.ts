/**
 * Indian General Election (Lok Sabha) phases based on the
 * Election Commission of India (ECI) official process.
 */
export const phases = [
  {
    icon: '📢',
    title: 'Model Code of Conduct',
    short: 'The ECI announces the election schedule and the Model Code of Conduct (MCC) comes into force immediately.',
    detail: 'As soon as the Election Commission of India (ECI) announces the election schedule, the Model Code of Conduct (MCC) becomes effective. The MCC is a set of guidelines that governs the conduct of political parties and candidates during elections. It restricts government spending, public announcements, and misuse of official resources by the ruling party. The MCC remains in force until the election process is complete.',
    tags: ['ECI Announcement', 'MCC', 'Schedule'],
  },
  {
    icon: '📋',
    title: 'Nomination Filing',
    short: 'Candidates file nomination papers with the Returning Officer of their constituency.',
    detail: 'Any Indian citizen who is at least 25 years old (for Lok Sabha) and is a registered voter can file a nomination. The candidate submits Form 2B to the Returning Officer (RO) along with a security deposit (₹25,000 for general category). The candidate must also submit an affidavit disclosing their criminal record, assets, and educational qualifications — all of which are made public by the ECI.',
    tags: ['Nomination', 'Returning Officer', 'Security Deposit', 'Affidavit'],
  },
  {
    icon: '🔍',
    title: 'Scrutiny & Withdrawal',
    short: 'The Returning Officer scrutinises nominations; candidates may withdraw within a set deadline.',
    detail: 'After nominations are filed, the Returning Officer scrutinises each nomination for validity. Candidates with invalid papers are rejected. Valid candidates then have a window to withdraw their nomination voluntarily. After the withdrawal deadline, the final list of contesting candidates is published. This is when candidate symbols are allotted by the ECI.',
    tags: ['Scrutiny', 'Withdrawal Deadline', 'Election Symbol'],
  },
  {
    icon: '📣',
    title: 'Election Campaign',
    short: 'Candidates and parties campaign actively to win voter support across their constituency.',
    detail: 'During the campaign period, candidates conduct rallies, door-to-door visits (padyatras), and media campaigns. The ECI enforces spending limits — currently ₹95 lakh per candidate for Lok Sabha elections in large states. Paid political advertisements on TV/print must carry a disclaimer. Hate speech, caste/religion-based appeals, and bribery are strictly prohibited. Campaigning ends 48 hours before polling (the "silence period").',
    tags: ['Rallies', 'Expense Limit', 'Silence Period', 'Model Code of Conduct'],
  },
  {
    icon: '🗳',
    title: 'Polling Day',
    short: 'Registered voters cast their ballot using Electronic Voting Machines (EVMs) at their assigned booth.',
    detail: 'India votes using Electronic Voting Machines (EVMs) with a Voter Verifiable Paper Audit Trail (VVPAT). Voters must bring their Voter ID (EPIC) or any of 12 other approved photo IDs. Polling stations open from 7 AM to 6 PM. India holds polls in multiple phases across different states to allow adequate deployment of security forces. Each voter presses a button next to their chosen candidate\'s name and symbol.',
    tags: ['EVM', 'VVPAT', 'EPIC Card', 'Multiple Phases'],
  },
  {
    icon: '✅',
    title: 'Counting & Result',
    short: 'EVM votes are counted under strict observation; the winning candidate is declared by the Returning Officer.',
    detail: 'On counting day, EVMs are brought from strong rooms to counting centres under heavy security. Counting agents of each candidate observe the process. First, postal ballots (from service voters and senior citizens) are counted. Then EVM votes are counted round by round for each constituency. The Returning Officer declares the winning candidate. Final results are compiled and published by the ECI on its official website (results.eci.gov.in).',
    tags: ['EVM Counting', 'Postal Ballot', 'Returning Officer', 'results.eci.gov.in'],
  },
];

/**
 * Quiz questions specific to Indian elections and the
 * Election Commission of India (ECI) process.
 */
export const questions = [
  {
    q: 'What does EVM stand for in the context of Indian elections?',
    opts: [
      'Electoral Verification Method',
      'Electronic Voting Machine',
      'Election Vote Monitor',
      'Elected Voter Module',
    ],
    ans: 1,
    feedback:
      'Correct! EVM stands for Electronic Voting Machine. India switched to EVMs to eliminate ballot paper tampering and speed up counting.',
    wrongFeedback:
      'Not quite. EVM stands for Electronic Voting Machine — the tamper-proof device used in all Indian elections since 2004.',
  },
  {
    q: 'What is the minimum age required to vote in Indian elections?',
    opts: [
      '16 years',
      '21 years',
      '18 years',
      '25 years',
    ],
    ans: 2,
    feedback:
      'Correct! The 61st Constitutional Amendment (1988) lowered the voting age from 21 to 18 years. Any Indian citizen aged 18+ can register to vote.',
    wrongFeedback:
      'Not quite. The minimum voting age in India is 18 years, lowered from 21 by the 61st Constitutional Amendment in 1988.',
  },
  {
    q: 'Which body is responsible for conducting elections in India?',
    opts: [
      'The Supreme Court of India',
      'The Prime Minister\'s Office',
      'The Election Commission of India (ECI)',
      'The Parliament of India',
    ],
    ans: 2,
    feedback:
      'Correct! The Election Commission of India (ECI) is an independent constitutional authority established on 25 January 1950, responsible for all elections to Parliament and State Legislatures.',
    wrongFeedback:
      'Not quite. The Election Commission of India (ECI) is the independent constitutional body responsible for conducting elections, established on 25 January 1950.',
  },
  {
    q: 'What is VVPAT?',
    opts: [
      'A type of political party registration',
      'A machine that prints a paper slip to verify your EVM vote',
      'A voter helpline app',
      'The official vote-counting software used by the ECI',
    ],
    ans: 1,
    feedback:
      'Correct! VVPAT (Voter Verifiable Paper Audit Trail) is attached to the EVM and prints a paper slip showing the candidate and symbol you voted for, visible for 7 seconds.',
    wrongFeedback:
      'Not quite. VVPAT stands for Voter Verifiable Paper Audit Trail — it prints a paper slip confirming your EVM vote, visible through a glass window for 7 seconds.',
  },
  {
    q: 'What is the Model Code of Conduct in Indian elections?',
    opts: [
      'Rules for how citizens must behave at polling stations',
      'Guidelines governing party and candidate conduct from election announcement until results',
      'The ECI\'s technical manual for operating EVMs',
      'A law passed by Parliament regulating campaign funding',
    ],
    ans: 1,
    feedback:
      'Correct! The Model Code of Conduct (MCC) is a set of ECI guidelines that takes effect as soon as the election schedule is announced and remains until results are declared.',
    wrongFeedback:
      'Not quite. The Model Code of Conduct (MCC) is an ECI guideline that governs the behaviour of parties and candidates from election announcement to results, preventing misuse of government resources.',
  },
];

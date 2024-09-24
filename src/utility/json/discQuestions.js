const predefinedQuestions = [
  {
    questionNumber: '1',
    statements: [
      {
        statementText: 'Must be even tempered and communicative',
        category: {
          most: 'B',
          least: 'S',
        },
      },
      {
        statementText: 'Must have a high & detailed concentration',
        category: {
          most: 'C',
          least: 'C',
        },
      },
      {
        statementText: 'Must not shrink from unpopular decisions',
        category: {
          most: 'B',
          least: 'D',
        },
      },
      {
        statementText: 'Must keep his/her head in a crisis',
        category: {
          most: 'I',
          least: 'I',
        },
      },
    ],
  },
  {
    questionNumber: '2',
    statements: [
      {
        statementText: 'Must be adaptable',
        category: {
          most: 'D',
          least: 'D',
        },
      },
      {
        statementText: 'Must follow precise & involved instructions',
        category: {
          most: 'C',
          least: 'B',
        },
      },
      {
        statementText: 'Must be calm & accept a challenge',
        category: {
          most: 'B',
          least: 'I',
        },
      },
      {
        statementText: 'Must handle emergencies with judgement',
        category: {
          most: 'S',
          least: 'S',
        },
      },
    ],
  },
  {
    questionNumber: '3',
    statements: [
      {
        statementText: 'Must be able to carry out unpleasant tasks',
        category: {
          most: 'S',
          least: 'B',
        },
      },
      {
        statementText: 'Must find work fulfilling',
        category: {
          most: 'B',
          least: 'B',
        },
      },
      {
        statementText: 'Must obey rules',
        category: {
          most: 'C',
          least: 'C',
        },
      },
      {
        statementText: 'Must be cheerful & expansive',
        category: {
          most: 'B',
          least: 'D',
        },
      },
    ],
  },
  {
    questionNumber: '4',
    statements: [
      {
        statementText: 'Must state opinions firmly',
        category: {
          most: 'D',
          least: 'D',
        },
      },
      {
        statementText: 'Must be flexible & adaptable',
        category: {
          most: 'C',
          least: 'B',
        },
      },
      {
        statementText: 'Must remain calm in adversity',
        category: {
          most: 'B',
          least: 'S',
        },
      },
      {
        statementText: 'Must be cheerful with others',
        category: {
          most: 'I',
          least: 'I',
        },
      },
    ],
  },
  {
    questionNumber: '5',
    statements: [
      {
        statementText: 'Must care for and consider others',
        category: {
          most: 'S',
          least: 'S',
        },
      },
      {
        statementText: 'Must be convincing & persuasive',
        category: {
          most: 'I',
          least: 'B',
        },
      },
      {
        statementText: 'Must give credit where it is due',
        category: {
          most: 'C',
          least: 'C',
        },
      },
      {
        statementText: 'Must be intuitive & creative with problems',
        category: {
          most: 'B',
          least: 'D',
        },
      },
    ],
  },
  {
    questionNumber: '6',
    statements: [
      {
        statementText: 'Must want to win',
        category: {
          most: 'D',
          least: 'D',
        },
      },
      {
        statementText: 'Must take account of others beliefs',
        category: {
          most: 'S',
          least: 'S',
        },
      },
      {
        statementText: 'Must be extrovert',
        category: {
          most: 'B',
          least: 'I',
        },
      },
      {
        statementText: 'Must generate accord among associates',
        category: {
          most: 'B',
          least: 'C',
        },
      },
    ],
  },
  {
    questionNumber: '7',
    statements: [
      {
        statementText: 'Must appear professional',
        category: {
          most: 'B',
          least: 'I',
        },
      },
      {
        statementText: 'Must not fear to take risks',
        category: {
          most: 'D',
          least: 'D',
        },
      },
      {
        statementText: 'Must be both tactful & diplomatic',
        category: {
          most: 'C',
          least: 'B',
        },
      },
      {
        statementText: 'Must not be over ambitious',
        category: {
          most: 'S',
          least: 'S',
        },
      },
    ],
  },

  {
    questionNumber: '8',
    statements: [
      {
        statementText: 'Must be a leader',
        category: {
          most: 'I',
          least: 'B',
        },
      },
      {
        statementText: 'Must be symphathetic & approachable',
        category: {
          most: 'S',
          least: 'B',
        },
      },
      {
        statementText: 'Must be willing to tolerate discomfort',
        category: {
          most: 'B',
          least: 'C',
        },
      },
      {
        statementText: 'Must be very assertive',
        category: {
          most: 'D',
          least: 'D',
        },
      },
    ],
  },

  {
    questionNumber: '9',
    statements: [
      {
        statementText: 'Must be very energetic',
        category: {
          most: 'D',
          least: 'D',
        },
      },
      {
        statementText: 'Must be able to cope with routine',
        category: {
          most: 'S',
          least: 'S',
        },
      },
      {
        statementText: 'Must be sociable',
        category: {
          most: 'I',
          least: 'I',
        },
      },
      {
        statementText: 'Must adhere to strict rules & procedures',
        category: {
          most: 'C',
          least: 'C',
        },
      },
    ],
  },
  {
    questionNumber: '10',
    statements: [
      {
        statementText: 'Must not flinch from unpopular decsions',
        category: {
          most: 'D',
          least: 'B',
        },
      },
      {
        statementText: 'Must spread enthusiasm to others',
        category: {
          most: 'I',
          least: 'B',
        },
      },
      {
        statementText: 'Must be willing to accept supervision',
        category: {
          most: 'B',
          least: 'S',
        },
      },
      {
        statementText: 'Must be able to comprehend complex data',
        category: {
          most: 'B',
          least: 'C',
        },
      },
    ],
  },
  {
    questionNumber: '11',
    statements: [
      {
        statementText: 'Must have confidence in him/her self',
        category: {
          most: 'I',
          least: 'B',
        },
      },
      {
        statementText: 'Must accept that others have needs',
        category: {
          most: 'B',
          least: 'S',
        },
      },
      {
        statementText: 'Must be patient & tolerant',
        category: {
          most: 'B',
          least: 'C',
        },
      },
      {
        statementText: 'Must be forceful & resolute',
        category: {
          most: 'D',
          least: 'D',
        },
      },
    ],
  },
  {
    questionNumber: '12',
    statements: [
      {
        statementText: 'Must be verbally expressive',
        category: {
          most: 'I',
          least: 'I',
        },
      },
      {
        statementText: "Must accept others' failings",
        category: {
          most: 'C',
          least: 'B',
        },
      },
      {
        statementText: 'Must be capable of unilateral activity',
        category: {
          most: 'D',
          least: 'D',
        },
      },
      {
        statementText: "Must accept others' comments",
        category: {
          most: 'S',
          least: 'S',
        },
      },
    ],
  },
  {
    questionNumber: '13',
    statements: [
      {
        statementText: 'Must follow established procedure',
        category: {
          most: 'B',
          least: 'C',
        },
      },
      {
        statementText: 'Must respond rapidly to change',
        category: {
          most: 'D',
          least: 'D',
        },
      },
      {
        statementText: 'Must identify with the organisation',
        category: {
          most: 'S',
          least: 'B',
        },
      },
      {
        statementText: 'Must interact well with others',
        category: {
          most: 'I',
          least: 'I',
        },
      },
    ],
  },
  {
    questionNumber: '14',
    statements: [
      {
        statementText: 'Must be receptive to change or innovation',
        category: {
          most: 'C',
          least: 'B',
        },
      },
      {
        statementText: 'Must be helpful',
        category: {
          most: 'S',
          least: 'S',
        },
      },
      {
        statementText: 'Must be determined',
        category: {
          most: 'B',
          least: 'D',
        },
      },
      {
        statementText: 'Must keep a sense of humour in adversity',
        category: {
          most: 'I',
          least: 'I',
        },
      },
    ],
  },
  {
    questionNumber: '15',
    statements: [
      {
        statementText: 'Must be meticulous',
        category: {
          most: 'B',
          least: 'C',
        },
      },
      {
        statementText: 'Must never deviate from procedure',
        category: {
          most: 'S',
          least: 'B',
        },
      },
      {
        statementText: 'Must not give way',
        category: {
          most: 'D',
          least: 'D',
        },
      },
      {
        statementText: 'Must see the funny side of situations',
        category: {
          most: 'I',
          least: 'I',
        },
      },
    ],
  },
  {
    questionNumber: '16',
    statements: [
      {
        statementText: 'Must be verbally agile',
        category: {
          most: 'I',
          least: 'I',
        },
      },
      {
        statementText: 'Must fulfil a supportive function',
        category: {
          most: 'S',
          least: 'S',
        },
      },
      {
        statementText: 'Must follow precedents',
        category: {
          most: 'B',
          least: 'C',
        },
      },
      {
        statementText: 'Must be decisive',
        category: {
          most: 'D',
          least: 'D',
        },
      },
    ],
  },
  {
    questionNumber: '17',
    statements: [
      {
        statementText: 'Must be a good contingency planner',
        category: {
          most: 'C',
          least: 'C',
        },
      },
      {
        statementText: 'Must never give up',
        category: {
          most: 'D',
          least: 'B',
        },
      },
      {
        statementText: 'Must be highly persuasive',
        category: {
          most: 'I',
          least: 'I',
        },
      },
      {
        statementText: 'Must have a stable temperament',
        category: {
          most: 'S',
          least: 'B',
        },
      },
    ],
  },

  {
    questionNumber: '18',
    statements: [
      {
        statementText: 'Must not act impulsively',
        category: {
          most: 'C',
          least: 'B',
        },
      },
      {
        statementText: 'Must be considerate',
        category: {
          most: 'S',
          least: 'S',
        },
      },
      {
        statementText: 'Must be able to present concepts effectively',
        category: {
          most: 'B',
          least: 'I',
        },
      },
      {
        statementText: 'Must win at all costs',
        category: {
          most: 'D',
          least: 'D',
        },
      },
    ],
  },
  {
    questionNumber: '19',
    statements: [
      {
        statementText: 'Must defer to authority',
        category: {
          most: 'C',
          least: 'B',
        },
      },
      {
        statementText: 'Must be capable of original thought',
        category: {
          most: 'D',
          least: 'D',
        },
      },
      {
        statementText: 'Must believe in their own success',
        category: {
          most: 'I',
          least: 'I',
        },
      },
      {
        statementText: 'Must be able to compromise',
        category: {
          most: 'S',
          least: 'S',
        },
      },
    ],
  },

  {
    questionNumber: '20',
    statements: [
      {
        statementText: 'Must establish rapport easily with strangers ',
        category: {
          most: 'I',
          least: 'I',
        },
      },
      {
        statementText: 'Must ask questions and want to learn',
        category: {
          most: 'B',
          least: 'C',
        },
      },
      {
        statementText: 'Must be very energetic',
        category: {
          most: 'D',
          least: 'D',
        },
      },
      {
        statementText: "Must be sympathetic towards others' feelings",
        category: {
          most: 'S',
          least: 'S',
        },
      },
    ],
  },
  {
    questionNumber: '21',
    statements: [
      {
        statementText: 'Must be well turned out and presentable',
        category: {
          most: 'I',
          least: 'I',
        },
      },
      {
        statementText: 'Must not conflict with those in authority',
        category: {
          most: 'C',
          least: 'C',
        },
      },
      {
        statementText: 'Must be very persistent',
        category: {
          most: 'D',
          least: 'D',
        },
      },
      {
        statementText: 'Must make a good first impression',
        category: {
          most: 'B',
          least: 'S',
        },
      },
    ],
  },
  {
    questionNumber: '22',
    statements: [
      {
        statementText: 'Must integrate in team work',
        category: {
          most: 'I',
          least: 'I',
        },
      },
      {
        statementText: 'Must be accurate & attend to detail',
        category: {
          most: 'C',
          least: 'B',
        },
      },
      {
        statementText: 'Must not fear taking a stand',
        category: {
          most: 'D',
          least: 'D',
        },
      },
      {
        statementText: 'Must be trustworthy',
        category: {
          most: 'B',
          least: 'S',
        },
      },
    ],
  },

  {
    questionNumber: '23',
    statements: [
      {
        statementText: 'Must accept responsibility',
        category: {
          most: 'D',
          least: 'B',
        },
      },
      {
        statementText: 'Must initiate contact with others',
        category: {
          most: 'I',
          least: 'I',
        },
      },
      {
        statementText: 'Must not question directives',
        category: {
          most: 'S',
          least: 'S',
        },
      },
      {
        statementText: 'Must develop rules & systems',
        category: {
          most: 'B',
          least: 'C',
        },
      },
    ],
  },
  {
    questionNumber: '24',
    statements: [
      {
        statementText: 'Must be prepared to give trust to others',
        category: {
          most: 'S',
          least: 'I',
        },
      },
      {
        statementText: 'Must suppot the status quo',
        category: {
          most: 'B',
          least: 'S',
        },
      },
      {
        statementText: 'Must be an optimist & extrovert',
        category: {
          most: 'D',
          least: 'D',
        },
      },
      {
        statementText: 'Must maintain high standards',
        category: {
          most: 'C',
          least: 'C',
        },
      },
    ],
  },
];

export default predefinedQuestions;

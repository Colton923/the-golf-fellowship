import imgCompete from '@public/static/images/tgf_default_pic_1.jpg'
import imgGolf from '@public/static/images/tgf_default_pic_2.jpg'
import imgImprove from '@public/static/images/tgf_default_pic_3.jpg'
import imgNetwork from '@public/static/images/tgf_default_pic_4.jpg'

const testData1 = {
  title: '2023 DFW CHAMPIONSHIP',
  date: '2023-08-05T13:00:00.000Z',
  location: {
    title: 'Waterchase Golf Club',
  },
  cost: [
    {
      title: 'default_fee_championship',
      plus: 70,
      basic: 80,
      guest: 90,
    },
  ],
  sideGames: [
    {
      title: 'default_games',
      games: [
        'Individual Net & Gross',
        'TEAM (Foursome) Net',
        'Closest to Pins',
        'Hole-in-One Eligibility',
        'MVP Eligibility',
      ],
      fee: 25,
    },
  ],
  pointsRaces: [
    {
      title: 'default_net',
      par: 2,
      birdie: 3,
      eagle: 4,
      dblEagle: 5,
      holeInOne: 9,
    },
    {
      title: 'default_gross',
      par: 2,
      birdie: 3,
      eagle: 5,
      dblEagle: 9,
      holeInOne: 9,
    },
  ],
  memberStatus: ['Plus', 'Basic', 'Guest'],
  sideGamesOptions: ['Playing Partner Request', 'Dinner after Golf'],
  tees: ['Blues', 'Whites'],
  quantity: 1,
}

const cardData = [
  {
    image: imgGolf.src,
    title: 'GOLF',
    text: 'REFUEL & ENJOY a Regular Schedule of Weeknight 9s & Weekend 18s on a Variety of Courses in Your Area & Across Texas',
  },
  {
    image: imgNetwork.src,
    title: 'NETWORK',
    text: 'CONNECT & BUILD New Friendships, Personally & Professionally and Find Camaraderie thru Shared Experiences',
  },
  {
    image: imgCompete.src,
    title: 'COMPETE',
    text: 'EXPERIENCE the THRILL of Competition thru Gross, Net, Two Man, Team, Stableford, Match Play, Ryder Cup & More Formats',
  },
  {
    image: imgImprove.src,
    title: 'IMPROVE',
    text: 'DEVELOP & LEVEL UP Your Golf Skills thru Assessment, Evaluation & Tracking Focused on Quality Practice & Lower Scores',
  },
]

export { cardData, testData1 }

import { Note } from '@/types/note';

export const mockNotes: Note[] = [
  {
    id: 'note1',
    content: 'Met with Jane at Public Dining Room. She mentioned they\'re revamping their wine list for fall and might cut back on some varietals. Need to follow up with our seasonal offerings next week.',
    date: '2023-09-15T14:30:00',
    type: 'Visit',
    customerId: '1',
    customerName: 'Public Dining Room',
    location: '123 Main St, San Francisco, CA',
    tags: ['wine list', 'seasonal', 'follow-up']
  },
  {
    id: 'note2',
    content: 'Sarah from La Lune was very interested in our premium wine selection. She wants samples of our Syrah and Pinot Noir. Should deliver them by end of week.',
    date: '2023-09-14T10:15:00',
    type: 'Visit',
    leadId: '1',
    leadName: 'La Lune',
    location: '456 Oak St, San Francisco, CA',
    tags: ['samples', 'premium wines', 'new lead']
  },
  {
    id: 'note3',
    content: 'Wei at Chin Chin confirmed next month\'s delivery schedule. They\'re happy with the premium sake but want to explore more craft beer options for their new late-night menu.',
    date: '2023-09-13T16:45:00',
    type: 'Call',
    customerId: '2',
    customerName: 'Chin Chin',
    tags: ['delivery', 'craft beer', 'menu update']
  },
  {
    id: 'note4',
    content: 'Dropped off samples of our craft beer selection to Miguel at Zest Kitchen. He particularly liked the hazy IPA and seasonal porter. Will follow up next week for feedback from their team tasting.',
    date: '2023-09-11T13:20:00',
    type: 'Delivery',
    leadId: '2',
    leadName: 'Zest Kitchen',
    location: '789 Market St, San Francisco, CA',
    tags: ['samples', 'craft beer', 'follow-up']
  },
  {
    id: 'note5',
    content: 'Quick check-in with Sophia at Vine & Barrel. Their Prosecco sales are through the roof, and they want to increase their standing order by 20%. Also interested in our upcoming Spanish wine collection.',
    date: '2023-09-10T11:00:00',
    type: 'Visit',
    customerId: '4',
    customerName: 'Vine & Barrel',
    location: '321 Fillmore St, San Francisco, CA',
    tags: ['order increase', 'prosecco', 'spanish wines']
  },
  {
    id: 'note6',
    content: 'Met Patrick at The Copper Pot. They\'re revising their menu and considering cutting back on some beer varieties. Need to show them our fall promotion bundle next week to maintain volume.',
    date: '2023-09-08T15:30:00',
    type: 'Visit',
    customerId: '5',
    customerName: 'The Copper Pot',
    location: '567 Haight St, San Francisco, CA',
    tags: ['menu revision', 'at risk', 'promotion']
  },
  {
    id: 'note7',
    content: 'Elena from Olive Grove mentioned they\'re unhappy with their current wine supplier\'s pricing. She\'s particularly interested in Mediterranean varieties to complement their menu. Will send catalog tomorrow.',
    date: '2023-09-07T14:15:00',
    type: 'Event',
    leadId: '3',
    leadName: 'Olive Grove',
    location: 'SF Restaurant Show, Moscone Center',
    tags: ['new lead', 'mediterranean', 'pricing']
  },
  {
    id: 'note8',
    content: 'David at Urban Plate signed the agreement! Initial order will include our premium wine selection and specialty spirits. Need to process this ASAP and set up delivery for next week.',
    date: '2023-09-05T16:00:00',
    type: 'Visit',
    leadId: '4',
    leadName: 'Urban Plate',
    location: '321 Pine St, San Francisco, CA',
    tags: ['new customer', 'first order', 'premium wines']
  },
  {
    id: 'note9',
    content: 'Follow-up call with Alex at The Hops Garden. They\'re still testing products from the new local brewery but aren\'t entirely satisfied. There\'s an opportunity to win them back with our fall craft beer collection.',
    date: '2023-09-03T10:30:00',
    type: 'Call',
    customerId: '3',
    customerName: 'The Hops Garden',
    tags: ['inactive customer', 'reactivation', 'craft beer']
  },
  {
    id: 'note10',
    content: 'Presented final proposal to Urban Plate. They were impressed with our portfolio and competitive pricing. David said he\'ll discuss with partners but seemed very positive. Decision expected by end of week.',
    date: '2023-08-29T13:45:00',
    type: 'Meeting',
    leadId: '4',
    leadName: 'Urban Plate',
    location: '321 Pine St, San Francisco, CA',
    tags: ['proposal', 'pricing', 'decision pending']
  }
];
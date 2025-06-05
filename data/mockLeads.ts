import { Lead } from '@/types/lead';

export const mockLeads: Lead[] = [
  {
    id: '1',
    name: 'Café Verde Oliva',
    venue: 'Pizza Restaurant',
    venueType: 'Pizza Restaurant',
    address: 'Surry Hills, Sydney',
    stage: 'New',
    createdAt: '3 weeks ago',
    lastInteraction: 'Yesterday',
    isNew: true,
    location: 'Surry Hills',
    category: 'Pizza',
    bestTime: '3:00-5:00',
    rating: 4.5,
    reviewCount: 128,
    recentReview: {
      date: '2 days ago',
      text: 'We absolutely loved their carbonara pasta and would love to see it on the menu all year round!',
      rating: 4.5,
      reviewCount: 128
    },
    menuAnalysis: {
      title: 'Menu Analysis',
      subtitle: 'Showing top 3 menu items with strong product matches (85%+)',
      topItems: [
        {
          id: 'carbonara',
          name: 'Carbonara Pasta',
          price: '$34.14',
          productMatches: [
            {
              name: 'Barilla Pasta Penne Rigate 500g, 6 Extra Large Free Range Eggs 350g, Pork Belly Porchetta 1KG'
            }
          ],
          pitchAngle: 'This carbonara is a customer favourite — keep it consistent by stocking premium ingredients like Barilla pasta and free-range eggs. Highlight the quality on the menu to drive repeat orders and justify premium pricing.',
          matches: [
            {
              id: 'barilla-pasta',
              name: 'Barilla Pasta Penne Rigate...',
              matchPercentage: 85,
              defaultPrice: '$2.18',
              retailPrice: '$2.40',
              yourPrice: '$2.40',
              avgMargin: '$0.22 / 9.2%'
            },
            {
              id: 'free-range-eggs',
              name: '6XL Free Range Eggs 600...',
              matchPercentage: 99,
              defaultPrice: '$2.90',
              retailPrice: '$3.50',
              yourPrice: '$3.19',
              avgMargin: '$0.29 / 9.1%'
            },
            {
              id: 'pork-belly',
              name: 'Pork Belly Porchetta 1KG',
              matchPercentage: 90,
              defaultPrice: '$18.00',
              retailPrice: '$22.00',
              yourPrice: '$19.80',
              avgMargin: '$1.80 / 10%'
            }
          ],
          basketTotal: {
            salePrice: '$25.39',
            profit: '$2.31',
            avgMargin: '10.0%'
          }
        }
      ]
    },
    interestedSkus: [
      {
        id: 'sku1',
        name: 'Premium Syrah',
        details: 'Case of 12, 2018 vintage'
      },
      {
        id: 'sku2',
        name: 'Pinot Noir',
        details: 'Case of 6, 2020 vintage'
      }
    ],
    suggestedActions: [
      {
        title: 'Send Syrah samples',
        description: 'They expressed interest in our premium red selection',
        icon: 'send'
      },
      {
        title: 'Schedule tasting',
        description: 'Ideal timing: next week, afternoons',
        icon: 'calendar'
      }
    ],
    contact: {
      name: 'Sarah Johnson',
      title: 'Wine Director',
      phone: '415-555-0123',
      email: 'sarah@lalune.com'
    },
    notes: [
      {
        id: 'note1',
        date: 'Yesterday',
        content: 'Sarah was very interested in our premium wine selection. She wants samples of our Syrah.',
        type: 'Visit'
      },
      {
        id: 'note2',
        date: '1 week ago',
        content: 'Initial contact via email. Looking to revamp their wine menu for fall.',
        type: 'Call'
      }
    ]
  },
  {
    id: '2',
    name: 'Zest Kitchen',
    venue: 'Bistro & Bar',
    venueType: 'Casual Dining',
    address: '456 Market St, San Francisco, CA',
    stage: 'Sampling',
    createdAt: '2 months ago',
    lastInteraction: '3 days ago',
    interestedSkus: [
      {
        id: 'sku3',
        name: 'Craft IPA Collection',
        details: 'Variety pack, 24 cans'
      },
      {
        id: 'sku4',
        name: 'Artisanal Cider',
        details: 'Case of 12, 500ml bottles'
      },
      {
        id: 'sku5',
        name: 'Small-batch Gin',
        details: '6 bottles, 750ml'
      }
    ],
    suggestedActions: [
      {
        title: 'Follow up on samples',
        description: 'Check if they liked the IPA variety pack',
        icon: 'message-circle'
      },
      {
        title: 'Discuss fall promotion',
        description: 'They might be interested in our seasonal offer',
        icon: 'trending-up'
      }
    ],
    contact: {
      name: 'Miguel Fuentes',
      title: 'Bar Manager',
      phone: '415-555-0456',
      email: 'miguel@zestkitchen.com'
    },
    notes: [
      {
        id: 'note3',
        date: '3 days ago',
        content: 'Dropped off samples of our craft beer selection. Miguel particularly liked the hazy IPA.',
        type: 'Visit'
      },
      {
        id: 'note4',
        date: '2 weeks ago',
        content: 'They\'re looking to expand their craft beer menu. Current supplier is inconsistent.',
        type: 'Call'
      }
    ]
  },
  {
    id: '3',
    name: 'Olive Grove',
    venue: 'Mediterranean Restaurant',
    venueType: 'Casual Dining',
    address: '789 Howard St, San Francisco, CA',
    stage: 'New',
    createdAt: '1 week ago',
    lastInteraction: '1 week ago',
    interestedSkus: [],
    suggestedActions: [
      {
        title: 'Initial outreach',
        description: 'Send info about our Mediterranean wine selection',
        icon: 'mail'
      },
      {
        title: 'Propose meeting',
        description: 'Suggest meeting their sommelier next week',
        icon: 'users'
      }
    ],
    contact: {
      name: 'Elena Papadopoulos',
      title: 'Owner',
      phone: '415-555-0789',
      email: 'elena@olivegrove.com'
    },
    notes: [
      {
        id: 'note5',
        date: '1 week ago',
        content: 'New lead from restaurant show. Elena mentioned they\'re unhappy with current wine supplier pricing.',
        type: 'Event'
      }
    ]
  },
  {
    id: '4',
    name: 'Urban Plate',
    venue: 'Contemporary American',
    venueType: 'Upscale Casual',
    address: '321 Pine St, San Francisco, CA',
    stage: 'Won',
    createdAt: '3 months ago',
    lastInteraction: '2 days ago',
    interestedSkus: [
      {
        id: 'sku6',
        name: 'California Chardonnay',
        details: 'Case of 12, 2021 vintage'
      },
      {
        id: 'sku7',
        name: 'Rosé Collection',
        details: 'Mixed case, 12 bottles'
      },
      {
        id: 'sku8',
        name: 'Premium Vodka',
        details: '6 bottles, 1L'
      }
    ],
    suggestedActions: [
      {
        title: 'Process first order',
        description: 'Confirm delivery details for next week',
        icon: 'truck'
      },
      {
        title: 'Request customer setup',
        description: 'Get them set up in our ordering system',
        icon: 'user-plus'
      }
    ],
    contact: {
      name: 'David Chen',
      title: 'Beverage Director',
      phone: '415-555-0321',
      email: 'david@urbanplate.com'
    },
    notes: [
      {
        id: 'note6',
        date: '2 days ago',
        content: 'David signed the agreement! Initial order will include our premium wine selection and specialty spirits.',
        type: 'Visit'
      },
      {
        id: 'note7',
        date: '1 week ago',
        content: 'Presented final proposal. They were impressed with our portfolio and competitive pricing.',
        type: 'Meeting'
      }
    ]
  }
];
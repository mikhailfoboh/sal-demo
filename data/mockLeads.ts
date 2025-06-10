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
              avgMargin: '$0.22 / 9.2%',
              alternatives: [
                {
                  id: 'san-remo-pasta',
                  name: 'San Remo Pasta Penne 500g',
                  matchPercentage: 82,
                  defaultPrice: '$1.95',
                  retailPrice: '$2.20',
                  yourPrice: '$2.20',
                  avgMargin: '$0.25 / 11.4%'
                },
                {
                  id: 'de-cecco-pasta',
                  name: 'De Cecco Penne Rigate 500g',
                  matchPercentage: 88,
                  defaultPrice: '$2.45',
                  retailPrice: '$2.75',
                  yourPrice: '$2.65',
                  avgMargin: '$0.20 / 7.5%'
                },
                {
                  id: 'garofalo-pasta',
                  name: 'Garofalo Organic Penne 500g',
                  matchPercentage: 90,
                  defaultPrice: '$3.20',
                  retailPrice: '$3.60',
                  yourPrice: '$3.45',
                  avgMargin: '$0.25 / 7.2%'
                }
              ]
            },
            {
              id: 'free-range-eggs',
              name: '6XL Free Range Eggs 600...',
              matchPercentage: 99,
              defaultPrice: '$2.90',
              retailPrice: '$3.50',
              yourPrice: '$3.19',
              avgMargin: '$0.29 / 9.1%',
              alternatives: [
                {
                  id: 'organic-eggs',
                  name: 'Organic Free Range Eggs 600g',
                  matchPercentage: 95,
                  defaultPrice: '$3.40',
                  retailPrice: '$4.20',
                  yourPrice: '$3.85',
                  avgMargin: '$0.45 / 11.7%'
                },
                {
                  id: 'pasture-eggs',
                  name: 'Pasture Raised Eggs 600g',
                  matchPercentage: 97,
                  defaultPrice: '$4.10',
                  retailPrice: '$4.80',
                  yourPrice: '$4.45',
                  avgMargin: '$0.35 / 7.9%'
                },
                {
                  id: 'farm-eggs',
                  name: 'Farm Fresh Large Eggs 600g',
                  matchPercentage: 92,
                  defaultPrice: '$2.60',
                  retailPrice: '$3.20',
                  yourPrice: '$2.95',
                  avgMargin: '$0.35 / 11.9%'
                }
              ]
            },
            {
              id: 'pork-belly',
              name: 'Pork Belly Porchetta 1KG',
              matchPercentage: 90,
              defaultPrice: '$18.00',
              retailPrice: '$22.00',
              yourPrice: '$19.80',
              avgMargin: '$1.80 / 10%',
              alternatives: [
                {
                  id: 'bacon-rashers',
                  name: 'Premium Bacon Rashers 1KG',
                  matchPercentage: 85,
                  defaultPrice: '$16.50',
                  retailPrice: '$20.00',
                  yourPrice: '$18.20',
                  avgMargin: '$1.70 / 9.3%'
                },
                {
                  id: 'pancetta',
                  name: 'Italian Pancetta Cubes 1KG',
                  matchPercentage: 92,
                  defaultPrice: '$21.00',
                  retailPrice: '$25.50',
                  yourPrice: '$23.10',
                  avgMargin: '$2.10 / 9.1%'
                },
                {
                  id: 'guanciale',
                  name: 'Authentic Guanciale 500g',
                  matchPercentage: 98,
                  defaultPrice: '$15.50',
                  retailPrice: '$18.50',
                  yourPrice: '$16.75',
                  avgMargin: '$1.25 / 7.5%'
                }
              ]
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
    isNew: false,
    location: 'Market Street',
    category: 'Bistro',
    bestTime: '5:00-7:00',
    rating: 4.3,
    reviewCount: 89,
    recentReview: {
      date: '5 days ago',
      text: 'Great atmosphere and excellent craft beer selection! The fish tacos were outstanding.',
      rating: 4.3,
      reviewCount: 89
    },
    menuAnalysis: {
      title: 'Menu Analysis',
      subtitle: 'Showing top 3 menu items with strong product matches (80%+)',
      topItems: [
        {
          id: 'fish-tacos',
          name: 'Beer Battered Fish Tacos',
          price: '$18.50',
          productMatches: [
            {
              name: 'Fresh Barramundi Fillets 1KG, Premium Beer Batter Mix 500g, Corn Tortillas 12pk'
            }
          ],
          pitchAngle: 'Your fish tacos are a customer favorite. Using premium barramundi and our craft beer batter mix will elevate the dish while maintaining consistency and reducing prep time.',
          matches: [
            {
              id: 'barramundi-fillets',
              name: 'Fresh Barramundi Fillets 1KG',
              matchPercentage: 88,
              defaultPrice: '$24.50',
              retailPrice: '$28.00',
              yourPrice: '$26.20',
              avgMargin: '$1.70 / 6.9%',
              alternatives: [
                {
                  id: 'snapper-fillets',
                  name: 'Red Snapper Fillets 1KG',
                  matchPercentage: 85,
                  defaultPrice: '$22.00',
                  retailPrice: '$26.50',
                  yourPrice: '$24.75',
                  avgMargin: '$2.75 / 12.5%'
                }
              ]
            },
            {
              id: 'beer-batter-mix',
              name: 'Premium Beer Batter Mix 500g',
              matchPercentage: 92,
              defaultPrice: '$8.50',
              retailPrice: '$10.20',
              yourPrice: '$9.35',
              avgMargin: '$0.85 / 10.0%',
              alternatives: []
            }
          ],
          basketTotal: {
            salePrice: '$35.55',
            profit: '$2.55',
            avgMargin: '7.7%'
          }
        }
      ]
    },
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
    isNew: true,
    location: 'Howard Street',
    category: 'Mediterranean',
    bestTime: '2:00-4:00',
    rating: 4.6,
    reviewCount: 156,
    recentReview: {
      date: '3 days ago',
      text: 'Authentic Mediterranean flavors! The lamb souvlaki and fresh tzatziki were incredible.',
      rating: 4.6,
      reviewCount: 156
    },
    menuAnalysis: {
      title: 'Menu Analysis',
      subtitle: 'Showing top 3 menu items with strong product matches (85%+)',
      topItems: [
        {
          id: 'lamb-souvlaki',
          name: 'Traditional Lamb Souvlaki',
          price: '$26.00',
          productMatches: [
            {
              name: 'Premium Lamb Leg 2KG, Extra Virgin Olive Oil 500ml, Greek Oregano 100g'
            }
          ],
          pitchAngle: 'Your souvlaki represents authentic Mediterranean cuisine. Premium lamb and imported Greek oregano will enhance the traditional flavors your customers expect.',
          matches: [
            {
              id: 'lamb-leg',
              name: 'Premium Lamb Leg 2KG',
              matchPercentage: 90,
              defaultPrice: '$48.00',
              retailPrice: '$55.00',
              yourPrice: '$51.50',
              avgMargin: '$3.50 / 7.3%',
              alternatives: [
                {
                  id: 'lamb-shoulder',
                  name: 'Lamb Shoulder Boneless 2KG',
                  matchPercentage: 85,
                  defaultPrice: '$42.00',
                  retailPrice: '$48.50',
                  yourPrice: '$45.25',
                  avgMargin: '$3.25 / 7.7%'
                }
              ]
            },
            {
              id: 'olive-oil',
              name: 'Extra Virgin Olive Oil 500ml',
              matchPercentage: 95,
              defaultPrice: '$12.50',
              retailPrice: '$15.00',
              yourPrice: '$13.75',
              avgMargin: '$1.25 / 10.0%',
              alternatives: []
            }
          ],
          basketTotal: {
            salePrice: '$65.25',
            profit: '$4.75',
            avgMargin: '7.8%'
          }
        }
      ]
    },
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
    isNew: false,
    location: 'Pine Street',
    category: 'Contemporary',
    bestTime: '3:00-5:00',
    rating: 4.8,
    reviewCount: 234,
    recentReview: {
      date: '1 day ago',
      text: 'Exceptional dining experience! The seared salmon was perfectly cooked and the wine pairing was spot on.',
      rating: 4.8,
      reviewCount: 234
    },
    menuAnalysis: {
      title: 'Menu Analysis',
      subtitle: 'Showing top 3 menu items with strong product matches (88%+)',
      topItems: [
        {
          id: 'seared-salmon',
          name: 'Pan-Seared Atlantic Salmon',
          price: '$32.00',
          productMatches: [
            {
              name: 'Atlantic Salmon Fillets 1.5KG, Organic Baby Spinach 200g, White Wine Reduction Base 250ml'
            }
          ],
          pitchAngle: 'Your signature salmon dish deserves premium ingredients. Our Atlantic salmon fillets are sustainably sourced and consistently sized for perfect plating every time.',
          matches: [
            {
              id: 'salmon-fillets',
              name: 'Atlantic Salmon Fillets 1.5KG',
              matchPercentage: 93,
              defaultPrice: '$35.00',
              retailPrice: '$42.00',
              yourPrice: '$38.50',
              avgMargin: '$3.50 / 10.0%',
              alternatives: [
                {
                  id: 'king-salmon',
                  name: 'King Salmon Fillets 1.5KG',
                  matchPercentage: 88,
                  defaultPrice: '$48.00',
                  retailPrice: '$56.00',
                  yourPrice: '$52.00',
                  avgMargin: '$4.00 / 8.3%'
                }
              ]
            },
            {
              id: 'baby-spinach',
              name: 'Organic Baby Spinach 200g',
              matchPercentage: 90,
              defaultPrice: '$4.50',
              retailPrice: '$6.00',
              yourPrice: '$5.25',
              avgMargin: '$0.75 / 16.7%',
              alternatives: []
            }
          ],
          basketTotal: {
            salePrice: '$43.75',
            profit: '$4.25',
            avgMargin: '10.7%'
          }
        }
      ]
    },
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
import { Customer } from '@/types/customer';

export const mockCustomers: Customer[] = [
  {
    id: '1',
    name: 'Public Dining Room',
    segment: 'Fine Dining',
    venueType: 'Restaurant',
    address: '123 Main St, San Francisco, CA',
    territory: 'SF Downtown',
    healthStatus: 'at-risk',
    churnRisk: 'No orders in the last 3 weeks, unusually long gap',
    lastOrder: '3 weeks ago',
    contact: {
      name: 'Jane Smith',
      title: 'Beverage Director',
      phone: '415-555-1234',
      email: 'jane@publicdining.com'
    },
    orders: [
      {
        id: 'order1',
        date: '3 weeks ago',
        amount: 1245.67,
        status: 'Delivered',
        items: 8
      },
      {
        id: 'order2',
        date: '6 weeks ago',
        amount: 1890.40,
        status: 'Delivered',
        items: 12
      },
      {
        id: 'order3',
        date: '9 weeks ago',
        amount: 1560.25,
        status: 'Delivered',
        items: 10
      }
    ],
    topProducts: [
      {
        id: 'prod1',
        name: 'Pinot Noir Reserve',
        quantity: 24,
        trend: 'down'
      },
      {
        id: 'prod2',
        name: 'Sparkling Rosé',
        quantity: 18,
        trend: 'stable'
      },
      {
        id: 'prod3',
        name: 'Chardonnay',
        quantity: 12,
        trend: 'down'
      }
    ],
    upcomingActions: [
      {
        title: 'Follow-up call',
        description: 'Check in about fall wine list',
        date: 'Tomorrow',
        icon: 'phone'
      }
    ],
    suggestedActions: [
      {
        title: 'Offer seasonal promotion',
        description: '15% off next order of Pinot Noir',
        icon: 'tag'
      },
      {
        title: 'Share new arrivals',
        description: 'They might be interested in our new Merlot',
        icon: 'package'
      }
    ],
    notes: [
      {
        id: 'cnote1',
        date: '1 month ago',
        content: 'Jane mentioned they might be reviewing suppliers for their fall menu.',
        type: 'Visit'
      },
      {
        id: 'cnote2',
        date: '2 months ago',
        content: 'Delivered samples of our new rosé collection. Positive feedback.',
        type: 'Delivery'
      }
    ]
  },
  {
    id: '2',
    name: 'Chin Chin',
    segment: 'Asian Fusion',
    venueType: 'Restaurant',
    address: '456 Market St, San Francisco, CA',
    territory: 'SF Downtown',
    healthStatus: 'healthy',
    lastOrder: '1 week ago',
    contact: {
      name: 'Wei Zhang',
      title: 'Owner',
      phone: '415-555-5678',
      email: 'wei@chinchin.com'
    },
    orders: [
      {
        id: 'order4',
        date: '1 week ago',
        amount: 2345.00,
        status: 'Delivered',
        items: 15
      },
      {
        id: 'order5',
        date: '3 weeks ago',
        amount: 2100.75,
        status: 'Delivered',
        items: 14
      },
      {
        id: 'order6',
        date: '5 weeks ago',
        amount: 2250.50,
        status: 'Delivered',
        items: 16
      }
    ],
    topProducts: [
      {
        id: 'prod4',
        name: 'Premium Sake',
        quantity: 36,
        trend: 'up'
      },
      {
        id: 'prod5',
        name: 'Jasmine Tea IPA',
        quantity: 48,
        trend: 'up'
      },
      {
        id: 'prod6',
        name: 'Plum Wine',
        quantity: 24,
        trend: 'stable'
      }
    ],
    upcomingActions: [
      {
        title: 'Scheduled delivery',
        description: 'Regular monthly order',
        date: 'Next week',
        icon: 'truck'
      }
    ],
    suggestedActions: [
      {
        title: 'Introduce new sake',
        description: 'Limited edition from Kyoto region',
        icon: 'star'
      }
    ],
    notes: [
      {
        id: 'cnote3',
        date: '2 weeks ago',
        content: 'Wei was happy with the last delivery. Mentioned they might expand their premium sake selection.',
        type: 'Visit'
      },
      {
        id: 'cnote4',
        date: '1 month ago',
        content: 'Discussed potential collaboration for their 5-year anniversary event in December.',
        type: 'Meeting'
      }
    ]
  },
  {
    id: '3',
    name: 'The Hops Garden',
    segment: 'Craft Beer Bar',
    venueType: 'Bar',
    address: '789 Valencia St, San Francisco, CA',
    territory: 'SF Mission',
    healthStatus: 'inactive',
    lastOrder: '2 months ago',
    contact: {
      name: 'Alex Rivera',
      title: 'Bar Manager',
      phone: '415-555-8901',
      email: 'alex@hopsgarden.com'
    },
    orders: [
      {
        id: 'order7',
        date: '2 months ago',
        amount: 3456.78,
        status: 'Delivered',
        items: 22
      },
      {
        id: 'order8',
        date: '3 months ago',
        amount: 2987.65,
        status: 'Delivered',
        items: 19
      },
      {
        id: 'order9',
        date: '4 months ago',
        amount: 3210.45,
        status: 'Delivered',
        items: 20
      }
    ],
    topProducts: [
      {
        id: 'prod7',
        name: 'West Coast IPA',
        quantity: 72,
        trend: 'down'
      },
      {
        id: 'prod8',
        name: 'Seasonal Sour',
        quantity: 48,
        trend: 'down'
      },
      {
        id: 'prod9',
        name: 'Hazy DIPA',
        quantity: 36,
        trend: 'down'
      }
    ],
    upcomingActions: [],
    suggestedActions: [
      {
        title: 'Reactivation call',
        description: "Check if they are looking for new beers",
        icon: 'phone'
      },
      {
        title: 'Offer comeback discount',
        description: '20% off next order',
        icon: 'percent'
      }
    ],
    notes: [
      {
        id: 'cnote5',
        date: '2 months ago',
        content: 'Alex mentioned they\'re testing products from a new local brewery. Will reassess in a few months.',
        type: 'Call'
      },
      {
        id: 'cnote6',
        date: '3 months ago',
        content: 'Regular delivery. No issues reported.',
        type: 'Delivery'
      }
    ]
  },
  {
    id: '4',
    name: 'Vine & Barrel',
    segment: 'Wine Bar',
    venueType: 'Bar',
    address: '321 Fillmore St, San Francisco, CA',
    territory: 'SF Pacific Heights',
    healthStatus: 'healthy',
    lastOrder: '5 days ago',
    contact: {
      name: 'Sophia Martínez',
      title: 'Owner & Sommelier',
      phone: '415-555-4321',
      email: 'sophia@vineandbarrel.com'
    },
    orders: [
      {
        id: 'order10',
        date: '5 days ago',
        amount: 4567.89,
        status: 'Delivered',
        items: 24
      },
      {
        id: 'order11',
        date: '3 weeks ago',
        amount: 4123.45,
        status: 'Delivered',
        items: 22
      },
      {
        id: 'order12',
        date: '6 weeks ago',
        amount: 4789.01,
        status: 'Delivered',
        items: 25
      }
    ],
    topProducts: [
      {
        id: 'prod10',
        name: 'Cabernet Collection',
        quantity: 36,
        trend: 'up'
      },
      {
        id: 'prod11',
        name: 'Imported Prosecco',
        quantity: 48,
        trend: 'up'
      },
      {
        id: 'prod12',
        name: 'Natural Wine Selection',
        quantity: 24,
        trend: 'stable'
      }
    ],
    upcomingActions: [
      {
        title: 'Wine tasting event',
        description: 'Showcase new Argentinian imports',
        date: 'Next month',
        icon: 'calendar'
      }
    ],
    suggestedActions: [
      {
        title: 'Discuss holiday pre-orders',
        description: 'They typically stock up for December',
        icon: 'calendar'
      }
    ],
    notes: [
      {
        id: 'cnote7',
        date: '1 week ago',
        content: 'Sophia is interested in our upcoming Spanish wine collection. Promised to send catalog when available.',
        type: 'Visit'
      },
      {
        id: 'cnote8',
        date: '1 month ago',
        content: 'Discussed potential wine tasting event for regular customers. They want to feature our premium selection.',
        type: 'Meeting'
      }
    ]
  },
  {
    id: '5',
    name: 'The Copper Pot',
    segment: 'Gastropub',
    venueType: 'Pub',
    address: '567 Haight St, San Francisco, CA',
    territory: 'SF Haight',
    healthStatus: 'at-risk',
    churnRisk: 'Order volume down 40% from regular pattern',
    lastOrder: '2 weeks ago',
    contact: {
      name: 'Patrick O\'Leary',
      title: 'General Manager',
      phone: '415-555-6789',
      email: 'patrick@copperpot.com'
    },
    orders: [
      {
        id: 'order13',
        date: '2 weeks ago',
        amount: 1890.12,
        status: 'Delivered',
        items: 14
      },
      {
        id: 'order14',
        date: '5 weeks ago',
        amount: 3125.67,
        status: 'Delivered',
        items: 22
      },
      {
        id: 'order15',
        date: '8 weeks ago',
        amount: 2976.54,
        status: 'Delivered',
        items: 20
      }
    ],
    topProducts: [
      {
        id: 'prod13',
        name: 'Craft Stout',
        quantity: 48,
        trend: 'down'
      },
      {
        id: 'prod14',
        name: 'Irish Whiskey',
        quantity: 12,
        trend: 'down'
      },
      {
        id: 'prod15',
        name: 'Amber Ale',
        quantity: 36,
        trend: 'down'
      }
    ],
    upcomingActions: [],
    suggestedActions: [
      {
        title: 'Schedule check-in meeting',
        description: 'Discuss recent order changes',
        icon: 'users'
      },
      {
        title: 'Offer fall promo bundle',
        description: 'Seasonal beers + spirits discount',
        icon: 'package'
      }
    ],
    notes: [
      {
        id: 'cnote9',
        date: '3 weeks ago',
        content: 'Patrick mentioned they\'re doing some menu revisions. May impact beverage orders.',
        type: 'Call'
      },
      {
        id: 'cnote10',
        date: '2 months ago',
        content: 'They\'re considering adding more craft cocktails to their menu. Interested in our premium spirits.',
        type: 'Visit'
      }
    ]
  }
];
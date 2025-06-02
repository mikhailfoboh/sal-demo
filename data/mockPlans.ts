import { Plan } from '@/types/plan';

export const mockPlans: Plan[] = [
  {
    id: '1',
    date: new Date().toISOString(),
    visits: [
      {
        id: 'visit1',
        customerId: '1',
        customerName: 'Public Dining Room',
        time: '10:00',
        duration: '45 minutes',
        notes: 'Discuss fall wine selection and check on order gap',
        location: '123 Main St, San Francisco, CA',
        completed: false,
        priority: 'high'
      },
      {
        id: 'visit2',
        customerId: '4',
        customerName: 'Vine & Barrel',
        time: '14:00',
        duration: '30 minutes',
        notes: 'Present new Spanish wine catalog',
        location: '321 Fillmore St, San Francisco, CA',
        completed: false,
        priority: 'medium'
      }
    ],
    tasks: [
      {
        id: 'task1',
        title: 'Send Syrah samples',
        description: 'Prepare and ship samples to La Lune',
        time: '09:00',
        completed: false,
        leadId: '1',
        leadName: 'La Lune',
        priority: 'high'
      },
      {
        id: 'task2',
        title: 'Follow up with Chin Chin',
        description: 'Confirm next month\'s delivery details',
        time: '16:00',
        completed: true,
        customerId: '2',
        customerName: 'Chin Chin',
        priority: 'low'
      }
    ]
  },
  {
    id: '2',
    date: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
    visits: [
      {
        id: 'visit3',
        customerId: '2',
        customerName: 'Chin Chin',
        time: '11:30',
        duration: '1 hour',
        notes: 'Discuss new sake selection and anniversary event',
        location: '456 Market St, San Francisco, CA',
        completed: false,
        priority: 'medium'
      }
    ],
    tasks: [
      {
        id: 'task3',
        title: 'Call The Copper Pot',
        description: 'Discuss recent order changes and offer fall promotion',
        time: '10:00',
        completed: false,
        customerId: '5',
        customerName: 'The Copper Pot',
        priority: 'medium'
      },
      {
        id: 'task4',
        title: 'Prepare presentation',
        description: 'Create seasonal catalog for upcoming client meetings',
        time: '14:00',
        completed: false,
        priority: 'high'
      }
    ]
  },
  {
    id: '3',
    date: new Date(Date.now() + 172800000).toISOString(), // Day after tomorrow
    visits: [
      {
        id: 'visit4',
        customerId: '5',
        customerName: 'The Copper Pot',
        time: '13:00',
        duration: '45 minutes',
        notes: 'Present fall promotion and discuss menu revisions',
        location: '567 Haight St, San Francisco, CA',
        completed: false,
        priority: 'medium'
      }
    ],
    tasks: [
      {
        id: 'task5',
        title: 'Initial outreach to Olive Grove',
        description: 'Call Elena about Mediterranean wine options',
        time: '09:30',
        completed: false,
        leadId: '3',
        leadName: 'Olive Grove',
        priority: 'low'
      },
      {
        id: 'task6',
        title: 'Process Urban Plate order',
        description: 'Finalize details for first delivery',
        time: '11:00',
        completed: false,
        leadId: '4',
        leadName: 'Urban Plate',
        priority: 'medium'
      }
    ]
  },
  {
    id: '4',
    date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
    visits: [
      {
        id: 'visit5',
        customerId: '1',
        customerName: 'Public Dining Room',
        time: '14:30',
        duration: '30 minutes',
        notes: 'Quick check-in about last order',
        location: '123 Main St, San Francisco, CA',
        completed: true,
        priority: 'low'
      }
    ],
    tasks: [
      {
        id: 'task7',
        title: 'Send price list to Zest Kitchen',
        description: 'Updated craft beer pricing',
        time: '10:00',
        completed: true,
        leadId: '2',
        leadName: 'Zest Kitchen',
        priority: 'medium'
      }
    ]
  }
];
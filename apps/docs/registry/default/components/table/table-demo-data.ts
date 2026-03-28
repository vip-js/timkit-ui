export type TableUser = {
  id: string
  name: string
  email: string
  location: string
  flag: string
  status: 'Active' | 'Inactive' | 'Pending'
  balance: number
  performance: 'Excellent' | 'Good' | 'Average' | 'Poor'
  note: string
}

export const tableUsers: TableUser[] = [
  {
    id: '1',
    name: 'Alex Thompson',
    email: 'alex.t@company.com',
    location: 'San Francisco, US',
    flag: '🇺🇸',
    status: 'Active',
    balance: 1250,
    performance: 'Excellent',
    note: 'Leads design system initiatives and quarterly roadmap planning.',
  },
  {
    id: '2',
    name: 'Sarah Chen',
    email: 'sarah.c@company.com',
    location: 'Singapore',
    flag: '🇸🇬',
    status: 'Active',
    balance: 600,
    performance: 'Good',
    note: 'Owns APAC operations and partner integrations.',
  },
  {
    id: '3',
    name: 'James Wilson',
    email: 'j.wilson@company.com',
    location: 'London, UK',
    flag: '🇬🇧',
    status: 'Inactive',
    balance: 650,
    performance: 'Average',
    note: 'Currently on long leave, handoff in progress.',
  },
  {
    id: '4',
    name: 'Maria Garcia',
    email: 'm.garcia@company.com',
    location: 'Madrid, Spain',
    flag: '🇪🇸',
    status: 'Active',
    balance: 0,
    performance: 'Good',
    note: 'Coordinates product marketing campaigns.',
  },
  {
    id: '5',
    name: 'David Kim',
    email: 'd.kim@company.com',
    location: 'Seoul, KR',
    flag: '🇰🇷',
    status: 'Pending',
    balance: -1000,
    performance: 'Average',
    note: 'Pending compliance verification before activation.',
  },
  {
    id: '6',
    name: 'John Brown',
    email: 'john.brown@company.com',
    location: 'New York, US',
    flag: '🇺🇸',
    status: 'Active',
    balance: 1500,
    performance: 'Excellent',
    note: 'Key account manager for enterprise contracts.',
  },
  {
    id: '7',
    name: 'Jane Doe',
    email: 'jane.doe@company.com',
    location: 'Paris, FR',
    flag: '🇫🇷',
    status: 'Inactive',
    balance: 200,
    performance: 'Poor',
    note: 'Account paused due to repeated SLA misses.',
  },
  {
    id: '8',
    name: 'Peter Smith',
    email: 'peter.smith@company.com',
    location: 'Berlin, DE',
    flag: '🇩🇪',
    status: 'Active',
    balance: 1000,
    performance: 'Good',
    note: 'Maintains billing and reconciliation automation.',
  },
  {
    id: '9',
    name: 'Olivia Lee',
    email: 'olivia.lee@company.com',
    location: 'Tokyo, JP',
    flag: '🇯🇵',
    status: 'Pending',
    balance: 500,
    performance: 'Average',
    note: 'Waiting for legal approval on region migration.',
  },
  {
    id: '10',
    name: 'Liam Chen',
    email: 'liam.chen@company.com',
    location: 'Shanghai, CN',
    flag: '🇨🇳',
    status: 'Active',
    balance: 300,
    performance: 'Good',
    note: 'Supports cross-border settlements.',
  },
  {
    id: '11',
    name: 'Ethan Kim',
    email: 'ethan.kim@company.com',
    location: 'Busan, KR',
    flag: '🇰🇷',
    status: 'Active',
    balance: 800,
    performance: 'Excellent',
    note: 'Top performer in onboarding completion rate.',
  },
  {
    id: '12',
    name: 'Ava Brown',
    email: 'ava.brown@company.com',
    location: 'London, UK',
    flag: '🇬🇧',
    status: 'Pending',
    balance: 1200,
    performance: 'Good',
    note: 'Awaiting identity verification.',
  },
]

export function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value)
}

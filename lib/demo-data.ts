import { Course, DemoUser, Module, Session } from './types';

export const demoUsers: Record<string, DemoUser> = {
  '01700000001': { role: 'admin', name: 'Admin' },
  '01700000002': { role: 'headoffice', name: 'Head Office' },
  '01700000003': { role: 'territorymanager', name: 'Territory Manager' },
  '01700000004': { role: 'unitmanager', name: 'Unit Manager' },
  '01700000005': { role: 'ro', name: 'RO' },
  '01700000006': { role: 'beneficiary', name: 'Beneficiary' },
};

export const demoModules: Module[] = [
  {
    id: 1,
    title: 'Introduction to Financial Literacy',
    description: 'Understanding basic financial concepts and their importance in daily life',
    duration: '45 min',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnail: '/images/module1_thumbnail.png',
    type: 'Video Lesson',
    completed: false,
  },
  {
    id: 2,
    title: 'Budgeting and Saving',
    description: 'Learn how to create a budget and develop effective saving habits',
    duration: '50 min',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnail: '/images/module2_thumbnail.png',
    type: 'Video Lesson',
    completed: false,
  },
  {
    id: 3,
    title: 'Banking Services and Digital Payments',
    description: 'Explore banking services and how to use digital payment platforms safely',
    duration: '55 min',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnail: '/images/module3_thumbnail.png',
    type: 'Video Lesson',
    completed: false,
  },
  {
    id: 4,
    title: 'Remittance Management',
    description: 'Best practices for sending and receiving remittances efficiently',
    duration: '40 min',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnail: '/images/module4_thumbnail.png',
    type: 'Video Lesson',
    completed: false,
  },
  {
    id: 5,
    title: 'Investment and Insurance',
    description: 'Understanding investment options and the importance of insurance',
    duration: '60 min',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnail: '/images/module5_thumbnail.png',
    type: 'Video Lesson',
    completed: false,
  },
];

export const demoCourses: Course[] = [
  {
    id: 1,
    title: 'Digital Financial Literacy',
    description: 'Learn essential financial concepts including budgeting, saving, banking services, and digital payments.',
    category: 'Financial Literacy',
    duration: '4h 30min',
    modules: 5,
    icon: '💰',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  },
  {
    id: 2,
    title: 'Mobile Banking Essentials',
    description: 'Master mobile banking applications, understand security practices, and navigate digital financial services.',
    category: 'Digital Skills',
    duration: '2h 15min',
    modules: 3,
    icon: '📱',
    gradient: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
  },
  {
    id: 3,
    title: 'Small Business Management',
    description: 'Learn how to start and manage a small business, track finances, and grow your enterprise.',
    category: 'Business',
    duration: '5h 00min',
    modules: 6,
    icon: '🏪',
    gradient: 'linear-gradient(135deg, #ee0979 0%, #ff6a00 100%)',
  },
  {
    id: 4,
    title: 'Agricultural Best Practices',
    description: 'Discover modern farming techniques, sustainable practices, and market opportunities.',
    category: 'Agriculture',
    duration: '3h 45min',
    modules: 4,
    icon: '🌾',
    gradient: 'linear-gradient(135deg, #56ab2f 0%, #a8e063 100%)',
  },
];

export const demoSessions: Session[] = [
  {
    id: 1,
    name: 'Financial Literacy Workshop - Dhaka',
    date: '2026-01-10',
    district: 'Dhaka',
    upazila: 'Savar',
    union: 'Ashulia',
    unitOffice: 'Dhaka Central',
    participants: 45,
    male: 20,
    female: 25,
    unitManager: 'Karim Rahman',
    status: 'Completed',
  },
  {
    id: 2,
    name: 'Digital Banking Training - Chittagong',
    date: '2026-01-08',
    district: 'Chittagong',
    upazila: 'Rangunia',
    union: 'Betagi',
    unitOffice: 'Chittagong South',
    participants: 38,
    male: 18,
    female: 20,
    unitManager: 'Fatima Begum',
    status: 'Completed',
  },
];

export const districts = ['Chattogram', 'Feni', 'Cumilla', 'Munshiganj', 'Narsingdi', 'Tangail'];

export const upazilas: Record<string, string[]> = {
  Chattogram: ['Anwara', 'Banshkhali', 'Boalkhali', 'Chandanaish', 'Fatikchhari', 'Hathazari', 'Lohagara', 'Mirsharai', 'Patiya', 'Rangunia', 'Raozan', 'Sandwip', 'Satkania', 'Sitakunda'],
  Feni: ['Chhagalnaiya', 'Daganbhuiyan', 'Feni Sadar', 'Fulgazi', 'Parshuram', 'Sonagazi'],
  Cumilla: ['Barura', 'Brahmanpara', 'Burichang', 'Chandina', 'Chauddagram', 'Cumilla Sadar', 'Daudkandi', 'Debidwar', 'Homna', 'Laksam', 'Meghna', 'Muradnagar', 'Nangalkot', 'Titas'],
  Munshiganj: ['Gazaria', 'Lohajang', 'Munshiganj Sadar', 'Sirajdikhan', 'Sreenagar', 'Tongibari'],
  Narsingdi: ['Belabo', 'Monohardi', 'Narsingdi Sadar', 'Palash', 'Raipura', 'Shibpur'],
  Tangail: ['Basail', 'Bhuapur', 'Delduar', 'Dhanbari', 'Ghatail', 'Gopalpur', 'Kalihati', 'Madhupur', 'Mirzapur', 'Nagarpur', 'Sakhipur', 'Tangail Sadar'],
};

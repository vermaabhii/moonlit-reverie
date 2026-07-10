export type MenuCategory = 'coffee' | 'food' | 'pastries';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: MenuCategory;
  tag?: 'new' | 'staff-pick' | 'after-dark';
}

export const MENU_ITEMS: MenuItem[] = [
  {
    id: 'moon-latte',
    name: 'Moonlit Latte',
    description: 'Double espresso, steamed milk, a whisper of star anise.',
    price: 5.5,
    category: 'coffee',
    tag: 'staff-pick',
  },
  {
    id: 'dusk-cortado',
    name: 'Dusk Cortado',
    description: 'Equal parts espresso and warm milk, cut clean.',
    price: 4.75,
    category: 'coffee',
  },
  {
    id: 'diner-drip',
    name: 'Bottomless Diner Drip',
    description: 'Classic filter coffee, refills while you sit.',
    price: 3.25,
    category: 'coffee',
  },
  {
    id: 'nightowl-cold-brew',
    name: 'Night Owl Cold Brew',
    description: '20-hour steep, served over a single block of ice.',
    price: 5.0,
    category: 'coffee',
    tag: 'after-dark',
  },
  {
    id: 'honey-oat-mocha',
    name: 'Honey Oat Mocha',
    description: 'House cocoa, oat milk, local wildflower honey.',
    price: 5.75,
    category: 'coffee',
    tag: 'new',
  },
  {
    id: 'reverie-melt',
    name: 'Reverie Grilled Cheese Melt',
    description: 'Three cheeses, sourdough, rust-red tomato jam.',
    price: 9.0,
    category: 'food',
    tag: 'staff-pick',
  },
  {
    id: 'graveyard-scramble',
    name: 'Graveyard Shift Scramble',
    description: 'Soft scrambled eggs, chorizo, charred scallion, toast.',
    price: 11.5,
    category: 'food',
  },
  {
    id: 'diner-club',
    name: 'Classic Diner Club',
    description: 'Turkey, bacon, lettuce, tomato, triple-stacked rye.',
    price: 12.0,
    category: 'food',
  },
  {
    id: 'midnight-fries',
    name: 'Midnight Chili Cheese Fries',
    description: 'Hand-cut fries, slow-simmered chili, mustard cheese sauce.',
    price: 7.5,
    category: 'food',
    tag: 'after-dark',
  },
  {
    id: 'blueberry-stack',
    name: 'Blueberry Moon Stack',
    description: 'Three buttermilk pancakes, wild blueberry compote.',
    price: 9.5,
    category: 'food',
  },
  {
    id: 'cruller',
    name: 'Bebas Sugar Cruller',
    description: 'French cruller, vanilla bean glaze.',
    price: 3.5,
    category: 'pastries',
  },
  {
    id: 'rust-tart',
    name: 'Rust Belt Fig Tart',
    description: 'Brown butter frangipane, roasted fig, sea salt.',
    price: 4.5,
    category: 'pastries',
    tag: 'staff-pick',
  },
  {
    id: 'cinnamon-swirl',
    name: 'Cinnamon Swirl Bun',
    description: 'Laminated dough, brown sugar cinnamon, cream cheese icing.',
    price: 4.25,
    category: 'pastries',
    tag: 'new',
  },
  {
    id: 'mustard-scone',
    name: 'Cheddar Chive Scone',
    description: 'Sharp cheddar, cracked pepper, flaky lamination.',
    price: 3.75,
    category: 'pastries',
  },
];

export const HOURS: { day: string; hours: string }[] = [
  { day: 'Monday', hours: '6:30am – 10:00pm' },
  { day: 'Tuesday', hours: '6:30am – 10:00pm' },
  { day: 'Wednesday', hours: '6:30am – 10:00pm' },
  { day: 'Thursday', hours: '6:30am – 11:00pm' },
  { day: 'Friday', hours: '6:30am – 1:00am' },
  { day: 'Saturday', hours: '7:00am – 1:00am' },
  { day: 'Sunday', hours: '7:00am – 9:00pm' },
];

export const LOCATION = {
  address: '214 Ashbury Lane, Riverbend',
  phone: '(555) 014-0192',
};

export interface DemoUser {
  id: string;
  name: string;
  email: string;
  password: string;
}

export const DEMO_USER: DemoUser = {
  id: 'user-alex',
  name: 'Alex Rivera',
  email: 'alex@demo.moonlit',
  password: 'moonlit123',
};

export interface Reservation {
  id: string;
  userId: string;
  name: string;
  partySize: number;
  date: string; // ISO date
  time: string; // e.g. "19:30"
  notes?: string;
  confirmationCode: string;
}

export const SEED_RESERVATIONS: Reservation[] = [
  {
    id: 'res-seed-1',
    userId: DEMO_USER.id,
    name: 'Alex Rivera',
    partySize: 2,
    date: futureISODate(4),
    time: '19:30',
    notes: 'Window booth if possible',
    confirmationCode: 'MR-4821',
  },
  {
    id: 'res-seed-2',
    userId: DEMO_USER.id,
    name: 'Alex Rivera',
    partySize: 4,
    date: futureISODate(11),
    time: '12:00',
    confirmationCode: 'MR-1907',
  },
];

function futureISODate(daysAhead: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysAhead);
  return d.toISOString().slice(0, 10);
}

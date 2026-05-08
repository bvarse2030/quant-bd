/*
|-----------------------------------------
| setting up Data for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

export interface GeoPoint {
  lat: number;
  lng: number;
}

export interface LocationContact {
  email: string;
  phone: string;
  manager: string;
}

export interface OfficeLocation {
  id: string;
  name: string;
  type: 'Headquarters' | 'Research Lab' | 'Data Center';
  address: string;
  city: string;
  country: string;
  coordinates: GeoPoint;
  contact: LocationContact;
  image: string;
  description: string;
  features: string[];
  schedule: string;
}

export const defaultDataSection18: OfficeLocation[] = [
  {
    id: 'loc-nyc',
    name: 'Nexus Prime',
    type: 'Headquarters',
    address: '15 Hudson Yards, Level 88',
    city: 'New York',
    country: 'USA',
    coordinates: { lat: 40.7538, lng: -74.0022 },
    contact: {
      email: 'nyc@nexus.protocol',
      phone: '+1 (212) 555-0199',
      manager: 'Alex Mercer',
    },
    image: 'https://i.ibb.co.com/KpGnqS3D/nature.jpg',
    description: 'Our primary command center overlooking the Hudson. dedicated to quantum UI research and executive operations.',
    features: ['Executive Suites', 'Quantum Core', 'Rooftop Helipad'],
    schedule: 'Mon-Fri, 08:00 - 20:00 EST',
  },
  {
    id: 'loc-tokyo',
    name: 'Shibuya Node',
    type: 'Research Lab',
    address: 'Cerulean Tower, 26-1 Sakuragaokacho',
    city: 'Tokyo',
    country: 'Japan',
    coordinates: { lat: 35.6562, lng: 139.6993 },
    contact: {
      email: 'jp@nexus.protocol',
      phone: '+81 3-5550-2341',
      manager: 'Yuki Tanaka',
    },
    image: 'https://i.ibb.co.com/KpGnqS3D/nature.jpg',
    description: 'Advanced prototyping facility focused on haptic interfaces and neural link technologies.',
    features: ['Clean Room', 'Haptic Lab', 'Sleeping Pods'],
    schedule: 'Mon-Sat, 09:00 - 22:00 JST',
  },
  {
    id: 'loc-berlin',
    name: 'Kreuzberg Hub',
    type: 'Data Center',
    address: 'Köpenicker Str. 126',
    city: 'Berlin',
    country: 'Germany',
    coordinates: { lat: 52.5026, lng: 13.4346 },
    contact: {
      email: 'de@nexus.protocol',
      phone: '+49 30 555-0123',
      manager: 'Klaus Webber',
    },
    image: 'https://i.ibb.co.com/KpGnqS3D/nature.jpg',
    description: 'The backbone of our European infrastructure. Zero-latency edge computing facility.',
    features: ['Server Farm', 'Cooling Array', 'Bunker Access'],
    schedule: '24/7 Operational',
  },
];

export const mapStyles = {
  // Styles to make the iframe map look "dark mode"
  darkFilter: 'invert(100%) hue-rotate(180deg) brightness(95%) contrast(90%)',
};

export interface SchoolTenant {
  id: string;
  name: string;
  brandingColor: string;
  currency: string;
  timezone: string;
  logo: string;
  city: string;
}

export const SCHOOL_TENANTS: SchoolTenant[] = [
  {
    id: 'dakar',
    name: 'École 221 - Campus Dakar',
    brandingColor: 'from-[#B3181C] to-[#6B0E10]',
    currency: 'FCFA',
    timezone: 'GMT (Dakar/Sénégal)',
    logo: 'school',
    city: 'Dakar',
  },
  {
    id: 'saint-louis',
    name: 'École 221 - Campus Saint-Louis',
    brandingColor: 'from-[#1E3A8A] to-[#1E40AF]',
    currency: 'FCFA',
    timezone: 'GMT (Saint-Louis/Sénégal)',
    logo: 'account_balance',
    city: 'Saint-Louis',
  }
];

export const siteConfig = {
  name: 'Afghan Tours',
  legalName: 'James Tourist & Travel Agency',
  license: 'ATO-KBL-1617',
  tagline: 'Expert-Guided Tours to Afghanistan',
  description:
    'American-led, Kabul-based expedition operator offering planned tours across Afghanistan. Your safety is planned, not promised.',
  email: 'info@afghantours.com',
  phone: {
    display: '+93 780 123 456',
    number: '93780123456',
    url: 'tel:+93780123456',
  },
  whatsapp: {
    number: '93780123456',
    url: 'https://wa.me/93780123456',
  },
  office: {
    heading: 'James Tourist & Travel Agency',
    address: '2nd Floor, Majid Mall, Shahr-e-Naw, District 10, Kabul',
    mapsUrl:
      'https://www.google.com/maps/search/?api=1&query=Majid+Mall+Shahr-e-Naw+District+10+Kabul',
    mapsLabel: 'Open in Google Maps',
  },
  customTourPath: '/contact/?type=custom-tour',
} as const;

/** Build a WhatsApp deep link with an optional prefilled message. */
export function whatsappUrl(message?: string): string {
  const base = `https://wa.me/${siteConfig.whatsapp.number}`;
  if (!message?.trim()) return base;
  return `${base}?text=${encodeURIComponent(message.trim())}`;
}

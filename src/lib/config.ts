/**
 * Site config — reversible defaults only.
 * WhatsApp/phone: treat as UNVERIFIED until operator confirms (see docs/OPEN-BUSINESS-FACTS.md).
 * Do not change the published number without evidence.
 */
function resolveFormEndpoint(): string {
  const external =
    typeof import.meta !== 'undefined' &&
    import.meta.env &&
    typeof import.meta.env.PUBLIC_FORM_ENDPOINT === 'string'
      ? String(import.meta.env.PUBLIC_FORM_ENDPOINT).trim()
      : '';
  return external || '/tour-inquiry.php';
}

export const siteConfig = {
  name: 'Afghan Tours',
  tagline: 'Come for the history, stay for the hospitality.',
  positioning: 'Grounded, Kabul-Based, American-Led.',
  description:
    'Licensed Afghan tour operator — American-led, Afghan-operated, and based in Kabul. Practical journeys planned around current access, permits, and conditions.',
  email: 'info@afghantours.com',
  operator: 'James Tourist & Travel Agency',
  /** Tourism operator license — restored from PR #11 brand lock (ATO-KBL-1617). */
  license: 'ATO-KBL-1617',
  phone: {
    display: '+93-78-012-3456',
    number: '93780123456',
    url: 'tel:+93780123456',
  },
  whatsapp: {
    number: '93780123456',
    url: 'https://wa.me/93780123456',
  },
  /**
   * Inquiry submit dual path (cPanel):
   * - Default: `/tour-inquiry.php` (needs PHP execution on host)
   * - Override: set `PUBLIC_FORM_ENDPOINT` (Formspree / similar) for static-only hosts
   * PHP only works if the host executes PHP; static-only hosts need FORM_ENDPOINT / PUBLIC_FORM_ENDPOINT.
   */
  form: {
    phpPath: '/tour-inquiry.php',
    endpoint: resolveFormEndpoint(),
  },
};

export function getFormEndpoint(): string {
  return siteConfig.form.endpoint;
}

export function formUsesPhp(): boolean {
  const ep = siteConfig.form.endpoint;
  return ep === '/tour-inquiry.php' || ep.endsWith('/tour-inquiry.php');
}

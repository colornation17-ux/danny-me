/** Fast-cut hero beats — real UI + overlay motion per section. */

export const CW_SLIDES = [
  {
    id: 'pulse',
    src: '/work/competitor-watch/dashboard.png',
    label: 'Store pulse',
    caption: 'Revenue, basket & daily rhythm',
    access: 'owner',
    overlay: 'pulse',
    objectPosition: '50% 42%',
    duration: 1800,
  },
  {
    id: 'weekend',
    src: '/work/competitor-watch/guest-weekend.png',
    label: 'Weekend playbook',
    caption: 'Weather-driven push & skip',
    access: 'feature',
    overlay: 'weekend',
    objectPosition: '50% 38%',
    duration: 1600,
  },
  {
    id: 'forecast',
    src: '/work/competitor-watch/owner-forecast.png',
    label: 'Order guidance',
    caption: 'Buy / hold / reduce from POS',
    access: 'owner',
    overlay: 'forecast',
    objectPosition: '50% 55%',
    duration: 1800,
  },
  {
    id: 'crm',
    src: '/work/competitor-watch/owner-crm.png',
    label: 'Retention & CRM',
    caption: 'RFM segments · WhatsApp outreach',
    access: 'owner',
    overlay: 'crm',
    objectPosition: '50% 62%',
    duration: 1800,
  },
  {
    id: 'dashboard',
    src: '/work/competitor-watch/owner-dashboard.png',
    label: 'Dashboard',
    caption: 'Live competitor pricing at a glance',
    access: 'owner',
    overlay: 'market',
    objectPosition: '50% 28%',
    duration: 1500,
  },
]

export const ACCESS_LABELS = {
  owner: 'Owner',
  feature: '',
}

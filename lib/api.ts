const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8004';

export async function api(path: string, options: RequestInit = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('pg_token') : null;

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (response.status === 401 && typeof window !== 'undefined') {
    localStorage.removeItem('pg_token');
    window.location.href = '/portal/login';
  }

  return response;
}

// Provider types
export const PROVIDER_TYPES = [
  { value: 'aba_therapy', label: 'ABA Therapy' },
  { value: 'speech_therapy', label: 'Speech Therapy' },
  { value: 'occupational_therapy', label: 'Occupational Therapy' },
  { value: 'developmental_pediatrician', label: 'Developmental Pediatrician' },
  { value: 'neuropsychologist', label: 'Neuropsychologist' },
  { value: 'iep_advocate', label: 'IEP Advocate' },
  { value: 'special_ed_attorney', label: 'Special Ed Attorney' },
  { value: 'respite_care', label: 'Respite Care' },
  { value: 'social_skills_group', label: 'Social Skills Group' },
  { value: 'early_intervention', label: 'Early Intervention' },
];

// US States
export const US_STATES = [
  { value: 'AL', label: 'Alabama' }, { value: 'AK', label: 'Alaska' },
  { value: 'AZ', label: 'Arizona' }, { value: 'AR', label: 'Arkansas' },
  { value: 'CA', label: 'California' }, { value: 'CO', label: 'Colorado' },
  { value: 'CT', label: 'Connecticut' }, { value: 'DE', label: 'Delaware' },
  { value: 'FL', label: 'Florida' }, { value: 'GA', label: 'Georgia' },
  { value: 'HI', label: 'Hawaii' }, { value: 'ID', label: 'Idaho' },
  { value: 'IL', label: 'Illinois' }, { value: 'IN', label: 'Indiana' },
  { value: 'IA', label: 'Iowa' }, { value: 'KS', label: 'Kansas' },
  { value: 'KY', label: 'Kentucky' }, { value: 'LA', label: 'Louisiana' },
  { value: 'ME', label: 'Maine' }, { value: 'MD', label: 'Maryland' },
  { value: 'MA', label: 'Massachusetts' }, { value: 'MI', label: 'Michigan' },
  { value: 'MN', label: 'Minnesota' }, { value: 'MS', label: 'Mississippi' },
  { value: 'MO', label: 'Missouri' }, { value: 'MT', label: 'Montana' },
  { value: 'NE', label: 'Nebraska' }, { value: 'NV', label: 'Nevada' },
  { value: 'NH', label: 'New Hampshire' }, { value: 'NJ', label: 'New Jersey' },
  { value: 'NM', label: 'New Mexico' }, { value: 'NY', label: 'New York' },
  { value: 'NC', label: 'North Carolina' }, { value: 'ND', label: 'North Dakota' },
  { value: 'OH', label: 'Ohio' }, { value: 'OK', label: 'Oklahoma' },
  { value: 'OR', label: 'Oregon' }, { value: 'PA', label: 'Pennsylvania' },
  { value: 'RI', label: 'Rhode Island' }, { value: 'SC', label: 'South Carolina' },
  { value: 'SD', label: 'South Dakota' }, { value: 'TN', label: 'Tennessee' },
  { value: 'TX', label: 'Texas' }, { value: 'UT', label: 'Utah' },
  { value: 'VT', label: 'Vermont' }, { value: 'VA', label: 'Virginia' },
  { value: 'WA', label: 'Washington' }, { value: 'WV', label: 'West Virginia' },
  { value: 'WI', label: 'Wisconsin' }, { value: 'WY', label: 'Wyoming' },
];

// Lead tracking
export async function trackLead(providerId: number, data: {
  lead_type: 'contact_click' | 'phone_reveal' | 'website_click' | 'booking_click';
  source_page: 'search_results' | 'provider_profile';
}) {
  try {
    await fetch(`${API_URL}/api/leads/track/${providerId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  } catch (e) {
    console.error('Lead tracking failed:', e);
  }
}

// Search providers
export async function searchProviders(params: {
  city: string;
  state: string;
  provider_type: string;
}) {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${API_URL}/api/providers/search?${query}`);
  return res.json();
}

// Get provider details
export async function getProvider(id: number) {
  const res = await fetch(`${API_URL}/api/providers/${id}`);
  return res.json();
}

// Get provider lead stats (for claim banner)
export async function getProviderLeadStats(id: number) {
  const res = await fetch(`${API_URL}/api/leads/provider/${id}/stats`);
  return res.json();
}

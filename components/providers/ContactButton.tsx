'use client';

import { useState } from 'react';
import { Phone, Globe, Mail, Calendar } from 'lucide-react';
import { trackLead } from '@/lib/api';

interface ContactButtonProps {
  providerId: number;
  type: 'phone' | 'email' | 'website' | 'booking';
  value: string;
  sourcePage: 'search_results' | 'provider_profile';
}

export function ContactButton({ providerId, type, value, sourcePage }: ContactButtonProps) {
  const [revealed, setRevealed] = useState(false);

  const handleClick = async () => {
    const leadType = type === 'phone' ? 'phone_reveal' : `${type === 'website' ? 'website' : type === 'booking' ? 'booking' : 'contact'}_click`;
    await trackLead(providerId, {
      lead_type: leadType as 'contact_click' | 'phone_reveal' | 'website_click' | 'booking_click',
      source_page: sourcePage,
    });

    if (type === 'phone') {
      setRevealed(true);
    } else if (type === 'website' || type === 'booking') {
      window.open(value.startsWith('http') ? value : `https://${value}`, '_blank');
    } else if (type === 'email') {
      window.location.href = `mailto:${value}`;
    }
  };

  const icons = {
    phone: Phone,
    email: Mail,
    website: Globe,
    booking: Calendar,
  };

  const labels = {
    phone: revealed ? value : 'Show Phone',
    email: 'Email',
    website: 'Website',
    booking: 'Book Consult',
  };

  const Icon = icons[type];

  if (type === 'phone' && revealed) {
    return (
      <a
        href={`tel:${value}`}
        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl bg-[var(--color-teal)] text-white hover:bg-[var(--color-teal-dark)] transition-colors"
      >
        <Icon size={16} />
        {value}
      </a>
    );
  }

  return (
    <button
      onClick={handleClick}
      className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl transition-colors ${
        type === 'phone'
          ? 'bg-[var(--color-teal)] text-white hover:bg-[var(--color-teal-dark)]'
          : 'bg-[var(--color-cream-dark)] text-[var(--color-charcoal)] hover:bg-[var(--color-teal)]/10'
      }`}
    >
      <Icon size={16} />
      {labels[type]}
    </button>
  );
}

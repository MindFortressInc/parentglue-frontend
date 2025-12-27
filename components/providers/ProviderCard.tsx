'use client';

import Link from 'next/link';
import { MapPin, Phone, Globe, CheckCircle } from 'lucide-react';
import { ContactButton } from './ContactButton';

interface Provider {
  id: number;
  name: string;
  provider_type: string;
  address?: string;
  city: string;
  state: string;
  phone?: string;
  website?: string;
  verified?: boolean;
  accepting_new_clients?: boolean;
  specialties?: string[];
}

export function ProviderCard({ provider }: { provider: Provider }) {
  const typeLabels: Record<string, string> = {
    aba_therapy: 'ABA Therapy',
    speech_therapy: 'Speech Therapy',
    occupational_therapy: 'Occupational Therapy',
    developmental_pediatrician: 'Developmental Pediatrician',
    neuropsychologist: 'Neuropsychologist',
    iep_advocate: 'IEP Advocate',
    special_ed_attorney: 'Special Ed Attorney',
  };

  return (
    <div className="card-hover bg-white rounded-2xl p-6 shadow-[var(--shadow-soft)]">
      <div className="flex justify-between items-start mb-3">
        <div>
          <Link
            href={`/provider/${provider.id}`}
            className="text-lg font-display font-semibold text-[var(--color-charcoal)] hover:text-[var(--color-teal)] transition-colors"
          >
            {provider.name}
          </Link>
          <div className="flex items-center gap-2 mt-1">
            <span className="inline-block px-2 py-0.5 text-xs font-medium rounded-full bg-[var(--color-teal)]/10 text-[var(--color-teal-dark)]">
              {typeLabels[provider.provider_type] || provider.provider_type}
            </span>
            {provider.verified && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full bg-[var(--color-success)]/20 text-[#4A7A5A]">
                <CheckCircle size={12} />
                Verified
              </span>
            )}
          </div>
        </div>
        {provider.accepting_new_clients && (
          <span className="px-2 py-1 text-xs font-semibold rounded-lg bg-[var(--color-coral)]/20 text-[#8B5A3C]">
            Accepting Clients
          </span>
        )}
      </div>

      <div className="flex items-center gap-1.5 text-sm text-[var(--color-charcoal-light)] mb-4">
        <MapPin size={14} />
        <span>{provider.city}, {provider.state}</span>
      </div>

      {provider.specialties && provider.specialties.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {provider.specialties.slice(0, 3).map((s) => (
            <span
              key={s}
              className="px-2 py-0.5 text-xs rounded-md bg-[var(--color-cream-dark)] text-[var(--color-charcoal-light)]"
            >
              {s}
            </span>
          ))}
          {provider.specialties.length > 3 && (
            <span className="text-xs text-[var(--color-charcoal-light)]">
              +{provider.specialties.length - 3} more
            </span>
          )}
        </div>
      )}

      <div className="flex gap-2 pt-3 border-t border-[var(--color-cream-dark)]">
        {provider.phone && (
          <ContactButton
            providerId={provider.id}
            type="phone"
            value={provider.phone}
            sourcePage="search_results"
          />
        )}
        {provider.website && (
          <ContactButton
            providerId={provider.id}
            type="website"
            value={provider.website}
            sourcePage="search_results"
          />
        )}
        <Link
          href={`/provider/${provider.id}`}
          className="ml-auto px-4 py-2 text-sm font-semibold text-[var(--color-teal)] hover:text-[var(--color-teal-dark)] transition-colors"
        >
          View Profile →
        </Link>
      </div>
    </div>
  );
}

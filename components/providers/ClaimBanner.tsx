'use client';

import Link from 'next/link';
import { Building2, TrendingUp } from 'lucide-react';

interface ClaimBannerProps {
  providerId: number;
  leadsLast30Days: number;
}

export function ClaimBanner({ providerId, leadsLast30Days }: ClaimBannerProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[var(--color-teal)] to-[var(--color-teal-dark)] p-6 text-white">
      {/* Decorative blob */}
      <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
      <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-[var(--color-coral)]/20 rounded-full blur-2xl" />

      <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-white/20 rounded-xl">
            <Building2 size={24} />
          </div>
          <div>
            <h3 className="font-display text-xl font-semibold mb-1">
              Is this your practice?
            </h3>
            <p className="text-white/80 text-sm max-w-md">
              {leadsLast30Days > 0 ? (
                <>
                  <span className="inline-flex items-center gap-1 font-semibold text-white">
                    <TrendingUp size={14} />
                    {leadsLast30Days} parents
                  </span>{' '}
                  viewed your listing in the last 30 days. Claim it to respond to inquiries.
                </>
              ) : (
                'Claim your listing to manage your profile, see analytics, and respond to parent inquiries.'
              )}
            </p>
          </div>
        </div>

        <Link
          href={`/portal/login?claim=${providerId}`}
          className="inline-flex items-center justify-center px-6 py-3 font-semibold text-[var(--color-teal-dark)] bg-white rounded-xl hover:bg-[var(--color-cream)] transition-colors shadow-lg"
        >
          Claim This Listing
        </Link>
      </div>
    </div>
  );
}

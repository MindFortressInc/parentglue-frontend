'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Search, Filter, Loader2 } from 'lucide-react';
import { searchProviders, PROVIDER_TYPES, US_STATES } from '@/lib/api';
import { ProviderCard } from '@/components/providers/ProviderCard';

function SearchContent() {
  const searchParams = useSearchParams();
  const [city, setCity] = useState(searchParams.get('city') || '');
  const [state, setState] = useState(searchParams.get('state') || '');
  const [providerType, setProviderType] = useState(searchParams.get('provider_type') || '');
  const [providers, setProviders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (searchParams.get('city') && searchParams.get('state') && searchParams.get('provider_type')) {
      handleSearch();
    }
  }, []);

  const handleSearch = async () => {
    if (!city || !state || !providerType) return;
    setLoading(true);
    setSearched(true);
    try {
      const result = await searchProviders({ city, state, provider_type: providerType });
      setProviders(result.providers || []);
    } catch (e) {
      console.error('Search failed:', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Nav */}
      <nav className="bg-white border-b border-[var(--color-cream-dark)]">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="font-display text-2xl font-semibold text-[var(--color-teal)]">
            Parent<span className="text-[var(--color-coral)]">Glue</span>
          </Link>
          <Link
            href="/portal/login"
            className="text-sm font-semibold px-4 py-2 rounded-xl bg-[var(--color-teal)] text-white hover:bg-[var(--color-teal-dark)] transition-colors"
          >
            Provider Login
          </Link>
        </div>
      </nav>

      {/* Search Form */}
      <div className="bg-white border-b border-[var(--color-cream-dark)] py-6">
        <div className="max-w-6xl mx-auto px-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
            className="flex flex-col md:flex-row gap-4"
          >
            <div className="flex-1">
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="City"
                className="w-full px-4 py-3 rounded-xl border-2 border-[var(--color-cream-dark)] focus:border-[var(--color-teal)] focus:outline-none"
              />
            </div>
            <div className="w-full md:w-40">
              <select
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-[var(--color-cream-dark)] focus:border-[var(--color-teal)] focus:outline-none bg-white"
              >
                <option value="">State</option>
                {US_STATES.map((s) => (
                  <option key={s.value} value={s.value}>{s.value}</option>
                ))}
              </select>
            </div>
            <div className="w-full md:w-52">
              <select
                value={providerType}
                onChange={(e) => setProviderType(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-[var(--color-cream-dark)] focus:border-[var(--color-teal)] focus:outline-none bg-white"
              >
                <option value="">Service Type</option>
                {PROVIDER_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[var(--color-teal)] text-white font-semibold hover:bg-[var(--color-teal-dark)] transition-colors disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : <Search size={18} />}
              Search
            </button>
          </form>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="animate-spin text-[var(--color-teal)] mb-4" size={40} />
            <p className="text-[var(--color-charcoal-light)]">Searching for providers...</p>
          </div>
        )}

        {!loading && searched && providers.length === 0 && (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-full bg-[var(--color-cream-dark)] flex items-center justify-center mx-auto mb-4">
              <Filter size={24} className="text-[var(--color-charcoal-light)]" />
            </div>
            <h3 className="font-display text-xl font-semibold text-[var(--color-charcoal)] mb-2">
              No providers found
            </h3>
            <p className="text-[var(--color-charcoal-light)] max-w-md mx-auto">
              Try expanding your search to nearby cities or different service types.
            </p>
          </div>
        )}

        {!loading && providers.length > 0 && (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-2xl font-semibold text-[var(--color-charcoal)]">
                {providers.length} provider{providers.length !== 1 ? 's' : ''} found
              </h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {providers.map((provider) => (
                <ProviderCard key={provider.id} provider={provider} />
              ))}
            </div>
          </>
        )}

        {!searched && (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-full bg-[var(--color-teal)]/10 flex items-center justify-center mx-auto mb-4">
              <Search size={24} className="text-[var(--color-teal)]" />
            </div>
            <h3 className="font-display text-xl font-semibold text-[var(--color-charcoal)] mb-2">
              Find the right provider
            </h3>
            <p className="text-[var(--color-charcoal-light)] max-w-md mx-auto">
              Enter your city, state, and the type of service you&apos;re looking for to get started.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin" size={40} /></div>}>
      <SearchContent />
    </Suspense>
  );
}

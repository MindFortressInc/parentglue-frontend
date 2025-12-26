"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--background)] bg-texture overflow-hidden">
      {/* Decorative background blobs */}
      <div className="blob w-[300px] h-[300px] bg-[var(--color-primary)] top-[-100px] right-[-100px] fixed opacity-[0.04]" />
      <div className="blob w-[400px] h-[400px] bg-[var(--color-accent)] bottom-[20%] left-[-150px] fixed opacity-[0.03]" />

      {/* Hero Section */}
      <header className="px-5 pt-14 pb-10 text-center relative">
        {/* Location pill */}
        <div className="animate-fade-in-up">
          <div className="location-pill mb-5 inline-flex">
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span>CA Focused — national support coming soon</span>
          </div>
        </div>

        {/* Main heading */}
        <h1 className="text-[2.25rem] leading-[1.15] font-bold tracking-tight mb-4 animate-fade-in-up delay-100">
          Your child's journey,
          <br />
          <span className="text-[var(--color-primary)]">organized.</span>
        </h1>

        {/* Tagline */}
        <p className="text-lg text-[var(--muted)] max-w-sm mx-auto animate-fade-in-up delay-200">
          Never miss a deadline.
          <br />
          Never miss a resource.
        </p>
      </header>

      {/* Feature Cards */}
      <section className="px-5 pb-8">
        <div className="space-y-3 max-w-md mx-auto">
          {/* Regional Center */}
          <div
            className="feature-card animate-fade-in-up delay-200"
            style={{ "--accent-color": "var(--color-rc)" } as React.CSSProperties}
          >
            <div className="flex items-start gap-3">
              <div className="icon-container rc">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3H21"
                  />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-[0.95rem]">Regional Center</h3>
                <p className="text-sm text-[var(--muted)] leading-relaxed">
                  IPP meetings, service authorizations & eligibility renewals
                </p>
              </div>
            </div>
          </div>

          {/* School IEP */}
          <div
            className="feature-card animate-fade-in-up delay-300"
            style={{ "--accent-color": "var(--color-school)" } as React.CSSProperties}
          >
            <div className="flex items-start gap-3">
              <div className="icon-container school">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5"
                  />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-[0.95rem]">School IEP</h3>
                <p className="text-sm text-[var(--muted)] leading-relaxed">
                  Annual reviews, triennial evals & transition planning
                </p>
              </div>
            </div>
          </div>

          {/* Insurance & Therapy */}
          <div
            className="feature-card animate-fade-in-up delay-400"
            style={{ "--accent-color": "var(--color-therapy)" } as React.CSSProperties}
          >
            <div className="flex items-start gap-3">
              <div className="icon-container therapy">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                  />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-[0.95rem]">Insurance & ABA</h3>
                <p className="text-sm text-[var(--muted)] leading-relaxed">
                  Authorization renewals & therapy schedules
                </p>
              </div>
            </div>
          </div>

          {/* Life Transitions */}
          <div
            className="feature-card animate-fade-in-up delay-500"
            style={{ "--accent-color": "var(--color-life)" } as React.CSSProperties}
          >
            <div className="flex items-start gap-3">
              <div className="icon-container life">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6"
                  />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-[0.95rem]">Life Transitions</h3>
                <p className="text-sm text-[var(--muted)] leading-relaxed">
                  Age 3, kindergarten, middle school & adult services
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Preview */}
      <section className="px-5 pb-10 animate-fade-in-up delay-500">
        <div className="max-w-md mx-auto">
          <h2 className="text-center text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-4">
            Your Personalized Timeline
          </h2>
          <div className="card bg-gradient-to-br from-[var(--card-bg)] to-[var(--background-warm)] border-[var(--border)]">
            {/* Timeline items */}
            <div className="space-y-0">
              <div className="timeline-preview-item">
                <div className="timeline-dot urgent animate-pulse-soft" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">ABA Authorization Renewal</p>
                  <p className="text-xs text-[var(--color-danger)]">Due in 2 weeks</p>
                </div>
                <span className="badge badge-therapy">Therapy</span>
              </div>

              <div className="timeline-preview-item">
                <div className="timeline-dot soon" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">Annual IEP Review</p>
                  <p className="text-xs text-[var(--color-warning)]">Due in 6 weeks</p>
                </div>
                <span className="badge badge-school">School</span>
              </div>

              <div className="timeline-preview-item">
                <div className="timeline-dot upcoming" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">IPP Annual Meeting</p>
                  <p className="text-xs text-[var(--muted)]">Due in 3 months</p>
                </div>
                <span className="badge badge-rc">RC</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-5 pb-12 animate-fade-in-up delay-600">
        <div className="max-w-md mx-auto space-y-3">
          <Link
            href="/onboarding"
            className="btn btn-primary w-full text-center block"
          >
            Get Started — It's Free
          </Link>
          <Link
            href="/demo"
            className="btn btn-secondary w-full text-center block"
          >
            See Demo Timeline
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-5 py-8 text-center border-t border-[var(--border)]">
        <p className="text-sm text-[var(--muted)]">
          Built for California families navigating special needs services.
        </p>
        <p className="text-sm text-[var(--muted)] mt-1 font-medium">
          Created by parents who get it
        </p>
      </footer>
    </div>
  );
}

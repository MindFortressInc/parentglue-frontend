"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api, { Resource } from "@/lib/api";

export default function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    []
  );
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedResource, setExpandedResource] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [resourcesData, categoriesData] = await Promise.all([
        api.getResources(),
        api.getResourceCategories(),
      ]);
      setResources(resourcesData.resources);
      setCategories(categoriesData.categories);
    } catch (err) {
      console.error("Failed to load resources:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredResources = activeCategory
    ? resources.filter((r) => r.category === activeCategory)
    : resources;

  const getCategoryStyle = (category: string) => {
    const styles: Record<string, string> = {
      regional_center: "badge-rc",
      iep: "badge-school",
      aba: "badge-therapy",
      speech: "badge-therapy",
      ot: "badge-therapy",
      insurance: "badge-insurance",
      advocacy: "badge-life",
      support: "badge-life",
    };
    return styles[category] || "badge-rc";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[var(--muted)]">Loading resources...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)] pb-20">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-[var(--background)] border-b border-[var(--border)] px-4 py-4">
        <div className="max-w-md mx-auto">
          <h1 className="text-xl font-bold">Resources</h1>
          <p className="text-sm text-[var(--muted)]">
            Guides, contacts, and helpful information
          </p>
        </div>
      </header>

      {/* Category filters */}
      <div className="px-4 py-3 overflow-x-auto border-b border-[var(--border)]">
        <div className="flex gap-2 max-w-md mx-auto">
          <button
            onClick={() => setActiveCategory(null)}
            className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors ${
              activeCategory === null
                ? "bg-[var(--color-primary)] text-white"
                : "bg-[var(--border)] text-[var(--muted)]"
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors ${
                activeCategory === cat.id
                  ? "bg-[var(--color-primary)] text-white"
                  : "bg-[var(--border)] text-[var(--muted)]"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Find Provider CTA */}
      <div className="px-4 py-4 max-w-md mx-auto">
        <Link
          href="/search"
          className="block p-4 rounded-2xl bg-gradient-to-r from-[var(--color-teal)] to-[var(--color-teal-dark)] text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold">Find Local Providers</p>
              <p className="text-sm text-white/80">ABA, speech therapy, OT & more near you</p>
            </div>
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </Link>
      </div>

      {/* Resources list */}
      <main className="px-4 pb-4 max-w-md mx-auto">
        <div className="space-y-4">
          {filteredResources.map((resource) => (
            <div
              key={resource.id}
              className="card cursor-pointer"
              onClick={() =>
                setExpandedResource(
                  expandedResource === resource.id ? null : resource.id
                )
              }
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="font-semibold">{resource.title}</h3>
                <span className={`badge ${getCategoryStyle(resource.category)}`}>
                  {resource.category.replace(/_/g, " ")}
                </span>
              </div>
              <p className="text-sm text-[var(--muted)]">{resource.summary}</p>

              {expandedResource === resource.id && (
                <div className="mt-4 pt-4 border-t border-[var(--border)]">
                  {/* Quick Facts */}
                  {resource.quick_facts && resource.quick_facts.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-xs font-semibold uppercase text-[var(--muted)] mb-2">
                        Quick Facts
                      </h4>
                      <ul className="space-y-2">
                        {resource.quick_facts.map((fact, i) => (
                          <li
                            key={i}
                            className="text-sm flex items-start gap-2"
                          >
                            <span className="text-[var(--color-primary)] mt-1">
                              •
                            </span>
                            {fact}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Tips */}
                  {resource.tips && resource.tips.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-xs font-semibold uppercase text-[var(--muted)] mb-2">
                        Tips
                      </h4>
                      <ul className="space-y-2">
                        {resource.tips.map((tip, i) => (
                          <li
                            key={i}
                            className="text-sm flex items-start gap-2 text-amber-700 dark:text-amber-300"
                          >
                            <span className="mt-1">💡</span>
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Key Contacts */}
                  {resource.key_contacts &&
                    Object.keys(resource.key_contacts).length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-xs font-semibold uppercase text-[var(--muted)] mb-2">
                          Key Contacts
                        </h4>
                        <div className="space-y-2">
                          {Object.entries(resource.key_contacts).map(
                            ([name, contact]) => (
                              <div
                                key={name}
                                className="flex items-center justify-between text-sm"
                              >
                                <span className="text-[var(--muted)]">
                                  {name}
                                </span>
                                <a
                                  href={
                                    contact.startsWith("http")
                                      ? contact
                                      : contact.match(/^\d/)
                                      ? `tel:${contact.replace(/\D/g, "")}`
                                      : `https://${contact}`
                                  }
                                  className="text-[var(--color-primary)] font-medium"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  {contact}
                                </a>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}

                  {/* Timeline */}
                  {resource.timeline && resource.timeline.length > 0 && (
                    <div>
                      <h4 className="text-xs font-semibold uppercase text-[var(--muted)] mb-2">
                        Timeline
                      </h4>
                      <div className="space-y-2">
                        {resource.timeline.map((item, i) => (
                          <div
                            key={i}
                            className="flex items-start gap-3 text-sm"
                          >
                            <span className="font-medium text-[var(--color-primary)] whitespace-nowrap">
                              {item.age}
                            </span>
                            <span className="text-[var(--muted)]">
                              {item.action}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </main>

      {/* Bottom navigation */}
      <nav className="mobile-nav">
        <Link href="/timeline" className="nav-item">
          <svg
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          Timeline
        </Link>
        <Link href="/search" className="nav-item">
          <svg
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          Providers
        </Link>
        <Link href="/resources" className="nav-item active">
          <svg
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
          Resources
        </Link>
        <Link href="/letters" className="nav-item">
          <svg
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          Letters
        </Link>
      </nav>
    </div>
  );
}

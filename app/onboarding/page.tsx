"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api, {
  DiagnosisStatus,
  RegionalCenterStatus,
  SchoolStatus,
  InsuranceType,
} from "@/lib/api";

type Step = 1 | 2 | 3;

interface FormData {
  // Step 1
  name: string;
  date_of_birth: string;
  county: string;
  // Step 2
  diagnosis_status: DiagnosisStatus;
  diagnosis_date: string;
  // Step 3
  rc_status: RegionalCenterStatus;
  school_status: SchoolStatus;
  insurance_type: InsuranceType;
}

const COUNTIES = [
  "Sacramento",
  "Placer",
  "El Dorado",
  "Yolo",
  "Nevada",
  "Yuba",
  "Sutter",
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<FormData>({
    name: "",
    date_of_birth: "",
    county: "Sacramento",
    diagnosis_status: "diagnosed",
    diagnosis_date: "",
    rc_status: "not_connected",
    school_status: "not_school_age",
    insurance_type: "private_fully_insured",
  });

  const updateForm = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError(null);
  };

  const handleNext = async () => {
    if (step < 3) {
      setStep((step + 1) as Step);
    } else {
      await handleSubmit();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((step - 1) as Step);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await api.completeOnboarding(
        {
          name: formData.name,
          date_of_birth: formData.date_of_birth,
          county: formData.county,
        },
        {
          diagnosis_status: formData.diagnosis_status,
          diagnosis_date: formData.diagnosis_date || undefined,
        },
        {
          rc_status: formData.rc_status,
          school_status: formData.school_status,
          insurance_type: formData.insurance_type,
        }
      );

      // Store profile in localStorage for now
      localStorage.setItem("childProfile", JSON.stringify(result.profile));
      localStorage.setItem(
        "immediateActions",
        JSON.stringify(result.immediate_actions)
      );

      router.push("/timeline");
    } catch (err) {
      setError("Something went wrong. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)] pb-nav">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-[var(--background)] border-b border-[var(--border)] px-4 py-3">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="text-[var(--muted)] hover:text-[var(--foreground)]"
          >
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </Link>
          <div className="text-sm font-medium">Step {step} of 3</div>
          <div className="w-6" /> {/* Spacer */}
        </div>
      </header>

      {/* Progress bar */}
      <div className="h-1 bg-[var(--border)]">
        <div
          className="h-full bg-[var(--color-primary)] transition-all duration-300"
          style={{ width: `${(step / 3) * 100}%` }}
        />
      </div>

      {/* Form content */}
      <main className="px-4 py-6 max-w-md mx-auto">
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 text-sm">
            {error}
          </div>
        )}

        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold mb-2">Let's get started</h1>
              <p className="text-[var(--muted)]">
                Tell us about your child so we can personalize their timeline.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Child's first name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => updateForm("name", e.target.value)}
                  placeholder="Enter name"
                  className="input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Date of birth
                </label>
                <input
                  type="date"
                  value={formData.date_of_birth}
                  onChange={(e) => updateForm("date_of_birth", e.target.value)}
                  className="input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">County</label>
                <select
                  value={formData.county}
                  onChange={(e) => updateForm("county", e.target.value)}
                  className="input"
                >
                  {COUNTIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-xs text-[var(--muted)]">
                  Currently serving Alta California Regional Center area
                </p>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold mb-2">Diagnosis status</h1>
              <p className="text-[var(--muted)]">
                Where are you in the diagnosis journey?
              </p>
            </div>

            <div className="space-y-3">
              {[
                {
                  value: "suspected" as DiagnosisStatus,
                  label: "Suspecting autism",
                  desc: "Haven't started evaluation yet",
                },
                {
                  value: "in_evaluation" as DiagnosisStatus,
                  label: "In evaluation",
                  desc: "Currently being assessed",
                },
                {
                  value: "diagnosed" as DiagnosisStatus,
                  label: "Autism diagnosed",
                  desc: "Have an official diagnosis",
                },
                {
                  value: "diagnosed_other" as DiagnosisStatus,
                  label: "Other diagnosis",
                  desc: "Developmental delay, speech delay, etc.",
                },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => updateForm("diagnosis_status", option.value)}
                  className={`w-full text-left p-4 rounded-lg border transition-all ${
                    formData.diagnosis_status === option.value
                      ? "border-[var(--color-primary)] bg-indigo-50 dark:bg-indigo-900/20"
                      : "border-[var(--border)] hover:border-[var(--color-primary-light)]"
                  }`}
                >
                  <div className="font-medium">{option.label}</div>
                  <div className="text-sm text-[var(--muted)]">
                    {option.desc}
                  </div>
                </button>
              ))}
            </div>

            {formData.diagnosis_status === "diagnosed" && (
              <div>
                <label className="block text-sm font-medium mb-2">
                  Diagnosis date (optional)
                </label>
                <input
                  type="date"
                  value={formData.diagnosis_date}
                  onChange={(e) => updateForm("diagnosis_date", e.target.value)}
                  className="input"
                />
              </div>
            )}
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold mb-2">Current services</h1>
              <p className="text-[var(--muted)]">
                Help us understand what support you already have.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Regional Center status
              </label>
              <select
                value={formData.rc_status}
                onChange={(e) =>
                  updateForm("rc_status", e.target.value as RegionalCenterStatus)
                }
                className="input"
              >
                <option value="not_connected">Not connected yet</option>
                <option value="intake_pending">Intake scheduled/pending</option>
                <option value="in_evaluation">Being evaluated</option>
                <option value="eligible">Eligible & receiving services</option>
                <option value="not_eligible">Not eligible</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                School/IEP status
              </label>
              <select
                value={formData.school_status}
                onChange={(e) =>
                  updateForm("school_status", e.target.value as SchoolStatus)
                }
                className="input"
              >
                <option value="not_school_age">Not school age yet</option>
                <option value="no_iep">In school, no IEP</option>
                <option value="evaluation_pending">IEP evaluation pending</option>
                <option value="has_iep">Has IEP</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Insurance</label>
              <select
                value={formData.insurance_type}
                onChange={(e) =>
                  updateForm("insurance_type", e.target.value as InsuranceType)
                }
                className="input"
              >
                <option value="private_fully_insured">
                  Private insurance (fully insured)
                </option>
                <option value="private_self_funded">
                  Private insurance (self-funded/ERISA)
                </option>
                <option value="medi_cal">Medi-Cal</option>
                <option value="regional_center_only">Regional Center only</option>
                <option value="none">No insurance</option>
              </select>
              <p className="mt-1 text-xs text-[var(--muted)]">
                This helps us know which coverage laws apply to you
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Bottom navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-[var(--card-bg)] border-t border-[var(--border)] p-4 safe-bottom">
        <div className="max-w-md mx-auto flex gap-3">
          {step > 1 && (
            <button onClick={handleBack} className="btn btn-secondary flex-1">
              Back
            </button>
          )}
          <button
            onClick={handleNext}
            disabled={
              loading ||
              (step === 1 && (!formData.name || !formData.date_of_birth))
            }
            className="btn btn-primary flex-1 disabled:opacity-50"
          >
            {loading ? "Loading..." : step === 3 ? "See My Timeline" : "Continue"}
          </button>
        </div>
      </div>
    </div>
  );
}

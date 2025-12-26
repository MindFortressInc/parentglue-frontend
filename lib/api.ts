/**
 * API client for ParentGlue backend
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8004";

export interface ChildProfile {
  id?: string;
  name: string;
  date_of_birth: string;
  county: string;
  regional_center?: string;
  diagnosis_status: DiagnosisStatus;
  diagnosis_date?: string;
  rc_status: RegionalCenterStatus;
  current_ipp_date?: string;
  school_status: SchoolStatus;
  current_iep_date?: string;
  insurance_type: InsuranceType;
  insurance_carrier?: string;
  has_aba?: boolean;
  aba_auth_expiry?: string;
  has_speech?: boolean;
  has_ot?: boolean;
}

export type DiagnosisStatus =
  | "suspected"
  | "in_evaluation"
  | "diagnosed"
  | "diagnosed_other";

export type RegionalCenterStatus =
  | "not_connected"
  | "intake_pending"
  | "in_evaluation"
  | "eligible"
  | "not_eligible";

export type SchoolStatus =
  | "not_school_age"
  | "no_iep"
  | "evaluation_pending"
  | "has_iep";

export type InsuranceType =
  | "private_fully_insured"
  | "private_self_funded"
  | "medi_cal"
  | "regional_center_only"
  | "none";

export interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  due_date?: string;
  category: string;
  priority: string;
  status: string;
  action_items: string[];
  resources: string[];
}

export interface Timeline {
  child_name: string;
  generated_at: string;
  overdue: TimelineEvent[];
  due_soon: TimelineEvent[];
  upcoming: TimelineEvent[];
  completed: TimelineEvent[];
  total_events: number;
  next_action?: TimelineEvent;
}

export interface OnboardingStep1 {
  name: string;
  date_of_birth: string;
  county: string;
}

export interface OnboardingStep2 {
  diagnosis_status: DiagnosisStatus;
  diagnosis_date?: string;
}

export interface OnboardingStep3 {
  rc_status: RegionalCenterStatus;
  school_status: SchoolStatus;
  insurance_type: InsuranceType;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE) {
    this.baseUrl = baseUrl;
  }

  private async fetch<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return response.json();
  }

  // Onboarding endpoints
  async startOnboarding(step1: OnboardingStep1) {
    return this.fetch<{
      profile: Partial<ChildProfile>;
      age: { years: number; months: number; description: string };
      regional_center_info: { code: string; name: string; phone?: string };
      next_step: string;
    }>("/api/onboarding/start", {
      method: "POST",
      body: JSON.stringify(step1),
    });
  }

  async setDiagnosis(step1: OnboardingStep1, step2: OnboardingStep2) {
    return this.fetch<{
      profile: Partial<ChildProfile>;
      guidance: { title: string; message: string; actions: string[] };
      next_step: string;
    }>("/api/onboarding/diagnosis", {
      method: "POST",
      body: JSON.stringify({ ...step1, ...step2 }),
    });
  }

  async completeOnboarding(
    step1: OnboardingStep1,
    step2: OnboardingStep2,
    step3: OnboardingStep3
  ) {
    return this.fetch<{
      profile: ChildProfile;
      immediate_actions: string[];
      timeline_preview: TimelineEvent[];
    }>("/api/onboarding/complete", {
      method: "POST",
      body: JSON.stringify({ ...step1, ...step2, ...step3 }),
    });
  }

  async getCounties() {
    return this.fetch<{
      counties: { name: string; regional_center: string }[];
      note: string;
    }>("/api/onboarding/counties");
  }

  // Timeline endpoints
  async generateTimeline(profile: ChildProfile): Promise<Timeline> {
    return this.fetch<Timeline>("/api/timeline/generate", {
      method: "POST",
      body: JSON.stringify(profile),
    });
  }

  async getTimelinePreview(profile: ChildProfile) {
    return this.fetch<{
      child_name: string;
      total_events: number;
      overdue_count: number;
      next_action?: TimelineEvent;
      preview: TimelineEvent[];
    }>("/api/timeline/preview", {
      method: "POST",
      body: JSON.stringify(profile),
    });
  }

  async getDemoTimeline(): Promise<Timeline> {
    return this.fetch<Timeline>("/api/timeline/demo");
  }

  // Resources endpoints
  async getResources(category?: string) {
    const url = category
      ? `/api/resources/?category=${category}`
      : "/api/resources/";
    return this.fetch<{ count: number; resources: Resource[] }>(url);
  }

  async getResource(resourceId: string) {
    return this.fetch<Resource>(`/api/resources/${resourceId}`);
  }

  async getResourceCategories() {
    return this.fetch<{
      categories: { id: string; name: string }[];
    }>("/api/resources/categories/list");
  }

  async getAbaProviders(county: string = "sacramento") {
    return this.fetch<{
      county: string;
      provider_type: string;
      count: number;
      providers: Provider[];
      note: string;
    }>(`/api/resources/providers/aba?county=${county}`);
  }

  // Document/Letter endpoints
  async getLetterTemplates() {
    return this.fetch<{
      count: number;
      categories: string[];
      templates: LetterTemplate[];
      by_category: Record<string, LetterTemplate[]>;
    }>("/api/documents/templates");
  }

  async getLetterTemplate(templateType: string) {
    return this.fetch<LetterTemplate & { field_hints: Record<string, FieldHint> }>(
      `/api/documents/templates/${templateType}`
    );
  }

  async generateLetter(request: LetterRequest) {
    return this.fetch<GeneratedLetter>("/api/documents/generate", {
      method: "POST",
      body: JSON.stringify(request),
    });
  }
}

export interface Resource {
  id: string;
  title: string;
  category: string;
  summary: string;
  content_path?: string;
  quick_facts?: string[];
  key_contacts?: Record<string, string>;
  tips?: string[];
  timeline?: { age: string; action: string }[];
}

export interface Provider {
  name: string;
  type: string;
  address?: string;
  phone?: string;
  website?: string;
  accepts_insurance?: boolean;
  notes?: string;
}

// Letter/Document types
export type LetterType =
  | "iep_evaluation_request"
  | "iep_meeting_request"
  | "prior_written_notice_request"
  | "iee_request"
  | "rc_intake_request"
  | "insurance_appeal"
  | "aba_auth_request"
  | "records_request"
  | "esy_request";

export interface LetterTemplate {
  type: LetterType;
  title: string;
  description: string;
  category: string;
  urgency_note: string;
  legal_basis: string;
}

export interface LetterRequest {
  letter_type: LetterType;
  profile: ChildProfile;
  parent_name: string;
  parent_address?: string;
  // Optional context fields
  concerns?: string;
  reason?: string;
  request_denied?: string;
  evaluation_area?: string;
  disagreement?: string;
  denial_reason?: string;
  service_denied?: string;
  hours_requested?: string;
  regression_evidence?: string;
}

export interface GeneratedLetter {
  letter_type: string;
  title: string;
  content: string;
  generated_at: string;
  child_name: string;
  instructions: string;
  legal_basis: string;
}

export interface FieldHint {
  label: string;
  placeholder: string;
  required: boolean;
}

export const api = new ApiClient();
export default api;

export interface ICandidatePreview {
  id: string;
  portrait: string;
  first: string;
  last: string;
  summary: string;
}

export interface ICandidateFull {
  id: string;
  portrait: string;
  first: string;
  last: string;
  description: string;
  title: string;
  images: string[];
  summary: string;
  dob: number;
}

export interface ICandidateResult {
  candidate_id: string;
  portrait: string;
  first_name: string;
  last_name: string;
  title: string;
  images: string[];
  description: string;
  summary: string;
  dob: number;
}

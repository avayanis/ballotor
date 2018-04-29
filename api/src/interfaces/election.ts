export interface IElectionResult {
  election_id: string;
  election_title: string;
  election_description: string;
  election_end_date: number;
}

export interface IElection {
  id: string;
  title: string;
  description: string;
  end_date: number;
}

export interface IElectionCandidateResult {
  election_id: string;
  candidate_id: string;
}

export type ApplicationStatus = 'pending' | 'approved' | 'rejected';

export interface University {
  id: number;
  code: string;
  name: string;
  address: string;
  active: boolean;
}

export interface Major {
  id: number;
  universityId: number;
  code: string;
  name: string;
  quota: number;
  active: boolean;
}

export interface AdmissionSubjectGroup {
  id: number;
  majorId: number;
  code: string;
  subjects: string[];
  active: boolean;
}

export interface AdmissionRound {
  id: number;
  universityId: number;
  name: string;
  startDate: string;
  endDate: string;
  active: boolean;
}

export interface EvidenceFile {
  id: number;
  name: string;
  url: string;
  type: 'pdf' | 'image' | 'doc';
}

export interface ApplicationItem {
  id: number;
  code: string;

  candidateName: string;
  email: string;
  phone: string;

  universityId: number;
  universityName: string;

  majorId: number;
  majorName: string;

  subjectGroupId: number;
  subjectGroupCode: string;

  admissionRoundId: number;
  admissionRoundName: string;

  status: ApplicationStatus;
  createdAt: string;

  evidenceFiles: EvidenceFile[];
}
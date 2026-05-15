const DRAFT_KEY = 'candidate_application_draft';

export function saveApplicationDraft(data: any) {
  localStorage.setItem(DRAFT_KEY, JSON.stringify(data));
}

export function getApplicationDraft() {
  const raw = localStorage.getItem(DRAFT_KEY);

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function clearApplicationDraft() {
  localStorage.removeItem(DRAFT_KEY);
}
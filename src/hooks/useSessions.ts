import { useCallback, useEffect, useState } from 'react';
import type { NewSessionInput, SessionRecord } from '../types';

const STORAGE_KEY = 'kosoren.sessions';

function loadSessions(): SessionRecord[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function todayISODate(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function useSessions() {
  const [sessions, setSessions] = useState<SessionRecord[]>(() => loadSessions());

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  }, [sessions]);

  const addSession = useCallback((input: NewSessionInput): SessionRecord => {
    const record: SessionRecord = {
      id: crypto.randomUUID(),
      date: input.date ?? todayISODate(),
      location: input.location,
      condition: input.condition,
      tasks: input.tasks,
      overallScore: input.overallScore,
      memo: input.memo,
    };
    setSessions(prev => [...prev, record]);
    return record;
  }, []);

  const updateSession = useCallback((id: string, input: NewSessionInput) => {
    setSessions(prev =>
      prev.map(s =>
        s.id === id
          ? {
              ...s,
              date: input.date ?? s.date,
              location: input.location,
              condition: input.condition,
              tasks: input.tasks,
              overallScore: input.overallScore,
              memo: input.memo,
            }
          : s
      )
    );
  }, []);

  const deleteSession = useCallback((id: string) => {
    setSessions(prev => prev.filter(s => s.id !== id));
  }, []);

  return { sessions, addSession, updateSession, deleteSession };
}

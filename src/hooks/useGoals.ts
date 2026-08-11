import { useCallback, useEffect, useState } from 'react';
import type { Goal } from '../types';
import { todayISODate } from '../lib/date';

const STORAGE_KEY = 'kosoren.goals';

function loadGoals(): Goal[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function useGoals() {
  const [goals, setGoals] = useState<Goal[]>(() => loadGoals());

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(goals));
  }, [goals]);

  const addGoal = useCallback((title: string) => {
    setGoals(prev => {
      const isFirst = prev.length === 0;
      const goal: Goal = {
        id: crypto.randomUUID(),
        title,
        isPinned: isFirst,
        isAchieved: false,
        createdAt: todayISODate(),
      };
      return [...prev, goal];
    });
  }, []);

  const updateGoalTitle = useCallback((id: string, title: string) => {
    setGoals(prev => prev.map(g => (g.id === id ? { ...g, title } : g)));
  }, []);

  const togglePin = useCallback((id: string) => {
    setGoals(prev =>
      prev.map(g => (g.id === id ? { ...g, isPinned: !g.isPinned } : { ...g, isPinned: false }))
    );
  }, []);

  const toggleAchieved = useCallback((id: string) => {
    setGoals(prev => prev.map(g => (g.id === id ? { ...g, isAchieved: !g.isAchieved } : g)));
  }, []);

  const deleteGoal = useCallback((id: string) => {
    setGoals(prev => prev.filter(g => g.id !== id));
  }, []);

  const pinnedGoal = goals.find(g => g.isPinned && !g.isAchieved) ?? null;

  return { goals, pinnedGoal, addGoal, updateGoalTitle, togglePin, toggleAchieved, deleteGoal };
}

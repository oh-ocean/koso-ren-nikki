import { useCallback, useEffect, useState } from 'react';
import type { TaskDraft } from '../types';
import { TASK_COLOR_PALETTE } from '../lib/taskColors';

const STORAGE_KEY = 'kosoren.taskCatalog';

const DEFAULT_CATALOG: TaskDraft[] = [
  { id: 't1', title: 'テイクオフの速さ', description: '手をついたらすぐに立ち上がる', color: TASK_COLOR_PALETTE[0], tag: 'テイクオフ' },
  { id: 't2', title: 'ボトムターン', description: '膝を深く曲げてタメを作る', color: TASK_COLOR_PALETTE[1], tag: 'ターン' },
  { id: 't3', title: 'バックサイド', description: '左腕のリードを意識する', color: TASK_COLOR_PALETTE[2], tag: 'ターン' },
  { id: 't4', title: 'パドリング', description: '胸を張って、遠くの水をかく', color: TASK_COLOR_PALETTE[3], tag: 'パドリング' },
];

function loadCatalog(): TaskDraft[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_CATALOG;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_CATALOG;
  } catch {
    return DEFAULT_CATALOG;
  }
}

export function useTaskCatalog() {
  const [catalog, setCatalog] = useState<TaskDraft[]>(() => loadCatalog());

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(catalog));
  }, [catalog]);

  const addTask = useCallback((title: string, description: string, color: string, tag: string) => {
    setCatalog(prev => [
      ...prev,
      { id: `custom-${Date.now()}`, title, description, color, tag: tag || undefined },
    ]);
  }, []);

  const updateTask = useCallback((id: string, title: string, description: string, color: string, tag: string) => {
    setCatalog(prev =>
      prev.map(t => (t.id === id ? { ...t, title, description, color, tag: tag || undefined } : t))
    );
  }, []);

  const deleteTask = useCallback((id: string) => {
    setCatalog(prev => prev.filter(t => t.id !== id));
  }, []);

  const moveTask = useCallback((id: string, direction: 'up' | 'down') => {
    setCatalog(prev => {
      const index = prev.findIndex(t => t.id === id);
      if (index === -1) return prev;
      const swapWith = direction === 'up' ? index - 1 : index + 1;
      if (swapWith < 0 || swapWith >= prev.length) return prev;
      const next = [...prev];
      [next[index], next[swapWith]] = [next[swapWith], next[index]];
      return next;
    });
  }, []);

  return { catalog, addTask, updateTask, deleteTask, moveTask };
}

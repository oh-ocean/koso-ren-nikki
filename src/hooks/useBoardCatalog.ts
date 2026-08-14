import { useCallback, useEffect, useState } from 'react';
import type { BoardDraft } from '../types';

const STORAGE_KEY = 'kosoren.boardCatalog';
const MAX_FAVORITES = 3;

const DEFAULT_CATALOG: BoardDraft[] = [
  { id: 'board1', name: 'Board 1', description: '', isFavorite: true },
  { id: 'board2', name: 'Board 2', description: '', isFavorite: true },
];

function loadCatalog(): BoardDraft[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_CATALOG;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_CATALOG;
  } catch {
    return DEFAULT_CATALOG;
  }
}

export function useBoardCatalog() {
  const [catalog, setCatalog] = useState<BoardDraft[]>(() => loadCatalog());

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(catalog));
  }, [catalog]);

  const addBoard = useCallback((name: string, description: string) => {
    setCatalog(prev => {
      const favoriteCount = prev.filter(b => b.isFavorite).length;
      return [
        ...prev,
        { id: `board-${Date.now()}`, name, description, isFavorite: favoriteCount < MAX_FAVORITES },
      ];
    });
  }, []);

  const updateBoard = useCallback((id: string, name: string, description: string) => {
    setCatalog(prev => prev.map(b => (b.id === id ? { ...b, name, description } : b)));
  }, []);

  const deleteBoard = useCallback((id: string) => {
    setCatalog(prev => prev.filter(b => b.id !== id));
  }, []);

  const moveBoard = useCallback((id: string, direction: 'up' | 'down') => {
    setCatalog(prev => {
      const index = prev.findIndex(b => b.id === id);
      if (index === -1) return prev;
      const swapWith = direction === 'up' ? index - 1 : index + 1;
      if (swapWith < 0 || swapWith >= prev.length) return prev;
      const next = [...prev];
      [next[index], next[swapWith]] = [next[swapWith], next[index]];
      return next;
    });
  }, []);

  const toggleFavorite = useCallback((id: string) => {
    setCatalog(prev => {
      const target = prev.find(b => b.id === id);
      if (!target) return prev;
      if (!target.isFavorite && prev.filter(b => b.isFavorite).length >= MAX_FAVORITES) {
        return prev;
      }
      return prev.map(b => (b.id === id ? { ...b, isFavorite: !b.isFavorite } : b));
    });
  }, []);

  return { catalog, addBoard, updateBoard, deleteBoard, moveBoard, toggleFavorite, maxFavorites: MAX_FAVORITES };
}

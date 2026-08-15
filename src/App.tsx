import { useEffect, useState } from 'react';
import TodaySession from './pages/TodaySession';
import SessionReview from './pages/SessionReview';
import Dashboard from './pages/Dashboard';
import SessionDetail from './pages/SessionDetail';
import GoalManager from './pages/GoalManager';
import TaskCatalogManager from './pages/TaskCatalogManager';
import TaskHistory from './pages/TaskHistory';
import BoardManager from './pages/BoardManager';
import Settings from './pages/Settings';
import SplashScreen from './components/SplashScreen';
import { useSessions } from './hooks/useSessions';
import { useGoals } from './hooks/useGoals';
import { useTaskCatalog } from './hooks/useTaskCatalog';
import { useBoardCatalog } from './hooks/useBoardCatalog';
import { todayISODate } from './lib/date';
import type { SessionDraft, SessionRecord, TaskDraft } from './types';

const SPLASH_LAST_SHOWN_KEY = 'kosoren.lastSplashDate';

function shouldShowSplashToday(): boolean {
  try {
    return window.localStorage.getItem(SPLASH_LAST_SHOWN_KEY) !== todayISODate();
  } catch {
    return false;
  }
}

type Screen =
  | 'today'
  | 'review'
  | 'dashboard'
  | 'detail'
  | 'goals'
  | 'taskManager'
  | 'settings'
  | 'taskHistory'
  | 'boardManager';

function App() {
  const [screen, setScreen] = useState<Screen>('today');
  const [draft, setDraft] = useState<SessionDraft | null>(null);
  const [presetDate, setPresetDate] = useState<string | null>(null);
  const [detailDate, setDetailDate] = useState<string | null>(null);
  const [editingSession, setEditingSession] = useState<SessionRecord | null>(null);
  const [subScreenReturnTo, setSubScreenReturnTo] = useState<Screen>('today');
  const [historyTask, setHistoryTask] = useState<TaskDraft | null>(null);
  const { sessions, addSession, updateSession, deleteSession } = useSessions();
  const { goals, pinnedGoal, addGoal, updateGoalTitle, togglePin, toggleAchieved, deleteGoal } = useGoals();
  const { catalog, addTask, updateTask, deleteTask, moveTask } = useTaskCatalog();
  const {
    catalog: boardCatalog,
    addBoard,
    updateBoard,
    deleteBoard,
    moveBoard,
    toggleFavorite,
    maxFavorites,
  } = useBoardCatalog();

  const [showSplash, setShowSplash] = useState(shouldShowSplashToday);
  const [splashFading, setSplashFading] = useState(false);

  useEffect(() => {
    if (!showSplash) return;
    window.localStorage.setItem(SPLASH_LAST_SHOWN_KEY, todayISODate());
    const fadeTimer = setTimeout(() => setSplashFading(true), 1100);
    const removeTimer = setTimeout(() => setShowSplash(false), 1500);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, [showSplash]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [screen]);

  const goToTodayFresh = () => {
    setPresetDate(null);
    setEditingSession(null);
    setScreen('today');
  };

  const goToDashboard = () => {
    setEditingSession(null);
    setPresetDate(null);
    setScreen('dashboard');
  };

  const goToSettingsFresh = () => {
    setScreen('settings');
  };

  const openTaskHistory = (task: TaskDraft, returnTo: Screen) => {
    setHistoryTask(task);
    setSubScreenReturnTo(returnTo);
    setScreen('taskHistory');
  };

  const handleSelectDate = (date: string) => {
    const hasEntry = sessions.some(s => s.date === date);
    if (hasEntry) {
      setDetailDate(date);
      setScreen('detail');
    } else {
      setPresetDate(date);
      setEditingSession(null);
      setScreen('today');
    }
  };

  const handleEditSession = (session: SessionRecord) => {
    setEditingSession(session);
    setDraft({
      date: session.date,
      location: session.location,
      condition: session.condition,
      tasks: session.tasks.map(t => ({ id: t.id, title: t.name, description: '' })),
    });
    setScreen('review');
  };

  const handleDeleteSession = (sessionId: string) => {
    deleteSession(sessionId);
  };

  const openGoals = () => {
    setSubScreenReturnTo('today');
    setScreen('goals');
  };

  const openTaskManager = (returnTo: Screen = 'today') => {
    setSubScreenReturnTo(returnTo);
    setScreen('taskManager');
  };

  const openBoardManager = () => {
    setSubScreenReturnTo('today');
    setScreen('boardManager');
  };

  const handleExport = () => {
    const backup = {
      version: 2,
      exportedAt: new Date().toISOString(),
      sessions,
      taskCatalog: catalog,
      boardCatalog,
      goals,
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kosoren-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (showSplash) {
    return <SplashScreen fading={splashFading} />;
  }

  if (screen === 'review' && draft) {
    return (
      <SessionReview
        draft={draft}
        onBack={() => {
          if (editingSession) {
            const backDate = editingSession.date;
            setDraft(null);
            setEditingSession(null);
            setDetailDate(backDate);
            setScreen('detail');
          } else {
            setDraft(null);
            setScreen('today');
          }
        }}
        isEditing={!!editingSession}
        initialTaskScores={
          editingSession ? Object.fromEntries(editingSession.tasks.map(t => [t.id, t.score])) : undefined
        }
        initialTaskMemos={
          editingSession ? Object.fromEntries(editingSession.tasks.map(t => [t.id, t.memo ?? ''])) : undefined
        }
        initialTaskVideoUrls={
          editingSession ? Object.fromEntries(editingSession.tasks.map(t => [t.id, t.videoUrl ?? ''])) : undefined
        }
        initialOverallScore={editingSession?.overallScore}
        initialMemo={editingSession?.memo}
        onSave={result => {
          if (editingSession) {
            updateSession(editingSession.id, {
              date: draft.date,
              location: draft.location,
              condition: draft.condition,
              ...result,
            });
            const backDate = editingSession.date;
            setDraft(null);
            setEditingSession(null);
            setPresetDate(null);
            setDetailDate(backDate);
            setScreen('detail');
          } else {
            addSession({ date: draft.date, location: draft.location, condition: draft.condition, ...result });
            setDraft(null);
            setPresetDate(null);
            setScreen('dashboard');
          }
        }}
      />
    );
  }

  if (screen === 'detail' && detailDate) {
    return (
      <SessionDetail
        date={detailDate}
        sessions={sessions.filter(s => s.date === detailDate)}
        boardCatalog={boardCatalog}
        taskCatalog={catalog}
        onBack={() => setScreen('dashboard')}
        onLogAnother={() => {
          setPresetDate(detailDate);
          setEditingSession(null);
          setScreen('today');
        }}
        onEdit={handleEditSession}
        onDelete={handleDeleteSession}
        onOpenDashboard={goToDashboard}
        onOpenToday={goToTodayFresh}
        onOpenSettings={goToSettingsFresh}
      />
    );
  }

  if (screen === 'dashboard') {
    return (
      <Dashboard
        sessions={sessions}
        taskCatalog={catalog}
        onNavigateToday={goToTodayFresh}
        onSelectDate={handleSelectDate}
        onOpenSettings={goToSettingsFresh}
        onViewTaskHistory={task => openTaskHistory(task, 'dashboard')}
        onOpenTaskManager={() => openTaskManager('dashboard')}
      />
    );
  }

  if (screen === 'settings') {
    return (
      <Settings
        onBack={() => setScreen('dashboard')}
        onOpenGoals={() => {
          setSubScreenReturnTo('settings');
          setScreen('goals');
        }}
        onOpenTaskManager={() => {
          setSubScreenReturnTo('settings');
          setScreen('taskManager');
        }}
        onOpenBoardManager={() => {
          setSubScreenReturnTo('settings');
          setScreen('boardManager');
        }}
        onExport={handleExport}
        onOpenDashboard={goToDashboard}
        onOpenToday={goToTodayFresh}
      />
    );
  }

  if (screen === 'goals') {
    return (
      <GoalManager
        goals={goals}
        onBack={() => setScreen(subScreenReturnTo)}
        onAdd={addGoal}
        onEditTitle={updateGoalTitle}
        onTogglePin={togglePin}
        onToggleAchieved={toggleAchieved}
        onDelete={deleteGoal}
        onOpenDashboard={goToDashboard}
        onOpenToday={goToTodayFresh}
        onOpenSettings={goToSettingsFresh}
      />
    );
  }

  if (screen === 'taskManager') {
    return (
      <TaskCatalogManager
        catalog={catalog}
        onBack={() => setScreen(subScreenReturnTo)}
        onAdd={addTask}
        onEdit={updateTask}
        onDelete={deleteTask}
        onMove={moveTask}
        onViewHistory={task => openTaskHistory(task, 'taskManager')}
        onOpenDashboard={goToDashboard}
        onOpenToday={goToTodayFresh}
        onOpenSettings={goToSettingsFresh}
      />
    );
  }

  if (screen === 'taskHistory' && historyTask) {
    return (
      <TaskHistory
        task={historyTask}
        sessions={sessions}
        onBack={() => setScreen(subScreenReturnTo)}
        onOpenDashboard={goToDashboard}
        onOpenToday={goToTodayFresh}
        onOpenSettings={goToSettingsFresh}
      />
    );
  }

  if (screen === 'boardManager') {
    return (
      <BoardManager
        catalog={boardCatalog}
        maxFavorites={maxFavorites}
        onBack={() => setScreen(subScreenReturnTo)}
        onAdd={addBoard}
        onEdit={updateBoard}
        onDelete={deleteBoard}
        onMove={moveBoard}
        onToggleFavorite={toggleFavorite}
        onOpenDashboard={goToDashboard}
        onOpenToday={goToTodayFresh}
        onOpenSettings={goToSettingsFresh}
      />
    );
  }

  return (
    <TodaySession
      initialDate={presetDate ?? undefined}
      pinnedGoal={pinnedGoal}
      taskCatalog={catalog}
      boardCatalog={boardCatalog}
      onStart={sessionDraft => {
        setDraft(sessionDraft);
        setScreen('review');
      }}
      onOpenDashboard={goToDashboard}
      onOpenSettings={goToSettingsFresh}
      onOpenGoals={openGoals}
      onOpenTaskManager={openTaskManager}
      onOpenBoardManager={openBoardManager}
    />
  );
}

export default App;

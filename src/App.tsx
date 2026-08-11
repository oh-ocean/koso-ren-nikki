import { useState } from 'react';
import TodaySession from './pages/TodaySession';
import SessionReview from './pages/SessionReview';
import Dashboard from './pages/Dashboard';
import SessionDetail from './pages/SessionDetail';
import GoalManager from './pages/GoalManager';
import TaskCatalogManager from './pages/TaskCatalogManager';
import TaskHistory from './pages/TaskHistory';
import Settings from './pages/Settings';
import { useSessions } from './hooks/useSessions';
import { useGoals } from './hooks/useGoals';
import { useTaskCatalog } from './hooks/useTaskCatalog';
import type { SessionDraft, SessionRecord, TaskDraft } from './types';

type Screen = 'today' | 'review' | 'dashboard' | 'detail' | 'goals' | 'taskManager' | 'settings' | 'taskHistory';

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

  const goToTodayFresh = () => {
    setPresetDate(null);
    setEditingSession(null);
    setScreen('today');
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
    setPresetDate(session.date);
    setScreen('today');
  };

  const handleDeleteSession = (sessionId: string) => {
    deleteSession(sessionId);
  };

  const openGoals = () => {
    setSubScreenReturnTo('today');
    setScreen('goals');
  };

  const openTaskManager = () => {
    setSubScreenReturnTo('today');
    setScreen('taskManager');
  };

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(sessions, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kosoren-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (screen === 'review' && draft) {
    return (
      <SessionReview
        draft={draft}
        onBack={() => setScreen('today')}
        isEditing={!!editingSession}
        initialTaskScores={
          editingSession ? Object.fromEntries(editingSession.tasks.map(t => [t.id, t.score])) : undefined
        }
        initialTaskMemos={
          editingSession ? Object.fromEntries(editingSession.tasks.map(t => [t.id, t.memo ?? ''])) : undefined
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
        onBack={() => setScreen('dashboard')}
        onLogAnother={() => {
          setPresetDate(detailDate);
          setEditingSession(null);
          setScreen('today');
        }}
        onEdit={handleEditSession}
        onDelete={handleDeleteSession}
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
        onOpenSettings={() => setScreen('settings')}
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
        onExport={handleExport}
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
        onViewHistory={task => {
          setHistoryTask(task);
          setScreen('taskHistory');
        }}
      />
    );
  }

  if (screen === 'taskHistory' && historyTask) {
    return (
      <TaskHistory
        task={historyTask}
        sessions={sessions}
        onBack={() => setScreen('taskManager')}
      />
    );
  }

  return (
    <TodaySession
      initialDate={presetDate ?? undefined}
      initialLocation={editingSession?.location}
      initialCondition={editingSession?.condition}
      initialTasks={editingSession?.tasks}
      isEditing={!!editingSession}
      pinnedGoal={pinnedGoal}
      taskCatalog={catalog}
      onStart={sessionDraft => {
        setDraft(sessionDraft);
        setScreen('review');
      }}
      onOpenDashboard={() => {
        setEditingSession(null);
        setPresetDate(null);
        setScreen('dashboard');
      }}
      onOpenGoals={openGoals}
      onOpenTaskManager={openTaskManager}
    />
  );
}

export default App;

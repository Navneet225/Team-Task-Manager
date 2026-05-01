import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { dashboardApi } from '../api';
import toast from 'react-hot-toast';


function getInitials(name) { return name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2); }

function formatDate(d) {
  if (!d) return null;
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

const priorityConfig = {
  low:    { color: 'bg-emerald-500', text: 'text-emerald-700', bgSoft: 'bg-emerald-50' },
  medium: { color: 'bg-amber-500', text: 'text-amber-700', bgSoft: 'bg-amber-50' },
  high:   { color: 'bg-rose-500', text: 'text-rose-700', bgSoft: 'bg-rose-50' },
};

export default function DashboardPage() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');

  useEffect(() => {
    dashboardApi.get()
      .then(res => setData(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-full gap-4">
      <div className="loader-spinner" />
      <p className="text-gray-500 text-sm font-medium">Loading tasks...</p>
    </div>
  );

  const recentTasks = data?.recentTasks || [];
  
  const filteredTasks = recentTasks.filter(t => {
    if (activeTab === 'Active') return t.status !== 'done';
    if (activeTab === 'Completed') return t.status === 'done';
    return true; // 'All'
  });

  const TaskCard = ({ task }) => {
    const isDone = task.status === 'done';
    const pc = priorityConfig[task.priority] || priorityConfig.medium;

    return (
      <div 
        onClick={() => navigate(`/projects/${task.project?._id || task.project}`)}
        className={`task-card flex items-start gap-4 cursor-pointer ${isDone ? 'opacity-60' : ''}`}
      >
        {/* Checkbox */}
        <div className="pt-1">
          <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${isDone ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-gray-300 hover:border-indigo-500'}`}>
            {isDone && <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>check</span>}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <h3 className={`text-base font-semibold text-gray-900 mb-1 truncate ${isDone ? 'line-through text-gray-500' : ''}`}>
            {task.title}
          </h3>
          <p className="text-sm text-gray-500 truncate mb-3">
            {task.description || 'No description provided.'}
          </p>
          
          <div className="flex items-center gap-3">
            {task.dueDate && (
              <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500 bg-gray-50 px-2.5 py-1 rounded-md border border-gray-100">
                <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>calendar_today</span>
                {formatDate(task.dueDate)}
              </div>
            )}
            
            <div className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-md ${pc.bgSoft} ${pc.text}`}>
              <div className={`w-2 h-2 rounded-full ${pc.color}`} />
              <span className="capitalize">{task.priority}</span>
            </div>

            {task.assignee && (
              <div className="ml-auto w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold border border-white shadow-sm" title={task.assignee.name}>
                {getInitials(task.assignee.name)}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header Section */}
      <div className="flex items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight mb-1">My Tasks</h1>
          <p className="text-gray-500 text-sm">Here&apos;s what you need to focus on today.</p>
        </div>
        <button 
          onClick={() => {
            toast.success('Select a project first to create a task');
            navigate('/projects');
          }}
          className="btn-primary shrink-0 shadow-sm text-sm"
        >
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add</span>
          <span className="hidden sm:inline">Create Task</span>
          <span className="sm:hidden">Add</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <div className="flex gap-6">
          {['All', 'Active', 'Completed'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-sm font-medium transition-colors relative ${
                activeTab === tab 
                  ? 'text-indigo-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-t-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Task List */}
      {filteredTasks.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 border-dashed">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
            <span className="material-symbols-outlined" style={{ fontSize: '32px' }}>task</span>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No tasks found</h3>
          <p className="text-gray-500 text-sm">
            {activeTab === 'Completed' ? "You haven't completed any tasks yet." : "You're all caught up! Enjoy your day."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTasks.map(task => (
            <TaskCard key={task._id} task={task} />
          ))}
        </div>
      )}
    </div>
  );
}

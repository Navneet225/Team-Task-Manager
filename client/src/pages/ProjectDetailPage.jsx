import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { projectsApi, tasksApi, authApi } from '../api';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/Modal';
import toast from 'react-hot-toast';

function getInitials(n) { return n?.split(' ').map(x => x[0]).join('').toUpperCase().slice(0, 2); }
function formatDate(d) { return d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : null; }
function isOverdue(task) { return task.dueDate && task.status !== 'done' && new Date() > new Date(task.dueDate); }

const COLUMNS = [
  { key: 'todo',        label: 'To Do' },
  { key: 'in-progress', label: 'In Progress' },
  { key: 'done',        label: 'Done' },
];

const priorityConfig = {
  high:   { color: 'bg-rose-500', text: 'text-rose-700', bgSoft: 'bg-rose-50' },
  medium: { color: 'bg-amber-500', text: 'text-amber-700', bgSoft: 'bg-amber-50' },
  low:    { color: 'bg-emerald-500', text: 'text-emerald-700', bgSoft: 'bg-emerald-50' },
};

const emptyTask = { title: '', description: '', priority: 'medium', dueDate: '', assignee: '' };

const LightInput = ({ label, ...props }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
    <input className="input-minimal" {...props} />
  </div>
);

const LightTextarea = ({ label, ...props }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
    <textarea className="input-minimal min-h-[100px] resize-none leading-relaxed" {...props} />
  </div>
);

export default function ProjectDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin, user } = useAuth();

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [taskForm, setTaskForm] = useState(emptyTask);
  const [saving, setSaving] = useState(false);
  const [viewTask, setViewTask] = useState(null);

  const fetchAll = useCallback(async () => {
    try {
      const [projRes, tasksRes] = await Promise.all([
        projectsApi.getOne(id),
        tasksApi.getByProject(id)
      ]);
      setProject(projRes.data.project);
      setTasks(tasksRes.data.tasks);
    } catch {
      toast.error('Failed to load project');
      navigate('/projects');
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    fetchAll();
    authApi.getUsers().then(r => setAllUsers(r.data.users));
  }, [id, fetchAll]);

  const openCreateTask = () => { setEditTask(null); setTaskForm(emptyTask); setShowTaskModal(true); };
  const openEditTask = (task) => { setEditTask(task); setTaskForm({ title: task.title, description: task.description, priority: task.priority, dueDate: task.dueDate ? task.dueDate.slice(0, 10) : '', assignee: task.assignee?._id || '' }); setShowTaskModal(true); setViewTask(null); };

  const handleTaskSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...taskForm, assignee: taskForm.assignee || null, dueDate: taskForm.dueDate || null };
      if (editTask) {
        const res = await tasksApi.update(editTask._id, payload);
        setTasks(ts => ts.map(t => t._id === editTask._id ? res.data.task : t));
        toast.success('Task updated!');
      } else {
        const res = await tasksApi.create(id, payload);
        setTasks(ts => [res.data.task, ...ts]);
        toast.success('Task created!');
      }
      setShowTaskModal(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error');
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const res = await tasksApi.update(taskId, { status: newStatus });
      setTasks(ts => ts.map(t => t._id === taskId ? res.data.task : t));
      if (viewTask?._id === taskId) setViewTask(res.data.task);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await tasksApi.delete(taskId);
      setTasks(ts => ts.filter(t => t._id !== taskId));
      setViewTask(null);
      toast.success('Task deleted');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error');
    }
  };

  const handleAddMember = async (userId) => {
    try {
      const res = await projectsApi.addMember(id, userId);
      setProject(res.data.project);
      toast.success('Member added!');
    } catch (err) { toast.error(err.response?.data?.message || 'Error'); }
  };

  const handleRemoveMember = async (userId) => {
    try {
      const res = await projectsApi.removeMember(id, userId);
      setProject(res.data.project);
      toast.success('Member removed');
    } catch (err) { toast.error(err.response?.data?.message || 'Error'); }
  };

  const nonMembers = allUsers.filter(u => !project?.members?.some(m => m._id === u._id));

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-full py-20 gap-4">
      <div className="loader-spinner" />
      <p className="text-gray-500 text-sm font-medium">Syncing Project Data...</p>
    </div>
  );

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/projects')}
            className="w-9 h-9 lg:w-10 lg:h-10 rounded-lg border border-gray-200 text-gray-500 flex items-center justify-center hover:bg-gray-50 transition-colors shrink-0"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>arrow_back</span>
          </button>
          <div className="min-w-0">
            <h1 className="text-lg lg:text-2xl font-bold text-gray-900 flex items-center gap-2 truncate">
              <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: project.color }} />
              {project.title}
            </h1>
            <p className="text-sm text-gray-500 mt-0.5 line-clamp-1">{project.description}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div className="flex -space-x-2">
            {project.members?.slice(0, 4).map(m => (
              <div key={m._id} className="w-7 h-7 lg:w-8 lg:h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold border-2 border-white shadow-sm" title={m.name}>
                {getInitials(m.name)}
              </div>
            ))}
            {project.members?.length > 4 && (
              <div className="w-7 h-7 lg:w-8 lg:h-8 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center text-xs font-bold border-2 border-white shadow-sm">
                +{project.members.length - 4}
              </div>
            )}
          </div>
          
          {isAdmin && (
            <button
              onClick={() => setShowMembersModal(true)}
              className="p-2 text-gray-500 hover:text-indigo-600 border border-gray-200 rounded-lg hover:bg-indigo-50 hover:border-indigo-200 transition-colors"
              title="Manage Team"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>group_add</span>
            </button>
          )}
          <button onClick={openCreateTask} className="btn-primary text-sm">
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add</span>
            <span className="hidden sm:inline">Add Task</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>
      </div>

      {/* Kanban Board Container */}
      <div className="flex-1 overflow-x-auto pb-4 -mx-4 px-4 lg:mx-0 lg:px-0" style={{ scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch' }}>
        <div className="flex gap-4 lg:gap-6 min-w-max h-full">
          {COLUMNS.map(col => {
            const colTasks = tasks.filter(t => t.status === col.key);
            
            return (
              <div key={col.key} className="w-[calc(100vw-56px)] sm:w-[320px] flex flex-col bg-gray-50/80 rounded-xl p-3 lg:p-4 border border-gray-200 flex-shrink-0" style={{ scrollSnapAlign: 'start' }}>
                <div className="flex items-center justify-between mb-4 px-1">
                  <h3 className="font-semibold text-gray-900 text-sm">{col.label}</h3>
                  <span className="text-xs font-medium bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">
                    {colTasks.length}
                  </span>
                </div>
                
                <div className="flex-1 flex flex-col gap-3 overflow-y-auto">
                  {colTasks.map(task => {
                    const pc = priorityConfig[task.priority] || priorityConfig.medium;
                    const overdue = isOverdue(task);
                    
                    return (
                      <div
                        key={task._id}
                        onClick={() => setViewTask(task)}
                        className={`bg-white border rounded-lg p-3.5 shadow-sm cursor-pointer hover:border-gray-300 hover:shadow-md transition-all
                          ${overdue ? 'border-red-200' : 'border-gray-200'}
                          ${task.status === 'done' ? 'opacity-70' : ''}
                        `}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <div className={`flex items-center gap-1.5 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wide ${pc.bgSoft} ${pc.text}`}>
                            {task.priority}
                          </div>
                          {overdue && (
                            <div className="flex items-center gap-1.5 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wide bg-red-50 text-red-600">
                              Overdue
                            </div>
                          )}
                        </div>

                        <h4 className={`text-sm font-semibold text-gray-900 mb-1.5 line-clamp-2 ${task.status === 'done' ? 'line-through text-gray-500' : ''}`}>
                          {task.title}
                        </h4>
                        
                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                          {task.dueDate ? (
                            <div className={`flex items-center gap-1 text-xs font-medium ${overdue ? 'text-red-600' : 'text-gray-500'}`}>
                              <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>calendar_today</span>
                              {formatDate(task.dueDate)}
                            </div>
                          ) : <div />}
                          
                          {task.assignee && (
                            <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-[10px] font-bold shadow-sm" title={task.assignee.name}>
                              {getInitials(task.assignee.name)}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── View Task Modal ── */}
      {viewTask && (
        <Modal isOpen={!!viewTask} onClose={() => setViewTask(null)}>
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">{viewTask.title}</h2>
              <div className="flex items-center gap-2">
                {(isAdmin || user._id === viewTask.assignee?._id || user._id === viewTask.creator?._id) && (
                  <>
                    <button onClick={() => openEditTask(viewTask)} className="p-1.5 text-gray-400 hover:text-indigo-600 bg-gray-50 hover:bg-indigo-50 rounded-md transition-colors">
                      <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>edit</span>
                    </button>
                    <button onClick={() => handleDeleteTask(viewTask._id)} className="p-1.5 text-gray-400 hover:text-red-600 bg-gray-50 hover:bg-red-50 rounded-md transition-colors">
                      <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>delete</span>
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-4 mb-6 text-sm">
              <div className="bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                <span className="text-gray-500 font-medium mr-2">Status:</span>
                <select
                  value={viewTask.status}
                  onChange={(e) => handleStatusChange(viewTask._id, e.target.value)}
                  className="bg-transparent font-semibold text-gray-900 outline-none"
                >
                  <option value="todo">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
              </div>
              <div className="bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                <span className="text-gray-500 font-medium mr-2">Priority:</span>
                <span className="font-semibold text-gray-900 capitalize">{viewTask.priority}</span>
              </div>
              {viewTask.dueDate && (
                <div className="bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                  <span className="text-gray-500 font-medium mr-2">Due:</span>
                  <span className="font-semibold text-gray-900">{formatDate(viewTask.dueDate)}</span>
                </div>
              )}
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-bold text-gray-900 mb-2 uppercase tracking-wider">Description</h3>
              <div className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-lg border border-gray-100">
                {viewTask.description || 'No description provided.'}
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-100">
              <button onClick={() => setViewTask(null)} className="btn-primary">
                Done
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* ── Create/Edit Task Modal ── */}
      {showTaskModal && (
        <Modal isOpen={showTaskModal} onClose={() => setShowTaskModal(false)}>
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">{editTask ? 'Edit Task' : 'New Task'}</h2>
            <form onSubmit={handleTaskSubmit}>
              <LightInput label="Task Title" required value={taskForm.title} onChange={e => setTaskForm({...taskForm, title: e.target.value})} placeholder="What needs to be done?" />
              <LightTextarea label="Description" value={taskForm.description} onChange={e => setTaskForm({...taskForm, description: e.target.value})} placeholder="Add details..." />
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Priority</label>
                  <select className="input-minimal" value={taskForm.priority} onChange={e => setTaskForm({...taskForm, priority: e.target.value})}>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Due Date</label>
                  <input type="date" className="input-minimal" value={taskForm.dueDate} onChange={e => setTaskForm({...taskForm, dueDate: e.target.value})} />
                </div>
              </div>

              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Assignee</label>
                <select className="input-minimal" value={taskForm.assignee} onChange={e => setTaskForm({...taskForm, assignee: e.target.value})}>
                  <option value="">Unassigned</option>
                  {project.members?.map(m => (
                    <option key={m._id} value={m._id}>{m.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setShowTaskModal(false)} className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">Cancel</button>
                <button type="submit" disabled={saving} className="btn-primary">{saving ? 'Saving...' : editTask ? 'Save Changes' : 'Create Task'}</button>
              </div>
            </form>
          </div>
        </Modal>
      )}

      {/* ── Manage Team Modal ── */}
      {showMembersModal && (
        <Modal isOpen={showMembersModal} onClose={() => setShowMembersModal(false)}>
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Manage Team</h2>
            
            <div className="mb-6">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Current Members</h3>
              {project.members?.length === 0 ? (
                <p className="text-sm text-gray-500 italic">No members yet.</p>
              ) : (
                <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                  {project.members?.map(m => (
                    <div key={m._id} className="flex items-center justify-between p-2.5 bg-gray-50 rounded-lg border border-gray-100">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold">{getInitials(m.name)}</div>
                        <div>
                          <div className="text-sm font-semibold text-gray-900">{m.name}</div>
                          <div className="text-xs text-gray-500">{m.email}</div>
                        </div>
                      </div>
                      <button onClick={() => handleRemoveMember(m._id)} className="text-red-500 hover:text-red-700 p-1 rounded-md hover:bg-red-50 transition-colors">
                        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>person_remove</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Add Members</h3>
              {nonMembers.length === 0 ? (
                <p className="text-sm text-gray-500 italic">Everyone is already in this project.</p>
              ) : (
                <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                  {nonMembers.map(u => (
                    <div key={u._id} className="flex items-center justify-between p-2.5 bg-white border border-gray-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center text-xs font-bold">{getInitials(u.name)}</div>
                        <div>
                          <div className="text-sm font-semibold text-gray-900">{u.name}</div>
                          <div className="text-xs text-gray-500">{u.email}</div>
                        </div>
                      </div>
                      <button onClick={() => handleAddMember(u._id)} className="text-indigo-600 hover:text-indigo-800 p-1 rounded-md hover:bg-indigo-50 transition-colors">
                        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>person_add</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end pt-6 mt-6 border-t border-gray-100">
              <button onClick={() => setShowMembersModal(false)} className="btn-primary">Done</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

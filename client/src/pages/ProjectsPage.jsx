import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { projectsApi } from '../api';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/Modal';
import toast from 'react-hot-toast';

const PROJECT_COLORS = ['#4f46e5', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

// ── Input helper ──────────────────────────────────────────────
const LightInput = ({ label, ...props }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
    <input className="input-minimal" {...props} />
  </div>
);

const LightTextarea = ({ label, ...props }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
    <textarea
      className="input-minimal"
      style={{ minHeight: '100px', resize: 'none', lineHeight: 1.5 }}
      {...props}
    />
  </div>
);

export default function ProjectsPage() {
  const { isAdmin, user } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [editProject, setEditProject] = useState(null);
  const [form, setForm] = useState({ title: '', description: '', color: '#4f46e5' });
  const [saving, setSaving] = useState(false);

  const fetchProjects = () => {
    projectsApi.getAll()
      .then(res => setProjects(res.data.projects))
      .catch(() => toast.error('Failed to load projects'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchProjects(); }, []);

  const openCreate = () => { setForm({ title: '', description: '', color: '#4f46e5' }); setEditProject(null); setShowCreate(true); };
  const openEdit = (e, p) => { e.stopPropagation(); setEditProject(p); setForm({ title: p.title, description: p.description, color: p.color }); setShowCreate(true); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editProject) {
        const res = await projectsApi.update(editProject._id, form);
        setProjects(ps => ps.map(p => p._id === editProject._id ? { ...p, ...res.data.project } : p));
        toast.success('Project updated!');
      } else {
        const res = await projectsApi.create(form);
        setProjects(ps => [res.data.project, ...ps]);
        toast.success('Project created!');
      }
      setShowCreate(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm('Delete this project and all its tasks?')) return;
    try {
      await projectsApi.delete(id);
      setProjects(ps => ps.filter(p => p._id !== id));
      toast.success('Project deleted');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error');
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="flex items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight mb-1">Projects</h1>
          <p className="text-gray-500 text-sm">
            {projects.length} active project{projects.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button onClick={openCreate} className="btn-primary shrink-0 shadow-sm text-sm">
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add</span>
          <span className="hidden sm:inline">New Project</span>
          <span className="sm:hidden">New</span>
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="loader-spinner" />
          <p className="text-gray-500 text-sm font-medium">Loading projects...</p>
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-2xl border border-gray-100 border-dashed">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
            <span className="material-symbols-outlined" style={{ fontSize: '32px' }}>folder_open</span>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No projects yet</h3>
          <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto">
            Create your first project to start organizing tasks.
          </p>
          <button onClick={openCreate} className="btn-primary shadow-sm mx-auto">
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>add</span>
            Create Project
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(p => {
            const completed = p.tasks?.filter(t => t.status === 'done').length || 0;
            const total = p.tasks?.length || 0;
            const progress = total === 0 ? 0 : Math.round((completed / total) * 100);

            return (
              <div
                key={p._id}
                onClick={() => navigate(`/projects/${p._id}`)}
                className="bg-white border border-gray-200 rounded-xl p-5 cursor-pointer hover:border-gray-300 hover:shadow-md transition-all group flex flex-col"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center shadow-sm" style={{ backgroundColor: `${p.color}15`, color: p.color }}>
                    <span className="material-symbols-outlined">folder</span>
                  </div>
                  {(isAdmin || p.owner?._id === user?._id || p.owner === user?._id) && (
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={(e) => openEdit(e, p)}
                        className="p-1.5 text-gray-400 hover:text-indigo-600 rounded-md hover:bg-gray-50 transition-colors"
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>edit</span>
                      </button>
                      <button 
                        onClick={(e) => handleDelete(e, p._id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 rounded-md hover:bg-gray-50 transition-colors"
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>delete</span>
                      </button>
                    </div>
                  )}
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-1">{p.title}</h3>
                <p className="text-sm text-gray-500 line-clamp-2 mb-6 flex-1">
                  {p.description || 'No description provided.'}
                </p>

                <div className="mt-auto">
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                    <span className="font-medium">{progress}% Complete</span>
                    <span>{completed}/{total} Tasks</span>
                  </div>
                  <div className="progress-track">
                    <div className="progress-fill" style={{ width: `${progress}%`, background: p.color }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create/Edit Modal */}
      {showCreate && (
        <Modal isOpen={showCreate} onClose={() => setShowCreate(false)}>
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              {editProject ? 'Edit Project' : 'New Project'}
            </h2>
            <form onSubmit={handleSubmit}>
              <LightInput
                label="Project Title" required
                value={form.title} onChange={e => setForm({...form, title: e.target.value})}
                placeholder="e.g. Website Redesign"
              />
              <LightTextarea
                label="Description (Optional)"
                value={form.description} onChange={e => setForm({...form, description: e.target.value})}
                placeholder="Brief description of the project goals..."
              />
              
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-2">Project Color</label>
                <div className="flex gap-3">
                  {PROJECT_COLORS.map(c => (
                    <button
                      key={c} type="button"
                      onClick={() => setForm({...form, color: c})}
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform ${form.color === c ? 'scale-110 ring-2 ring-offset-2 ring-indigo-500' : 'hover:scale-110'}`}
                      style={{ background: c }}
                    >
                      {form.color === c && <span className="material-symbols-outlined text-white" style={{ fontSize: '16px' }}>check</span>}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button" onClick={() => setShowCreate(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit" disabled={saving}
                  className="btn-primary"
                >
                  {saving ? 'Saving...' : editProject ? 'Save Changes' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </Modal>
      )}
    </div>
  );
}

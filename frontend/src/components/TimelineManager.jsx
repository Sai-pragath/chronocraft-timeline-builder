import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LogOut, Plus, Trash2, FolderPlus, Compass, Activity, BookOpen, Star } from 'lucide-react';

export default function TimelineManager({ onLogout }) {
  const [timelines, setTimelines] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const navigate = useNavigate();

  const fetchTimelines = async () => {
    try {
      const res = await axios.get('/timelines/');
      setTimelines(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTimelines();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/timelines/', { title: newTitle, description: newDesc });
      setShowModal(false);
      setNewTitle('');
      setNewDesc('');
      fetchTimelines();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this timeline?')) return;
    try {
      await axios.delete(`/timelines/${id}`);
      fetchTimelines();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <nav className="dashboard-nav">
        <h1>ChronoCraft</h1>
        <div className="nav-actions">
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <Plus size={18} /> New Timeline
          </button>
          <button className="btn btn-secondary" onClick={onLogout}>
            <LogOut size={18} /> Logout
          </button>
        </div>
      </nav>

      <main className="main-content">
        <div className="dashboard-hero">
          <div className="dashboard-hero-text">
            <h2>Welcome to your Dashboard</h2>
            <p>Manage your historical timelines, track epic journeys, and visualize events in a beautifully structured way. Get started by creating a new timeline.</p>
            <button className="btn btn-primary" onClick={() => setShowModal(true)} style={{ width: 'auto' }}>
              <Plus size={18} /> Create New Timeline
            </button>
          </div>
          <div style={{ padding: '2rem', background: '#e0e7ff', borderRadius: '50%' }}>
            <Compass size={80} color="#4f46e5" />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr', gap: '3rem' }}>
          <div>
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.75rem', color: '#0f172a', fontWeight: '700' }}>Your Projects</h3>
            </div>
            
            {timelines.length === 0 ? (
              <div className="empty-state">
                <FolderPlus size={56} />
                <h3>No timelines found</h3>
                <p>You haven't created any timelines yet. Click the button above to map out your first piece of history.</p>
                <button className="btn btn-secondary" onClick={() => setShowModal(true)} style={{ width: 'auto' }}>
                  Create your first timeline
                </button>
              </div>
            ) : (
              <div className="timeline-grid">
                {timelines.map(t => (
                  <div 
                    key={t.id} 
                    className="timeline-card"
                    onClick={() => navigate(`/timeline/${t.id}`)}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ padding: '0.5rem', background: '#e0e7ff', borderRadius: '8px', color: '#4f46e5' }}>
                          <BookOpen size={20} />
                        </div>
                        <h3 style={{ fontSize: '1.25rem', color: '#0f172a', margin: 0 }}>{t.title}</h3>
                      </div>
                      <button className="icon-btn danger" onClick={(e) => handleDelete(e, t.id)} title="Delete Timeline">
                        <Trash2 size={18} />
                      </button>
                    </div>
                    <p style={{ marginTop: '1rem', color: '#475569', lineHeight: '1.5' }}>{t.description || 'No description provided.'}</p>
                    <div style={{ marginTop: '1.5rem', borderTop: '1px solid #f1f5f9', paddingTop: '1rem', display: 'flex', alignItems: 'center', color: '#64748b', fontSize: '0.85rem' }}>
                      <Activity size={14} style={{ marginRight: '0.5rem' }}/>
                      <span>Created {new Date(t.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Sidebar to fill empty space */}
          <div className="dashboard-sidebar" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div className="glass-panel" style={{ padding: '1.5rem', background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
              <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: '#0f172a' }}>
                <Activity size={18} color="#4f46e5" /> Quick Stats
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                <li style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Total Timelines</span>
                  <span style={{ fontWeight: '600', color: '#0f172a' }}>{timelines.length}</span>
                </li>
              </ul>
            </div>

            <div className="glass-panel" style={{ padding: '1.5rem', background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-sm)' }}>
              <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: '#0f172a' }}>
                <BookOpen size={18} color="#4f46e5" /> Ideas & Inspiration
              </h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '1rem' }}>
                Need ideas for your next timeline? Try mapping out:
              </p>
              <ul style={{ paddingLeft: '1.25rem', color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6' }}>
                <li>The Apollo Space Missions</li>
                <li>History of the Internet</li>
                <li>Your Family Tree</li>
                <li>World War II Major Events</li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Create Timeline</h3>
              <button className="icon-btn" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form onSubmit={handleCreate}>
              <div className="form-group">
                <label>Timeline Title</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. The Apollo Missions"
                  required 
                />
              </div>
              <div className="form-group">
                <label>Description (Optional)</label>
                <textarea 
                  className="form-input" 
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Briefly describe what this timeline is about..."
                  rows={4}
                />
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '2.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

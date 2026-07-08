import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Plus, Trash2, Clock, Image as ImageIcon, Calendar, Info, BarChart2 } from 'lucide-react';

export default function TimelineView({ onLogout }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [timeline, setTimeline] = useState(null);
  const [showModal, setShowModal] = useState(false);
  
  // Event form state
  const [title, setTitle] = useState('');
  const [dateStr, setDateStr] = useState('');
  const [desc, setDesc] = useState('');
  const [imgUrl, setImgUrl] = useState('');

  const fetchTimeline = async () => {
    try {
      const res = await axios.get(`/timelines/${id}`);
      setTimeline(res.data);
    } catch (err) {
      console.error(err);
      navigate('/');
    }
  };

  useEffect(() => {
    fetchTimeline();
  }, [id]);

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`/timelines/${id}/events/`, {
        title,
        date_str: dateStr,
        description: desc,
        image_url: imgUrl
      });
      setShowModal(false);
      resetForm();
      fetchTimeline();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    try {
      await axios.delete(`/events/${eventId}`);
      fetchTimeline();
    } catch (err) {
      console.error(err);
    }
  };

  const resetForm = () => {
    setTitle('');
    setDateStr('');
    setDesc('');
    setImgUrl('');
  };

  if (!timeline) return <div className="loading-state">Loading timeline data...</div>;

  const parseDateForSort = (dStr) => {
    if (!dStr) return 0;
    const str = String(dStr);
    
    const isBC = str.toUpperCase().includes('BC') || str.toUpperCase().includes('BCE');
    
    // Try to parse as an exact date first (e.g., "April 21, 2026")
    const parsed = Date.parse(str);
    if (!isNaN(parsed) && !isBC) {
      return parsed;
    }
    
    // Fallback for fuzzy dates or BC/BCE
    const match = str.match(/\d{3,4}/);
    if (match) {
      let year = parseInt(match[0], 10);
      if (isBC) {
        year = -year;
      }
      const d = new Date(0);
      d.setFullYear(year, 0, 1);
      return d.getTime();
    }
    return 0;
  };

  const sortedEvents = [...timeline.events].sort((a, b) => parseDateForSort(a.date_str) - parseDateForSort(b.date_str));

  const EventCard = ({ evt }) => (
    <div className="timeline-content-new">
      <span className="event-date">{evt.date_str}</span>
      <h3 className="event-title">{evt.title}</h3>
      {evt.image_url ? (
        <img src={evt.image_url} alt={evt.title} className="event-image" />
      ) : (
        <div className="event-image-placeholder">
          <ImageIcon size={32} color="#cbd5e1" />
        </div>
      )}
      <p className="event-desc">{evt.description || 'No detailed description available for this event.'}</p>
      
      <div className="event-actions-new">
        <button className="icon-btn danger" onClick={() => handleDeleteEvent(evt.id)} title="Delete Event">
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      <nav className="dashboard-nav" style={{ flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button className="icon-btn" onClick={() => navigate('/')} title="Back to Dashboard">
            <ArrowLeft size={20} />
          </button>
          <h1>ChronoCraft</h1>
        </div>
        <div className="nav-actions">
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <Plus size={18} /> Add Event
          </button>
        </div>
      </nav>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        
        {/* Left Sidebar Info Panel to make UI look full and rich */}
        <div className="timeline-sidebar">
          <div className="sidebar-section">
            <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem', color: '#0f172a' }}>{timeline.title}</h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '1.5rem' }}>
              {timeline.description || 'A journey through time, documenting key moments and milestones.'}
            </p>
          </div>

          <div className="sidebar-stats">
            <div className="stat-item">
              <Calendar size={18} className="stat-icon" />
              <div>
                <span className="stat-label">Total Events</span>
                <span className="stat-value">{sortedEvents.length}</span>
              </div>
            </div>
            <div className="stat-item">
              <BarChart2 size={18} className="stat-icon" />
              <div>
                <span className="stat-label">Timeline Status</span>
                <span className="stat-value">Work in Progress</span>
              </div>
            </div>
          </div>

          <div className="sidebar-tips">
            <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}><Info size={16}/> Pro Tips</h4>
            <p>• Include the <strong>Year</strong> in your dates (e.g. 1969 or 500 BC). Events are automatically sorted chronologically!</p>
            <p>• Images make your timeline pop! Paste any valid image URL.</p>
            <p>• Scroll horizontally to view the entire timeline history.</p>
          </div>
        </div>

        {/* Main Scrolling Timeline Area */}
        <div className="horizontal-timeline-container-new">
          {sortedEvents.length === 0 ? (
            <div className="empty-state" style={{ width: '100%', maxWidth: '600px', margin: '4rem auto' }}>
              <Clock size={56} />
              <h3>This timeline is empty</h3>
              <p>Add historical events, images, and descriptions to start visualizing the chronology of {timeline.title}.</p>
              <button className="btn btn-primary" onClick={() => setShowModal(true)} style={{ width: 'auto' }}>
                <Plus size={18} /> Add First Event
              </button>
            </div>
          ) : (
            <div className="timeline-track-new">
              {sortedEvents.map((evt, index) => {
                const isTop = index % 2 === 0;
                return (
                  <div className="timeline-node-new" key={evt.id}>
                    {/* Top Section */}
                    <div className="node-top-space">
                      {isTop && <EventCard evt={evt} />}
                    </div>

                    {/* Center Line and Dot */}
                    <div className="node-center">
                      <div className="node-line-segment"></div>
                      <div className="timeline-dot-new"></div>
                      <div className={`node-connector ${isTop ? 'connector-top' : 'connector-bottom'}`}></div>
                    </div>

                    {/* Bottom Section */}
                    <div className="node-bottom-space">
                      {!isTop && <EventCard evt={evt} />}
                    </div>
                  </div>
                );
              })}
              
              {/* Add Event Node at the end */}
              <div className="timeline-node-new" style={{ width: '150px' }}>
                <div className="node-top-space"></div>
                <div className="node-center">
                  <div className="node-line-segment" style={{ right: '50%' }}></div>
                  <button className="add-event-fab" onClick={() => setShowModal(true)} title="Add another event">
                    <Plus size={24} />
                  </button>
                </div>
                <div className="node-bottom-space"></div>
              </div>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="modal-header">
              <h3>Add Historical Event</h3>
              <button className="icon-btn" onClick={() => { setShowModal(false); resetForm(); }}>×</button>
            </div>
            <form onSubmit={handleCreateEvent}>
              <div className="form-group">
                <label>Event Title</label>
                <input type="text" className="form-input" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Moon Landing" required />
              </div>
              <div className="form-group">
                <label>Date String</label>
                <input type="text" className="form-input" value={dateStr} onChange={e => setDateStr(e.target.value)} placeholder="e.g. July 20, 1969 or 1960s" required />
              </div>
              <div className="form-group">
                <label>Description (Optional)</label>
                <textarea className="form-input" value={desc} onChange={e => setDesc(e.target.value)} placeholder="Elaborate on the significance of this event..." rows={4} />
              </div>
              <div className="form-group">
                <label>Image URL (Optional)</label>
                <input type="url" className="form-input" value={imgUrl} onChange={e => setImgUrl(e.target.value)} placeholder="https://example.com/image.jpg" />
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '2.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => { setShowModal(false); resetForm(); }}>Cancel</button>
                <button type="submit" className="btn btn-primary">Add Event</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

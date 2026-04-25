import { useState } from 'react';
import { Mail, Phone, MessageSquare, Bell, ChevronRight, ChevronLeft, Check } from 'lucide-react';
import './Wizard.css';

function StepIndicator({ step }) {
  const steps = ['Documents', 'Rappels', 'Statut'];
  return (
    <div className="step-indicator-wrap">
      {steps.map((label, i) => {
        const idx = i + 1;
        const cls = idx < step ? 'done' : idx === step ? 'active' : 'pending';
        return (
          <div key={label} className="step-item">
            <div className="step-content">
              <div className={`step-dot ${cls}`}>
                {idx < step ? '✓' : idx}
              </div>
              <span className={`step-label ${cls}`}>{label}</span>
            </div>
            {i < steps.length - 1 && <div className={`step-line ${idx < step ? 'done' : ''}`} />}
          </div>
        );
      })}
    </div>
  );
}

const CHANNELS = [
  { id: 'email', icon: <Mail size={28} />, label: 'Email', desc: 'Rappels par e-mail', color: '#6366f1' },
  { id: 'sms',   icon: <Phone size={28} />, label: 'SMS', desc: 'Rappels par SMS', color: '#10b981' },
  { id: 'whatsapp', icon: <MessageSquare size={28} />, label: 'WhatsApp', desc: 'Rappels via WhatsApp', color: '#25D366' },
];

const TIMINGS = [
  { id: 30,  label: '1 mois avant' },
  { id: 60,  label: '2 mois avant' },
  { id: 90,  label: '3 mois avant' },
  { id: 180, label: '6 mois avant' },
];

export default function NotificationSetupPage({ onNext, onBack }) {
  const [channels, setChannels] = useState(['email']);
  const [timing, setTiming] = useState(30);
  const [contact, setContact] = useState('');

  const toggleChannel = (id) =>
    setChannels(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]);

  const handleNext = () => {
    const prefs = { channels, timing, contact };
    localStorage.setItem('remember_notif', JSON.stringify(prefs));
    onNext();
  };

  return (
    <div className="wizard-root">
      <div className="wizard-container animate-fade">
        <div className="wizard-nav-header">
          <div className="wizard-brand">
            <img src="/logo.svg" alt="Remember" />
          </div>
          <div className="wizard-header">
            <div className="wizard-avatar" style={{ margin: '0' }}>
              <Bell size={24} />
            </div>
            <div>
              <h2 className="wizard-title">Type de rappel</h2>
              <p className="wizard-sub">Choisissez comment vous souhaitez être alerté</p>
            </div>
          </div>
        </div>
        <StepIndicator step={2} />

        <div style={{ marginBottom: 24 }}>
          <label className="input-label" style={{ marginBottom: 12, display: 'block' }}>Canal de notification</label>
          <div className="notif-channels">
            {CHANNELS.map(ch => (
              <button
                key={ch.id}
                className={`notif-channel-btn ${channels.includes(ch.id) ? 'selected' : ''}`}
                style={{ '--ch-color': ch.color }}
                onClick={() => toggleChannel(ch.id)}
              >
                {channels.includes(ch.id) && <div className="notif-check"><Check size={12} /></div>}
                <div className="notif-ch-icon" style={{ color: ch.color }}>{ch.icon}</div>
                <div className="notif-ch-label">{ch.label}</div>
                <div className="notif-ch-desc">{ch.desc}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="input-group" style={{ marginBottom: 24 }}>
          <label className="input-label">Rappeler moi</label>
          <div className="timing-grid">
            {TIMINGS.map(t => (
              <button
                key={t.id}
                className={`timing-btn ${timing === t.id ? 'selected' : ''}`}
                onClick={() => setTiming(t.id)}
              >
                <Bell size={14} />
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="input-group" style={{ marginBottom: 32 }}>
          <label className="input-label">
            {channels.includes('sms') || channels.includes('whatsapp') ? 'Email ou Téléphone' : 'Email'}
          </label>
          <input
            className="input"
            placeholder={
              channels.includes('sms') || channels.includes('whatsapp')
                ? '06 00 00 00 00'
                : 'votre@email.fr'
            }
            value={contact}
            onChange={e => {
              let val = e.target.value;
              if (channels.includes('sms') || channels.includes('whatsapp')) {
                // Keep only digits and limit to 10 characters
                val = val.replace(/\D/g, '').slice(0, 10);
              }
              setContact(val);
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <button className="btn btn-secondary" onClick={onBack} style={{ flex: '0 0 auto', padding: '14px 20px' }}>
            <ChevronLeft size={18} />
          </button>
          <button className="btn btn-primary btn-full btn-lg" onClick={handleNext} 
            disabled={channels.length === 0 || !contact.trim()}>
            Voir le statut <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

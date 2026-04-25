import { useState, useMemo } from 'react';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { getDocumentStatus, formatDaysLeft } from '../utils/helpers';
import { getDocumentType, DOCUMENT_TYPES } from '../data/documentTypes';
import { Plus, Trash2, Edit2, Search, LogOut, Bell, Files, CheckCircle, AlertTriangle, AlertCircle } from 'lucide-react';
import './StatusDashboard.css';

function StepIndicator() {
  const steps = ['Documents', 'Rappels', 'Statut'];
  return (
    <div className="step-indicator">
      {steps.map((label, i) => (
        <div key={label} style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <div className="step-dot done">✓</div>
            <span style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 500 }}>{label}</span>
          </div>
          {i < steps.length - 1 && <div className="step-line done" style={{ marginBottom: 22 }} />}
        </div>
      ))}
    </div>
  );
}

const STATUS_ORDER = { expired: 0, critical: 1, warning: 2, ok: 3 };

function DocumentCard({ doc, onEdit, onDelete }) {
  const typeInfo = getDocumentType(doc.type);
  const status = getDocumentStatus(doc.expiryDate);
  const expiryFormatted = format(parseISO(doc.expiryDate), 'd MMMM yyyy', { locale: fr });

  return (
    <div className={`doc-card ${status.key}`}>
      <div className="doc-card-top">
        <div className="doc-card-icon" style={{ background: typeInfo.color + '22', color: typeInfo.color }}>
          {typeInfo.icon}
        </div>
        <div className="doc-card-info">
          <div className="doc-card-name">{doc.name}</div>
          <div className="doc-card-type">{typeInfo.label}</div>
        </div>
        <div className={`badge ${status.cssClass}`}>{status.label}</div>
      </div>
      <div className="doc-card-divider" />
      <div className="doc-card-bottom">
        <div className="doc-card-meta">
          <span className="doc-card-date">📅 {expiryFormatted}</span>
          <span className={`doc-card-days status-${status.key}`}>{formatDaysLeft(status.daysLeft)}</span>
        </div>
        <div className="doc-card-actions">
          <button className="btn btn-ghost btn-sm" title="Modifier" onClick={() => onEdit(doc)}>
            <Edit2 size={14} />
          </button>
          <button className="btn btn-ghost btn-sm" style={{ color: 'var(--status-critical)' }} title="Supprimer" onClick={() => onDelete(doc.id)}>
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, value, label, colorVar, bgVar }) {
  return (
    <div className="stat-card" style={{ background: `var(${bgVar || '--bg-card'})` }}>
      <div className="stat-icon" style={{ color: `var(${colorVar})` }}>{icon}</div>
      <div className="stat-val" style={{ color: `var(${colorVar})` }}>{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

export default function StatusDashboard({ user, documents, onAddDocument, onUpdateDocument, onDeleteDocument, onLogout, onAddMore }) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [editingDoc, setEditingDoc] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const sortedDocs = useMemo(() => {
    return [...documents]
      .map(d => ({ ...d, _status: getDocumentStatus(d.expiryDate) }))
      .sort((a, b) => STATUS_ORDER[a._status.key] - STATUS_ORDER[b._status.key]);
  }, [documents]);

  const filtered = sortedDocs.filter(d => {
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase()) ||
      getDocumentType(d.type).label.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || d._status.key === filter;
    return matchSearch && matchFilter;
  });

  const stats = useMemo(() => ({
    total: documents.length,
    expired: documents.filter(d => getDocumentStatus(d.expiryDate).key === 'expired').length,
    critical: documents.filter(d => getDocumentStatus(d.expiryDate).key === 'critical').length,
    warning: documents.filter(d => getDocumentStatus(d.expiryDate).key === 'warning').length,
    ok: documents.filter(d => getDocumentStatus(d.expiryDate).key === 'ok').length,
  }), [documents]);

  const notifPrefs = (() => { try { return JSON.parse(localStorage.getItem('remember_notif')); } catch { return null; } })();

  return (
    <div className="dashboard-root">
      {/* ── Header ── */}
      <header className="dash-header">
        <div className="dash-brand"><img src="/logo.svg" alt="Remember" style={{ height: 90, objectFit: 'contain', filter: 'drop-shadow(0 2px 8px rgba(240,192,64,0.3))' }} /></div>
        <div className="dash-user">
          {notifPrefs && (
            <div className="notif-pill">
              <Bell size={13} />
              {notifPrefs.channels?.map(c => c.toUpperCase()).join(' + ')}
            </div>
          )}
          <div className="user-avatar">{user?.name?.charAt(0)?.toUpperCase()}</div>
          <span className="user-name">{user?.name}</span>
          <button className="btn btn-ghost btn-sm" onClick={onLogout} title="Déconnexion">
            <LogOut size={15} />
          </button>
        </div>
      </header>

      <main className="dash-main">
        {/* ── Intro ── */}
        <div className="dash-intro animate-fade">
          <StepIndicator />
          <h1 className="dash-title">Statut de vos documents</h1>
          <p className="dash-sub">Vue complète de tous vos documents et leurs dates d'expiration</p>
        </div>

        {/* ── Stat cards ── */}
        <div className="stats-grid animate-fade">
          <StatCard icon={<Files size={20} />} value={stats.total} label="Total" colorVar="--text-primary" />
          <StatCard icon={<CheckCircle size={20} />} value={stats.ok} label="Valides" colorVar="--status-ok" />
          <StatCard icon={<AlertTriangle size={20} />} value={stats.warning} label="Bientôt" colorVar="--status-warning" />
          <StatCard icon={<AlertCircle size={20} />} value={stats.expired + stats.critical} label="Urgents" colorVar="--status-critical" />
        </div>

        {/* ── Toolbar ── */}
        <div className="dash-toolbar animate-fade">
          <div className="input-icon-wrap" style={{ flex: 1, maxWidth: 340 }}>
            <Search size={15} className="input-icon" />
            <input className="input" placeholder="Rechercher un document…" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="filter-pills">
            {['all','ok','warning','critical','expired'].map(f => (
              <button key={f} className={`filter-pill ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
                {f === 'all' ? 'Tous' : f === 'ok' ? '✅ Valides' : f === 'warning' ? '⚠️ Bientôt' : f === 'critical' ? '🔴 Urgents' : '☠️ Expirés'}
              </button>
            ))}
          </div>
          <button className="btn btn-primary btn-sm" onClick={onAddMore}>
            <Plus size={15} /> Ajouter
          </button>
        </div>

        {/* ── Document grid ── */}
        {filtered.length === 0 ? (
          <div className="empty-state animate-fade">
            <div className="empty-icon">📭</div>
            <h3>Aucun document trouvé</h3>
            <p>{documents.length === 0 ? 'Commencez par ajouter vos documents importants.' : 'Aucun document ne correspond à votre recherche.'}</p>
            {documents.length === 0 && (
              <button className="btn btn-primary" onClick={onAddMore} style={{ marginTop: 16 }}>
                <Plus size={16} /> Ajouter un document
              </button>
            )}
          </div>
        ) : (
          <div className="docs-grid animate-fade">
            {filtered.map(doc => (
              <DocumentCard key={doc.id} doc={doc} onEdit={setEditingDoc} onDelete={onDeleteDocument} />
            ))}
          </div>
        )}
      </main>

      {/* ── Edit modal ── */}
      {editingDoc && (
        <EditModal
          doc={editingDoc}
          onSave={(updates) => { onUpdateDocument(editingDoc.id, updates); setEditingDoc(null); }}
          onClose={() => setEditingDoc(null)}
        />
      )}
    </div>
  );
}

function EditModal({ doc, onSave, onClose }) {
  const typeInfo = getDocumentType(doc.type);
  const [form, setForm] = useState({ type: doc.type, name: doc.name, expiryDate: doc.expiryDate, notes: doc.notes || '' });
  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal animate-slide" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">✏️ Modifier le document</h3>
          <button className="btn btn-ghost btn-sm" onClick={onClose}>✕</button>
        </div>
        <div className="input-group" style={{ marginBottom: 16 }}>
          <label className="input-label">Type</label>
          <select className="input" name="type" value={form.type} onChange={handle}>
            {DOCUMENT_TYPES.map(t => <option key={t.id} value={t.id}>{t.icon} {t.label}</option>)}
          </select>
        </div>
        <div className="input-group" style={{ marginBottom: 16 }}>
          <label className="input-label">Nom / Référence</label>
          <input className="input" name="name" value={form.name} onChange={handle} />
        </div>
        <div className="input-group" style={{ marginBottom: 16 }}>
          <label className="input-label">Date d'expiration</label>
          <input className="input" type="date" name="expiryDate" value={form.expiryDate} onChange={handle} />
        </div>
        <div className="input-group" style={{ marginBottom: 24 }}>
          <label className="input-label">Notes (optionnel)</label>
          <input className="input" name="notes" value={form.notes} onChange={handle} placeholder="Remarques…" />
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button className="btn btn-secondary" onClick={onClose} style={{ flex: 1 }}>Annuler</button>
          <button className="btn btn-primary" onClick={() => onSave(form)} style={{ flex: 2 }}>Enregistrer</button>
        </div>
      </div>
    </div>
  );
}

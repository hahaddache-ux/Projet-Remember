import { useState } from "react";
import { DOCUMENT_TYPES } from "../data/documentTypes";
import {
  Plus,
  Trash2,
  CalendarDays,
  FileText,
  ChevronRight,
  LogOut,
} from "lucide-react";
import "./Wizard.css";

function StepIndicator({ step }) {
  const steps = ["Documents", "Rappels", "Statut"];
  return (
    <div className="step-indicator-wrap">
      {steps.map((label, i) => {
        const idx = i + 1;
        const cls = idx < step ? "done" : idx === step ? "active" : "pending";
        return (
          <div key={label} className="step-item">
            <div className="step-content">
              <div className={`step-dot ${cls}`}>{idx < step ? "✓" : idx}</div>
              <span className={`step-label ${cls}`}>{label}</span>
            </div>
            {i < steps.length - 1 && (
              <div className={`step-line ${idx < step ? "done" : ""}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

const EMPTY_DOC = { type: "cni", name: "", expiryDate: "" };

export default function DocumentSelectPage({
  user,
  documents,
  onAddDocument,
  onNext,
  onBack,
  onLogout,
}) {
  const [docs, setDocs] = useState([{ ...EMPTY_DOC }]);

  const updateDoc = (i, field, value) =>
    setDocs((prev) =>
      prev.map((d, idx) => (idx === i ? { ...d, [field]: value } : d)),
    );

  const addRow = () => setDocs((prev) => [...prev, { ...EMPTY_DOC }]);
  const removeRow = (i) =>
    setDocs((prev) => prev.filter((_, idx) => idx !== i));

  const handleSubmit = () => {
    const valid = docs.filter((d) => d.name.trim() && d.expiryDate);
    if (valid.length === 0) return;
    valid.forEach((d) => {
      const typeInfo = DOCUMENT_TYPES.find((t) => t.id === d.type);
      onAddDocument({ ...d, label: typeInfo?.label || d.type });
    });
    onNext();
  };

  return (
    <div className="wizard-root">
      <div className="wizard-container animate-fade">
        <div className="wizard-nav-header">
            <div className="wizard-nav-top">        {/* ← ZID HAD DIV */}
          <div className="wizard-brand">
            <img src="/logo.svg" alt="Remember" />
          </div>
          <button
      onClick={onLogout}
      style={{
        display: "flex",
    alignItems: "center",
    gap: 6,
    background: "rgba(99, 102, 241, 0.15)",
    border: "1px solid rgba(99, 102, 241, 0.2)",
    borderRadius: "var(--radius-full)",
    padding: "6px 14px",
    fontSize: 11,
    fontWeight: 600,
    color: "var(--accent-light)",
    cursor: "pointer",
    letterSpacing: "0.05em",
    textTransform: "uppercase",
      }}
    >
      <LogOut size={14} /> Déconnexion
    </button>
  </div> 
          <div className="wizard-header">
            <div className="wizard-avatar">
              {user?.name?.charAt(0)?.toUpperCase() || "👤"}
            </div>
            <div>
              <h2 className="wizard-title">Bonjour, {user?.name} 👋</h2>
              <p className="wizard-sub">Ajoutez vos documents à surveiller</p>
            </div>
            
          </div>
          
          
        </div>
        
        <StepIndicator step={1} />

        <div className="doc-rows">
          {docs.map((doc, i) => (
            <div key={i} className="doc-row card">
              <div className="doc-row-head">
                <span style={{ fontSize: 22 }}>
                  {DOCUMENT_TYPES.find((t) => t.id === doc.type)?.icon}
                </span>
                <span style={{ fontWeight: 600, fontSize: 14 }}>
                  Document {i + 1}
                </span>
                {docs.length > 1 && (
                  <button
                    className="btn btn-ghost btn-sm"
                    style={{
                      marginLeft: "auto",
                      color: "var(--status-critical)",
                    }}
                    onClick={() => removeRow(i)}
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
              <div className="doc-row-body">
                <div className="input-group">
                  <label className="input-label">Type</label>
                  <select
                    className="input"
                    value={doc.type}
                    onChange={(e) => updateDoc(i, "type", e.target.value)}
                  >
                    {DOCUMENT_TYPES.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.icon} {t.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="input-group">
                  <label className="input-label">Nom / Référence</label>
                  <div className="input-icon-wrap">
                    <FileText size={15} className="input-icon" />
                    <input
                      className="input"
                      placeholder="ex: CNI de Jean"
                      value={doc.name}
                      onChange={(e) => updateDoc(i, "name", e.target.value)}
                    />
                  </div>
                </div>
                <div className="input-group">
                  <label className="input-label">Date d'expiration</label>
                  <div className="input-icon-wrap">
                    <CalendarDays size={15} className="input-icon" />
                    <input
                      className="input"
                      type="date"
                      value={doc.expiryDate}
                      onChange={(e) =>
                        updateDoc(i, "expiryDate", e.target.value)
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          className="btn btn-secondary btn-full"
          onClick={addRow}
          style={{ gap: 8 }}
        >
          <Plus size={16} /> Ajouter un autre document
        </button>

        <div style={{ marginTop: 24, display: "flex", gap: 12 }}>
          {onBack && (
            <button
              className="btn btn-secondary btn-lg"
              onClick={onBack}
              style={{ flex: 1 }}
            >
              Retour
            </button>
          )}
          <button
            className="btn btn-primary btn-lg"
            onClick={handleSubmit}
            style={{ flex: 2 }}
            disabled={docs.every((d) => !d.name.trim() || !d.expiryDate)}
          >
            Continuer <ChevronRight size={18} />
          </button>
        </div>

        {documents.length > 0 && (
          <p
            style={{
              textAlign: "center",
              color: "var(--text-muted)",
              fontSize: 13,
              marginTop: 12,
            }}
          >
            {documents.length} document(s) déjà enregistré(s)
          </p>
        )}
      </div>
    </div>
  );
}

import { useState } from 'react';
import { Eye, EyeOff, Shield, Mail, Lock, User } from 'lucide-react';
import './Login.css';

export default function LoginPage({ onLogin }) {
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handle = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.email || !form.password) { setError('Veuillez remplir tous les champs.'); return; }
    if (mode === 'signup' && !form.name) { setError('Veuillez entrer votre prénom.'); return; }
    
    setLoading(true);
    
    try {
      const endpoint = mode === 'signup' ? 'signup' : 'login';
      const body = mode === 'signup' 
        ? { name: form.name, email: form.email, password: form.password }
        : { email: form.email, password: form.password };

      const res = await fetch(`http://localhost:3000/api/auth/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Erreur d\'authentification');
        setLoading(false);
        return;
      }

      // Stocker le token et passer les infos au parent
      localStorage.setItem('remember_token', data.token);
      localStorage.setItem('remember_user', JSON.stringify(data.user));
      
      onLogin(data.user);
    } catch (err) {
      setError(err.message || 'Erreur serveur');
      setLoading(false);
    }
  };

  return (
    <div className="login-root">
      {/* Left – decorative */}
      <div className="login-left">
        <div className="login-brand animate-float">
          <img src="/logo.svg" alt="Remember" className="login-logo-img" />
        </div>
        <p className="login-tagline">
          Ne laissez plus jamais un document important expirer.<br />
          <span>Vos documents. Toujours à jour.</span>
        </p>
        <div className="login-stats">
          {[
            { n: '8+', l: 'Types de documents' },
            { n: '100%', l: 'Données locales' },
            { n: 'SMS & Email', l: 'Rappels intelligents' },
          ].map(s => (
            <div className="login-stat" key={s.n}>
              <div className="login-stat-n">{s.n}</div>
              <div className="login-stat-l">{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right – form */}
      <div className="login-right">
        <div className="login-card animate-slide">
          <div className="login-card-header">
            <div className="login-card-icon"><Shield size={22} /></div>
            <h2>{mode === 'login' ? 'Connexion' : 'Créer un compte'}</h2>
            <p>{mode === 'login' ? 'Accédez à vos documents' : 'Commencez à suivre vos documents'}</p>
          </div>

          {error && <div className="login-error">{error}</div>}

          <form onSubmit={submit} className="login-form">
            {mode === 'signup' && (
              <div className="input-group">
                <label className="input-label">Prénom</label>
                <div className="input-icon-wrap">
                  <User size={16} className="input-icon" />
                  <input className="input" name="name" placeholder="Jean" value={form.name} onChange={handle} />
                </div>
              </div>
            )}
            <div className="input-group">
              <label className="input-label">Email</label>
              <div className="input-icon-wrap">
                <Mail size={16} className="input-icon" />
                <input className="input" type="email" name="email" placeholder="jean@exemple.fr" value={form.email} onChange={handle} />
              </div>
            </div>
            <div className="input-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="input-label">Mot de passe</label>
                {mode === 'login' && (
                  <button
                    type="button"
                    className="forgot-password-link"
                    onClick={() => {
                        setError('');
                        alert('Un email de réinitialisation vous a été envoyé à : ' + (form.email || 'votre adresse mail'));
                    }}
                  >
                    Mot de passe oublié ?
                  </button>
                )}
              </div>
              <div className="input-icon-wrap">
                <Lock size={16} className="input-icon" />
                <input
                  className="input" style={{ paddingRight: 44 }}
                  type={showPwd ? 'text' : 'password'}
                  name="password" placeholder="••••••••"
                  value={form.password} onChange={handle}
                />
                <button type="button" className="pwd-toggle" onClick={() => setShowPwd(s => !s)}>
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
              {loading ? <span className="spinner" /> : mode === 'login' ? 'Se connecter' : "S'inscrire"}
            </button>
          </form>

          <div className="login-switch">
            {mode === 'login' ? (
              <> Pas encore de compte ?{' '}
                <button onClick={() => { setMode('signup'); setError(''); }}>Créer un compte</button>
              </>
            ) : (
              <> Déjà un compte ?{' '}
                <button onClick={() => { setMode('login'); setError(''); }}>Se connecter</button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

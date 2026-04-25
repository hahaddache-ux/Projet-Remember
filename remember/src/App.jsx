import { useState } from "react";
import { useAuth, useDocuments } from "./hooks/useApp";
import LoginPage from "./pages/LoginPage";
import DocumentSelectPage from "./pages/DocumentSelectPage";
import NotificationSetupPage from "./pages/NotificationSetupPage";
import StatusDashboard from "./pages/StatusDashboard";

// App flow: login → selectDocs → setupNotif → dashboard
// On subsequent visits (user already logged in + has docs): go straight to dashboard

function getInitialStep(user, documents) {
  if (!user) return "login";
  if (documents.length === 0) return "selectDocs";
  return "dashboard";
}

export default function App() {
  const { user, login, logout } = useAuth();
  const { documents, addDocument, updateDocument, deleteDocument } =
    useDocuments();
  const [step, setStep] = useState(() => getInitialStep(user, documents));

  const handleLogin = (userData) => {
    login(userData);
    setStep(documents.length === 0 ? "selectDocs" : "dashboard");
  };

  const handleLogout = () => {
    logout();
    setStep("login");
  };

  const handleDocsNext = () => setStep("setupNotif");
  const handleNotifNext = () => setStep("dashboard");
  const handleAddMore = () => setStep("selectDocs");

  return (
    <>
      {step === "login" && <LoginPage onLogin={handleLogin} />}
      {step === "selectDocs" && (
        <DocumentSelectPage
          user={user}
          documents={documents}
          onAddDocument={addDocument}
          onNext={handleDocsNext}
          onBack={documents.length > 0 ? () => setStep("dashboard") : null}
          onLogout={handleLogout}
        />
      )}
      {step === "setupNotif" && (
        <NotificationSetupPage
          onNext={handleNotifNext}
          onBack={() => setStep("selectDocs")}
          onLogout={handleLogout}
        />
      )}
      {step === "dashboard" && (
        <StatusDashboard
          user={user}
          documents={documents}
          onAddDocument={addDocument}
          onUpdateDocument={updateDocument}
          onDeleteDocument={deleteDocument}
          onLogout={handleLogout}
          onAddMore={handleAddMore}
        />
      )}
    </>
  );
}

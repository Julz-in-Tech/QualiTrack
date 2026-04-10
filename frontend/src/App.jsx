import { useState } from "react";
import { useAuth } from "./contexts/AuthContext";
import AppShell from "./components/AppShell";
import IncomingQC from "./pages/IncomingQC";
import NCRForm from "./pages/NCRForm";
import LoginPage from "./pages/LoginPage";

function App() {
  const { currentUser } = useAuth();
  const [currentPage, setCurrentPage] = useState("incoming");

  if (!currentUser) {
    return <LoginPage />;
  }

  function renderPage() {
    switch (currentPage) {
      case "incoming":
        return <IncomingQC />;
      case "ncr":
        return <NCRForm />;
      default:
        return <IncomingQC />;
    }
  }

  return (
    <AppShell currentUser={currentUser} currentPage={currentPage} setCurrentPage={setCurrentPage}>
      {renderPage()}
    </AppShell>
  );
}

export default App;

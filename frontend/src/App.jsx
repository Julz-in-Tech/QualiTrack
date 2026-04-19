import { useState } from "react";
import { useAuth } from "./contexts/AuthContext";
import AppShell from "./components/AppShell";
import ReceivingInspection from "./pages/ReceivingInspection";
import InternalInspection from "./pages/InternalInspection";
import NCRForm from "./pages/NCRForm";
import AuthPage from "./pages/AuthPage";

function App() {
  const { currentUser } = useAuth();
  const [currentPage, setCurrentPage] = useState("receiving");

  if (!currentUser) {
    return <AuthPage />;
  }

  function renderPage() {
    switch (currentPage) {
      case "receiving":
        return <ReceivingInspection setCurrentPage={setCurrentPage} />;
      case "internal":
        return <InternalInspection setCurrentPage={setCurrentPage} />;
      case "ncr":
        return <NCRForm />;
      default:
        return <ReceivingInspection setCurrentPage={setCurrentPage} />;
    }
  }

  return (
    <AppShell currentUser={currentUser} currentPage={currentPage} setCurrentPage={setCurrentPage}>
      {renderPage()}
    </AppShell>
  );
}

export default App;

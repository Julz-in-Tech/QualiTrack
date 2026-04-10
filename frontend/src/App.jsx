import { useAuth } from "./contexts/AuthContext";
import AppShell from "./components/AppShell";
import IncomingQC from "./pages/IncomingQC";
import LoginPage from "./pages/LoginPage";

function App() {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <LoginPage />;
  }

  return (
    <AppShell currentUser={currentUser}>
      <IncomingQC />
    </AppShell>
  );
}

export default App;

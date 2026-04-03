import { useState } from "react";
import AppShell from "./components/AppShell";
import IncomingQC from "./pages/IncomingQC";
import LoginPage from "./pages/LoginPage";
import { loginUser } from "./services/api";

const AUTH_STORAGE_KEY = "qualitrack.currentUser";

function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const storedUser = window.localStorage.getItem(AUTH_STORAGE_KEY);
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      return null;
    }
  });

  async function handleLogin(credentials) {
    const data = await loginUser(credentials);
    setCurrentUser(data.user);
    window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(data.user));
  }

  function handleLogout() {
    setCurrentUser(null);
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
  }

  if (!currentUser) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <AppShell currentUser={currentUser} onLogout={handleLogout}>
      <IncomingQC />
    </AppShell>
  );
}

export default App;

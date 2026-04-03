import { useState } from "react";

const demoAccounts = [
  {
    role: "Admin",
    email: "admin@qualitrack.local",
    password: "Admin123!",
  },
  {
    role: "QC Inspector",
    email: "inspector@qualitrack.local",
    password: "Inspect123!",
  },
];

function LoginPage({ onLogin }) {
  const [form, setForm] = useState({
    email: demoAccounts[0].email,
    password: demoAccounts[0].password,
  });
  const [message, setMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function useDemoAccount(account) {
    setForm({
      email: account.email,
      password: account.password,
    });
    setMessage(null);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      await onLogin(form);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="auth-screen">
      <section className="auth-layout">
        <article className="auth-hero">
          <div className="auth-brand">
            <span className="auth-brand-mark">Q</span>
            <div className="auth-brand-copy">
              <strong>QualiTrack</strong>
              <span>Quality Control System</span>
            </div>
          </div>
          <span className="auth-kicker">Secure Access</span>
          <h1>Sign in to the quality control workspace.</h1>
          <p>Choose a demo account or sign in with your own details.</p>

          <div className="auth-shortcuts">
            {demoAccounts.map((account) => (
              <button
                className="demo-button"
                key={account.email}
                type="button"
                onClick={() => useDemoAccount(account)}
              >
                <strong>{account.role}</strong>
                <span>{account.email}</span>
              </button>
            ))}
          </div>
        </article>

        <article className="auth-card">
          <div className="panel-header">
            <div>
              <h2>Login</h2>
              <p className="subtle">Enter your email and password.</p>
            </div>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={updateField}
                placeholder="admin@qualitrack.local"
                required
              />
            </div>

            <div className="field">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                value={form.password}
                onChange={updateField}
                placeholder="Enter your password"
                required
              />
            </div>

            <button className="primary-button" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {message ? <div className="message error">{message}</div> : null}

          <div className="auth-note">
            <strong>Demo access</strong>
            <p>`Admin123!` for admin or `Inspect123!` for QC inspector.</p>
          </div>
        </article>
      </section>
    </main>
  );
}

export default LoginPage;

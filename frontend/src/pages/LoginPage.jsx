import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

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

function LoginPage() {
  const { login } = useAuth();
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
      await login(form.email, form.password);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main style={{
      minHeight: '100vh',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
      backgroundColor: '#f8fafc',
      color: '#1f2937',
      padding: '2rem'
    }}>
      <section style={{
        display: 'flex',
        maxWidth: '1200px',
        margin: '0 auto',
        gap: '2rem'
      }}>
        <article style={{
          flex: 1,
          textAlign: 'center',
          padding: '2rem'
        }}>
          <div style={{
            display: 'inline-block',
            marginBottom: '2rem'
          }}>
            <span style={{
              display: 'inline-block',
              width: '60px',
              height: '60px',
              backgroundColor: '#3b82f6',
              color: 'white',
              borderRadius: '50%',
              textAlign: 'center',
              lineHeight: '60px',
              fontSize: '1.5rem',
              fontWeight: 'bold',
              marginRight: '0.5rem'
            }}>Q</span>
            <div style={{ display: 'inline-block', verticalAlign: 'middle' }}>
              <strong style={{ fontSize: '1.5rem', color: '#1f2937' }}>QualiTrack</strong>
              <span style={{ fontSize: '1rem', color: '#6b7280' }}> Quality Control System</span>
            </div>
          </div>
          <h1 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#1f2937' }}>Sign in to your quality control workspace.</h1>
          <p style={{ marginBottom: '2rem', color: '#6b7280' }}>Choose a demo account or sign in with your own details.</p>

          <div style={{ marginBottom: '2rem' }}>
            {demoAccounts.map((account) => (
              <button
                key={account.email}
                type="button"
                onClick={() => useDemoAccount(account)}
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '0.75rem',
                  marginBottom: '0.5rem',
                  backgroundColor: '#f3f4f6',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.375rem',
                  cursor: 'pointer',
                  fontSize: '0.875rem'
                }}
              >
                <strong>{account.role}</strong>
                <span style={{ marginLeft: '0.5rem' }}>{account.email}</span>
              </button>
            ))}
          </div>
        </article>

        <article style={{
          flex: 1,
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '0.5rem',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          maxWidth: '400px'
        }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: '#1f2937' }}>Login</h2>
            <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>Enter your email and password.</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1rem' }}>
              <label htmlFor="email" style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                fontWeight: '500' 
              }}>Email</label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={updateField}
                autoComplete="username"
                placeholder="admin@qualitrack.local"
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  fontSize: '1rem'
                }}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label htmlFor="password" style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                fontWeight: '500' 
              }}>Password</label>
              <input
                id="password"
                name="password"
                type="password"
                value={form.password}
                onChange={updateField}
                autoComplete="current-password"
                placeholder="Enter your password"
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  fontSize: '1rem'
                }}
              />
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              style={{
                width: '100%',
                padding: '0.75rem',
                backgroundColor: isSubmitting ? '#9ca3af' : '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '0.375rem',
                fontSize: '1rem',
                cursor: isSubmitting ? 'not-allowed' : 'pointer'
              }}
            >
              {isSubmitting ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {message ? <div style={{ 
            marginTop: '1rem', 
            padding: '0.75rem', 
            backgroundColor: '#fef2f2', 
            border: '1px solid #fecaca', 
            borderRadius: '0.375rem', 
            color: '#dc2626' 
          }}>{message}</div> : null}

          <div style={{ 
            marginTop: '1.5rem', 
            padding: '1rem', 
            backgroundColor: '#f8fafc', 
            border: '1px solid #e5e7eb', 
            borderRadius: '0.375rem' 
          }}>
            <strong>Demo access</strong>
            <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#6b7280' }}>
              `Admin123!` for admin or `Inspect123!` for QC inspector.
            </p>
          </div>
        </article>
      </section>
    </main>
  );
}

export default LoginPage;

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Lock, Mail, ShieldCheck } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Please enter a valid work email")
    .max(255, "Email is too long"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password is too long"),
});

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
  const [show, setShow] = useState(false);
  const { login } = useAuth();
  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values) {
    try {
      await login(values.email, values.password);
    } catch (error) {
      form.setError("root", { message: error.message });
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      background: 'linear-gradient(to bottom right, rgba(243, 244, 246, 0.4), white, rgba(59, 130, 246, 0.1))'
    }}>
      <div style={{
        position: 'relative',
        width: '100%',
        overflow: 'hidden',
        backgroundColor: 'white',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        border: '1px solid rgba(229, 231, 235, 0.5)',
        minHeight: '100vh'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          minHeight: '100vh'
        }}>
          <BrandPanel />
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
            '@media (min-width: 768px)': {
              padding: '2.5rem'
            }
          }}>
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}

function BrandPanel() {
  return (
    <div
      style={{
        position: 'relative',
        display: 'none',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        background: 'linear-gradient(to bottom right, #3b82f6, #1e40af)',
        padding: '2.5rem',
        color: 'white',
        '@media (min-width: 768px)': {
          display: 'flex'
        },
        borderTopRightRadius: '40% 60%',
        borderBottomRightRadius: '40% 60%'
      }}
    >
      <div style={{
        position: 'absolute',
        left: '-4rem',
        top: '-4rem',
        width: '14rem',
        height: '14rem',
        borderRadius: '50%',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        filter: 'blur(40px)',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-5rem',
        right: '-2.5rem',
        width: '18rem',
        height: '18rem',
        borderRadius: '50%',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        filter: 'blur(64px)',
        pointerEvents: 'none'
      }} />

      <div style={{
        position: 'relative',
        zIndex: 10,
        maxWidth: '20rem',
        textAlign: 'center'
      }}>
        <div style={{
          margin: '0 auto 1.5rem',
          display: 'flex',
          height: '3.5rem',
          width: '3.5rem',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '1rem',
          backgroundColor: 'rgba(255, 255, 255, 0.15)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          backdropFilter: 'blur(10px)'
        }}>
          <ShieldCheck style={{ height: '1.75rem', width: '1.75rem' }} />
        </div>
        <h2 style={{
          fontSize: '2rem',
          fontWeight: 'bold',
          letterSpacing: '-0.025em',
          '@media (min-width: 640px)': {
            fontSize: '2.25rem'
          }
        }}>QualiTrack</h2>
        <p style={{
          marginTop: '0.75rem',
          fontSize: '0.875rem',
          color: 'rgba(255, 255, 255, 0.85)'
        }}>
          Quality control & receiving inspection, built for your team.
        </p>
      </div>
    </div>
  );
}

function LoginForm() {
  const [show, setShow] = useState(false);
  const { login } = useAuth();
  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values) {
    try {
      await login(values.email, values.password);
    } catch (error) {
      form.setError("root", { message: error.message });
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} style={{ width: '100%', maxWidth: '24rem' }}>
      <div style={{
        marginBottom: '1.25rem',
        textAlign: 'center',
        '@media (min-width: 768px)': {
          textAlign: 'left'
        }
      }}>
        <div style={{
          marginBottom: '1rem',
          display: 'inline-flex',
          height: '2.5rem',
          width: '2.5rem',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '0.75rem',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          color: '#1e40af',
          '@media (min-width: 768px)': {
            display: 'none'
          }
        }}>
          <ShieldCheck style={{ height: '1.25rem', width: '1.25rem' }} />
        </div>
        <h1 style={{
          fontSize: '1.875rem',
          fontWeight: 'bold',
          letterSpacing: '-0.025em'
        }}>Sign in</h1>
        <p style={{
          fontSize: '0.875rem',
          color: '#6b7280'
        }}>
          Use your company account to access QualiTrack.
        </p>
      </div>

      <FieldWithIcon
        id="email"
        label="Work email"
        icon={<Mail style={{ height: '1rem', width: '1rem' }} />}
        error={form.formState.errors.email?.message}
      >
        <input
          id="email"
          type="email"
          placeholder="you@company.com"
          maxLength={255}
          autoComplete="email"
          {...form.register("email")}
          style={{
            width: '100%',
            padding: '0.75rem',
            border: 'none',
            backgroundColor: 'transparent',
            fontSize: '1rem',
            outline: 'none'
          }}
        />
      </FieldWithIcon>

      <FieldWithIcon
        id="password"
        label="Password"
        icon={<Lock style={{ height: '1rem', width: '1rem' }} />}
        error={form.formState.errors.password?.message}
        trailing={
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            style={{
              color: '#6b7280',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              padding: '0.5rem'
            }}
            aria-label={show ? "Hide password" : "Show password"}
          >
            {show ? <EyeOff style={{ height: '1rem', width: '1rem' }} /> : <Eye style={{ height: '1rem', width: '1rem' }} />}
          </button>
        }
      >
        <input
          id="password"
          type={show ? "text" : "password"}
          placeholder="Password"
          maxLength={128}
          autoComplete="current-password"
          {...form.register("password")}
          style={{
            width: '100%',
            padding: '0.75rem',
            border: 'none',
            backgroundColor: 'transparent',
            fontSize: '1rem',
            outline: 'none'
          }}
        />
      </FieldWithIcon>

      <div style={{
        display: 'flex',
        justifyContent: 'flex-end'
      }}>
        <button
          type="button"
          style={{
            fontSize: '0.75rem',
            color: '#6b7280',
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            textDecoration: 'underline',
            textDecorationOffset: '2px'
          }}
          onClick={() => alert("Contact your administrator to reset your password.")}
        >
          Forgot password?
        </button>
      </div>

      <button
        type="submit"
        disabled={form.formState.isSubmitting}
        style={{
          width: '100%',
          borderRadius: '9999px',
          background: 'linear-gradient(to right, #1e40af, #3b82f6)',
          padding: '1.5rem',
          fontSize: '1rem',
          fontWeight: '600',
          color: 'white',
          border: 'none',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
          cursor: form.formState.isSubmitting ? 'not-allowed' : 'pointer',
          opacity: form.formState.isSubmitting ? 0.7 : 1
        }}
      >
        Sign in
      </button>

      <p style={{
        textAlign: 'center',
        fontSize: '0.75rem',
        color: '#6b7280',
        marginTop: '1.25rem'
      }}>
        Need access?{" "}
        <button
          type="button"
          onClick={() => alert("Please contact your QualiTrack administrator.")}
          style={{
            fontWeight: '500',
            color: '#1e40af',
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            textDecoration: 'underline',
            textDecorationOffset: '2px'
          }}
        >
          Contact your administrator
        </button>
      </p>

      {form.formState.errors.root && (
        <p style={{
          marginTop: '1rem',
          padding: '0.75rem',
          backgroundColor: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '0.375rem',
          color: '#dc2626',
          fontSize: '0.875rem'
        }}>
          {form.formState.errors.root.message}
        </p>
      )}
    </form>
  );
}

function FieldWithIcon({
  id,
  label,
  icon,
  trailing,
  error,
  children,
}) {
  return (
    <div style={{ marginBottom: '0.375rem' }}>
      <label htmlFor={id} style={{
        position: 'absolute',
        width: '1px',
        height: '1px',
        padding: '0',
        margin: '-1px',
        overflow: 'hidden',
        clip: 'rect(0, 0, 0, 0)',
        whiteSpace: 'nowrap',
        border: '0'
      }}>
        {label}
      </label>
      <div
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          borderRadius: '9999px',
          border: error ? '1px solid rgba(220, 38, 38, 0.6)' : '1px solid #e5e7eb',
          backgroundColor: 'rgba(243, 244, 246, 0.4)',
          paddingLeft: '1rem',
          paddingRight: '0.75rem',
          transition: 'all 0.15s ease-in-out'
        }}
      >
        <span style={{ color: '#6b7280' }}>{icon}</span>
        <div style={{ flex: 1 }}>
          {children}
        </div>
        {trailing}
      </div>
      {error && <p style={{
        paddingLeft: '1rem',
        fontSize: '0.75rem',
        color: '#dc2626'
      }}>{error}</p>}
    </div>
  );
}

export default LoginPage;

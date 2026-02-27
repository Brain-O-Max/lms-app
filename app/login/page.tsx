'use client';

import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function LoginPage() {
  const { isLoggedIn, login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (isLoggedIn) {
      router.push('/');
    }
  }, [isLoggedIn, router]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(email, password);
    if (!success) {
      alert('অবৈধ মোবাইল নম্বর। অনুগ্রহ করে নিচের ডেমো নম্বরগুলির একটি ব্যবহার করুন।');
      return;
    }
    router.push('/');
  };

  return (
    <>
      <div className="auth-page">
        <div className="auth-container">
          <div className="auth-card">
            <div className="auth-logo">
              <h1>📚 LMS Solution</h1>
              <p>Digital Financial Literacy Platform</p>
            </div>

            <div className="auth-title">
              <h2>Welcome Back</h2>
              <p>Sign in to continue your learning journey</p>
            </div>

            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label className="form-label form-label-required" htmlFor="email">
                  মোবাইল নম্বর (User ID)
                </label>
                <div className="form-input-icon">
                  <span className="icon">📱</span>
                  <input
                    type="tel"
                    id="email"
                    className="form-input"
                    placeholder="01XXXXXXXXX"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label form-label-required" htmlFor="password">
                  Password
                </label>
                <div className="form-input-icon">
                  <span className="icon">🔒</span>
                  <input
                    type="password"
                    id="password"
                    className="form-input"
                    placeholder="Enter your password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-footer">
                <div className="form-check">
                  <input type="checkbox" id="remember" className="form-check-input" />
                  <label htmlFor="remember" className="form-check-label">
                    Remember me
                  </label>
                </div>
                <a href="#" className="forgot-link">
                  Forgot password?
                </a>
              </div>

              <button type="submit" className="btn btn-primary btn-lg btn-full">
                Sign In
              </button>
            </form>

            <div className="auth-divider">
              <span>OR</span>
            </div>

            <div className="auth-footer">
              Don&apos;t have an account?
              <Link href="/register">Create Account</Link>
            </div>

            {/* Demo Credentials */}
            <div
              style={{
                marginTop: 'var(--space-xl)',
                padding: 'var(--space-lg)',
                background: 'var(--info-light)',
                borderRadius: 'var(--radius-lg)',
                border: '2px solid var(--info)',
              }}
            >
              <p style={{ fontWeight: 700, marginBottom: 'var(--space-sm)', color: 'var(--gray-900)' }}>
                🔑 ডেমো লগইন (যেকোনো পাসওয়ার্ড):
              </p>
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--gray-700)', lineHeight: 1.8 }}>
                <div><strong>Admin:</strong> 01700000001</div>
                <div><strong>Head Office:</strong> 01700000002</div>
                <div><strong>Territory Manager:</strong> 01700000003</div>
                <div><strong>Unit Manager:</strong> 01700000004</div>
                <div><strong>RO:</strong> 01700000005</div>
                <div><strong>Beneficiary:</strong> 01700000006</div>
              </div>
            </div>
          </div>

          <div
            style={{
              textAlign: 'center',
              marginTop: 'var(--space-lg)',
              color: 'rgba(255,255,255,0.8)',
              fontSize: 'var(--text-sm)',
            }}
          >
            <p>© 2026 LMS Solution. All rights reserved.</p>
          </div>
        </div>
      </div>
    </>
  );
}

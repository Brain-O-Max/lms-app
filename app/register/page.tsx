'use client';

import Link from 'next/link';

export default function RegisterPage() {
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
              <h2>Create Account</h2>
              <p>Register for access to learning materials</p>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); alert('Registration will be implemented in the backend'); }}>
              <div className="form-row"><div className="form-group"><label className="form-label form-label-required">First Name</label><input type="text" className="form-input" placeholder="Enter first name" required /></div><div className="form-group"><label className="form-label form-label-required">Last Name</label><input type="text" className="form-input" placeholder="Enter last name" required /></div></div>
              <div className="form-group"><label className="form-label form-label-required">Mobile Number</label><input type="tel" className="form-input" placeholder="01XXXXXXXXX" required /></div>
              <div className="form-group"><label className="form-label form-label-required">Email</label><input type="email" className="form-input" placeholder="email@example.com" required /></div>
              <div className="form-group"><label className="form-label form-label-required">Password</label><input type="password" className="form-input" placeholder="Create a password" required /></div>
              <div className="form-group"><label className="form-label form-label-required">Confirm Password</label><input type="password" className="form-input" placeholder="Confirm your password" required /></div>
              <button type="submit" className="btn btn-primary btn-lg btn-full" style={{ marginTop: 'var(--space-md)' }}>Create Account</button>
            </form>
            <div className="auth-footer">Already have an account?<Link href="/login">Sign In</Link></div>
          </div>
          <div style={{ textAlign: 'center', marginTop: 'var(--space-lg)', color: 'rgba(255,255,255,0.8)', fontSize: 'var(--text-sm)' }}><p>© 2026 LMS Solution. All rights reserved.</p></div>
        </div>
      </div>
    </>
  );
}

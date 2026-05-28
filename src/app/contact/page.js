'use client';
import { useState } from 'react';
import { useToast } from '@/context/ToastContext';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const { showToast } = useToast();
  const update = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const handleSubmit = (e) => { e.preventDefault(); showToast('Thank you — we\'ll be in touch soon.'); setForm({ name: '', email: '', subject: '', message: '' }); };

  return (
    <>
      <div className="page-hero"><p className="eyebrow">Get in Touch</p><h1>Contact <em>Us</em></h1><p>We&apos;d love to hear from you. Our team is available Monday–Saturday, 10am–6pm IST.</p></div>
      <div className="contact-grid">
        <div className="contact-info">
          <h3>Visit Us</h3>
          <p>AÉRE Atelier<br />42 Mirza Ismail Road<br />Jaipur, Rajasthan 302001<br />India</p>
          <h3>Write to Us</h3>
          <p>hello@aere.in<br />+91 141 400 2026</p>
          <h3>Hours</h3>
          <p>Monday – Saturday: 10am – 6pm IST<br />Sunday: Closed</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group"><label>Name</label><input value={form.name} onChange={e => update('name', e.target.value)} required /></div>
          <div className="form-group"><label>Email</label><input type="email" value={form.email} onChange={e => update('email', e.target.value)} required /></div>
          <div className="form-group"><label>Subject</label><input value={form.subject} onChange={e => update('subject', e.target.value)} /></div>
          <div className="form-group"><label>Message</label><textarea value={form.message} onChange={e => update('message', e.target.value)} rows={5} style={{ width: '100%', padding: '.8rem 0', border: 'none', borderBottom: '1px solid rgba(158,139,124,.3)', fontFamily: 'var(--sans)', fontSize: '.85rem', color: 'var(--ink)', outline: 'none', background: 'transparent', resize: 'vertical' }} required /></div>
          <button type="submit" className="btn-primary">Send Message</button>
        </form>
      </div>
    </>
  );
}

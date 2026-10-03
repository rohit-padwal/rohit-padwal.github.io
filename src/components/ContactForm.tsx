import { useState, type FormEvent } from 'react';
import { portfolio } from '../content';
import { Arrow } from './Icon';
import styles from '../styles.module.css';

type Fields = 'name' | 'email' | 'subject' | 'message';
const labels: Record<Fields, string> = { name: 'Your Name', email: 'Your Email', subject: 'Subject', message: 'Message' };
const endpoint = import.meta.env.VITE_FORMSPREE_ENDPOINT?.trim();
export function ContactForm() {
  const [errors, setErrors] = useState<Partial<Record<Fields, string>>>({});
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === 'sending') return;
    const form = event.currentTarget;
    const data = new FormData(form);
    const invalid: Partial<Record<Fields, string>> = {};
    for (const field of Object.keys(labels) as Fields[]) {
      const value = String(data.get(field) ?? '').trim();
      data.set(field, value);
      if (!value) invalid[field] = `${labels[field]} is required.`;
      else if (field === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) invalid.email = 'Enter a valid email address.';
    }
    setErrors(invalid);
    setMessage('');
    setStatus('idle');
    if (Object.keys(invalid).length) {
      (form.elements.namedItem(Object.keys(invalid)[0]) as HTMLElement)?.focus();
      return;
    }
    if (!endpoint || !/^https:\/\/formspree\.io\/f\/[a-zA-Z0-9]+$/.test(endpoint)) {
      setStatus('error');
      setMessage(`The contact form is not connected yet. Please email ${portfolio.email}.`);
      return;
    }
    setStatus('sending');
    try {
      const response = await fetch(endpoint, { method: 'POST', body: data, headers: { Accept: 'application/json' }, signal: AbortSignal.timeout(15000) });
      const result: { errors?: { message: string }[] } = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.errors?.map((error) => error.message).join(' ') || 'Your message could not be sent. Please try again or email me directly.');
      setStatus('success');
      setMessage('Your message has been sent. Thank you!');
      form.reset();
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error && error.name !== 'TypeError' && error.name !== 'TimeoutError' ? error.message : 'Unable to send your message. Please check your connection and try again, or email me directly.');
    }
  }
  return <form className={styles.contactForm} onSubmit={submit} noValidate aria-label="Contact form" aria-busy={status === 'sending'}>
    <div className={styles.formGrid}>{(Object.keys(labels) as Fields[]).map((field) => <div className={`${styles.field} ${field === 'subject' || field === 'message' ? styles.fullWidth : ''}`} key={field}>
      <label htmlFor={`contact-${field}`}>{labels[field]}</label>
      {field === 'message' ? <textarea id={`contact-${field}`} name={field} rows={5} required maxLength={10000} aria-invalid={Boolean(errors[field])} aria-describedby={errors[field] ? `${field}-error` : undefined} /> : <input id={`contact-${field}`} name={field} type={field === 'email' ? 'email' : 'text'} autoComplete={field === 'name' ? 'name' : field === 'email' ? 'email' : 'off'} required maxLength={field === 'email' ? 254 : 200} aria-invalid={Boolean(errors[field])} aria-describedby={errors[field] ? `${field}-error` : undefined} />}
      {errors[field] && <span id={`${field}-error`} className={styles.fieldError}>{errors[field]}</span>}
    </div>)}</div>
    <input type="text" name="_gotcha" className={styles.honeypot} tabIndex={-1} autoComplete="off" aria-hidden="true" />
    {!endpoint && <p className={styles.formNote}>The contact form is not connected yet. You can reach me by <a href={`mailto:${portfolio.email}`}>email</a>.</p>}
    <div role="status" aria-live="polite" aria-atomic="true" className={status === 'error' ? styles.errorMessage : styles.successMessage}>{message}</div>
    <button className={styles.buttonPrimary} type="submit" disabled={status === 'sending'}>{status === 'sending' ? 'Loading' : 'Send Message'}<Arrow /></button>
  </form>;
}

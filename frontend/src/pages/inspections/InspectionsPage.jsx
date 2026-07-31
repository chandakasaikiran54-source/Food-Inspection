/**
 * inspections/InspectionsPage.jsx
 * Inspection scheduling and management page
 * Full implementation coming in later phases.
 */

import '../../styles/global.css';

export default function InspectionsPage() {
  return (
    <div style={{ padding: 'var(--space-6)' }}>
      <div style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-10)',
        textAlign: 'center',
        boxShadow: 'var(--shadow-md)',
      }}>
        <div style={{ fontSize: '3rem', marginBottom: 'var(--space-4)' }}>🚧</div>
        <h2 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)', marginBottom: 'var(--space-2)' }}>
          Inspections
        </h2>
        <p style={{ color: 'var(--color-text-secondary)' }}>
          This module is under active development and will be available shortly.
        </p>
      </div>
    </div>
  );
}

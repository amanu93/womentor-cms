"use client";
export function DeleteButton({ action, label }: { action: () => Promise<void>; label: string }) {
  return (
    <button type="button" className="btn-danger" onClick={() => { if (confirm(`Delete this ${label.toLowerCase()}? This cannot be undone.`)) action(); }}>
      Delete
    </button>
  );
}

"use client";

export function BaixarPdfButton() {
  return (
    <button onClick={() => window.print()} className="est-pdf-btn" type="button">
      📄 Baixar PDF
    </button>
  );
}

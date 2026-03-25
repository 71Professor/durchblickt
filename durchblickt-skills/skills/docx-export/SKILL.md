---
name: docx-export
description: >
  Konvertiert fertige DURCHBLICKT!-Materialien (Grobkonzept, Ablaufstruktur, Arbeitsblätter)
  vom Markdown-Format in ein DOCX nach BARMER/Klett-MEX-Vorlage. Verwende diesen Skill wenn
  ein Dokument für die Einreichung bei BARMER oder Fabienne (Redaktion) vorbereitet werden soll.
  Trigger: "als DOCX", "für Einreichung", "Word-Dokument", "DOCX erstellen", "für BARMER",
  "Redaktion", "einreichen".
---

# DOCX-Export

## Zweck

Finales DOCX aus Markdown-Quelle, bereit für Einreichung bei BARMER / Fabienne (Redaktion).

---

## Vor dem Export

1. Leitlinien-Check abgeschlossen? (→ Leitlinien-Check Skill)
2. Änderungs-Log vorhanden falls Feedback eingearbeitet wurde?
3. Markdown-Quelle vollständig?

---

## BARMER-Designvorgaben

**Farben:**
- Akzentfarbe: Gelb `#FFD700` (BARMER-Gelb) für Boxen, Icons, Tabellenkopf
- Warnboxen: Gelber Hintergrund, fett „Aufgepasst!" als Label
- DSGVO-Box: Grün `#4CAF50`

**Schrift:**
- Fließtext: Arial 11pt
- Überschriften H1: Arial 16pt fett
- Überschriften H2: Arial 13pt fett
- Tabellen: Arial 10pt

**Seitenformat:**
- A4 (11906 × 16838 DXA)
- Ränder: 2 cm ringsum

---

## Pflicht-Elemente

### Titelseite / Header
```
Titel der LH
Sekundarstufe I und II (zusätzlich mit Arbeitsmaterial für die Grundschule)
Handreichung für Lehrkräfte | Dauer: 90 Min.
```

### Änderungs-Log (nur bei Feedback-Integration)
```
| Nr. | Quelle | Feedback-Punkt | Umsetzung | Status |
```
→ Direkt nach Titelseite, vor Hauptinhalt

### Warnbox-Format
```
┌─────────────────────────────────┐
│ ⚠ Aufgepasst!                   │  ← gelber Hintergrund, fett
│ [Hinweistext]                   │
└─────────────────────────────────┘
```

### DSGVO-Hinweis (bei digitalen Tools)
```
┌─────────────────────────────────┐
│ ✓ Die verwendeten Online-       │  ← grüner Hintergrund
│   materialien sind DSGVO-konform│
└─────────────────────────────────┘
```

---

## Ausgabe

- Dateiname: `LHX_[Titel]_Grobkonzept_[datum].docx`
- Ablage: `/output/`
- Nach Export: Markdown-Quelle und DOCX synchron halten

---

## Technische Umsetzung

Nutze das `docx`-npm-Paket (Node.js). Vorlage-Skript liegt unter `scripts/docx_export.js`.
Bei Tabellen: immer `WidthType.DXA`, nie Prozent.
Bei Boxen: `ShadingType.CLEAR` + Hintergrundfarbe, nie `ShadingType.SOLID`.

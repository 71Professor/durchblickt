---
name: leitlinien-check
description: >
  Prüft ein DURCHBLICKT!-Grobkonzept systematisch gegen die Neuen Leitlinien 2026 (BARMER/Klett MEX).
  Verwende diesen Skill immer bevor ein Grobkonzept eingereicht oder finalisiert wird, und auch
  bei jeder größeren Überarbeitung. Trigger: "Leitlinien prüfen", "compliance check", "vor Einreichung",
  "Leitlinien 2026", oder wenn ein fertiges Grobkonzept vorliegt.
---

# Leitlinien-Check 2026

## Zweck

Systematische Qualitätssicherung eines DURCHBLICKT!-Grobkonzepts gegen die 5 Neuen Leitlinien 2026.
Ergebnis ist ein strukturierter Compliance-Report, der direkt ins Grobkonzept-DOCX aufgenommen werden kann.

---

## Schritt 1 – Dokument laden

Lies die Referenz-Leitlinien vollständig:
→ `references/leitlinien_2026.md`

Lies das zu prüfende Grobkonzept (Markdown oder DOCX).

---

## Schritt 2 – Prüftabelle ausfüllen

Prüfe jede Leitlinie einzeln. Für jede Leitlinie:
- Konkrete Textstellen im Grobkonzept identifizieren
- Bewertung: ✅ erfüllt | ⚠️ teilweise | ❌ nicht erfüllt
- Bei ⚠️ oder ❌: Konkreten Verbesserungsvorschlag formulieren

| # | Leitlinie | Prüffrage | Befund | Bewertung |
|---|-----------|-----------|--------|-----------|
| 1 | Binnendifferenzierung | Sind Sek I / Sek II in allen Phasen integriert (nicht als separate Version)? | | |
| 2 | Klarer Fokus | Gibt es eine einzige Leitfrage, auf die alle Inhalte einzahlen? | | |
| 3 | Andocken | Sind Bezüge zu bestehenden LH explizit, ohne Inhalte zu wiederholen? | | |
| 4 | Gesundheitsbezug | Sind psychische und soziale Gesundheit in jeder Phase verankert? | | |
| 5 | Konzept zuerst | Ist die Grobkonzept-Struktur vollständig (Kapitel, Methoden, Schwerpunkte)? | | |

---

## Schritt 3 – Zusatzcheck Grundschul-Erweiterung

- [ ] Sind genau 2 Phasen mit Grundschul-Erweiterung ausgewiesen?
- [ ] Ist die Phasenwahl thematisch begründet?
- [ ] Sind die Grundschul-Abschnitte eingebettet (nicht als separater Anhang)?

---

## Schritt 4 – Report ausgeben

Ausgabe-Format:

```
## Leitlinien-Check – [LH-Titel] – [Datum]

### Gesamtbewertung: [✅ / ⚠️ / ❌]

### Ergebnisse je Leitlinie
[Tabelle aus Schritt 2]

### Grundschul-Check
[Ergebnis aus Schritt 3]

### Handlungsbedarf
[Nur bei ⚠️ oder ❌: nummerierte Liste mit konkreten Änderungen]

### Freigabe-Empfehlung
[Einreichen / Überarbeiten + Begründung]
```

Der Report kann als Abschnitt direkt ins Grobkonzept-DOCX eingefügt werden.

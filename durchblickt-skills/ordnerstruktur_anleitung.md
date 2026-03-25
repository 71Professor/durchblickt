# DURCHBLICKT! – Ordnerstruktur für den Projektordner
*Einmalige Sortieraktion | Stand: März 2026*

---

## Zielstruktur

```
durchblickt-projekt/
│
├── CLAUDE.md                          ← Projektkonfiguration (Claude Code liest das automatisch)
├── status.md                          ← Aktueller Projektstatus je LH
│
├── durchblickt-skills/                ← Skills & Subagents (aus dem Paket)
│   ├── README.md
│   ├── agents/
│   └── skills/
│
├── referenz/
│   ├── bausteine.md                   ← Wiederkehrende Textblöcke (KMK, dGK, DSGVO etc.)
│   ├── altmaterial/                   ← Fertige LH aus 2024 (Endversionen, kein Entwurf)
│   │   ├── LH_2024_[Thema1].pdf       ← Abgrenzungsreferenz für neue LH
│   │   ├── LH_2024_[Thema2].pdf
│   │   └── zusammenfassungen.md       ← !! Einmalig erstellen: 1 Absatz je alter LH
│   └── vorlagen/
│       └── DGK_LH1_KI_FS_MK_cleanVersion.docx  ← Formatreferenz (aktuellste Version)
│
├── lh1/
│   ├── grobkonzept/
│   │   ├── Grobkonzept_LH1_2026_eingereicht_an_barmer.docx
│   │   └── Meine-finale-version-Grobkonzept1_2026_KI.md
│   ├── ablaufstruktur/
│   │   ├── LH1_Ablaufstruktur_final.md
│   │   └── LH1_Ablaufstruktur_90Min_detailliert.md
│   ├── arbeitsblätter/
│   │   ├── AB4a_Fallszenario_Lena.md
│   │   ├── AB4b_Fallszenario_Tom.md
│   │   ├── AB4c_Fallszenario_Mia.md
│   │   └── AB4d_Fallszenario_Jonas.md
│   └── methoden/
│       └── LH1_Interaktive_Kollaborative_Methoden_5_Phasen.md
│
├── lh2/                               ← Wird angelegt sobald LH2 startet
│
├── lh3/                               ← Wird angelegt sobald LH3 startet
│
├── output/                            ← Nur finale DOCX für Einreichung
│   └── LH1_Grobkonzept_2026_eingereicht.docx
│
└── archiv/                            ← Alles andere: Entwürfe, Zwischenstände, alte Versionen
    ├── lh1_entwuerfe/
    └── sonstiges/
```

---

## Die eine Datei, die sich lohnt: zusammenfassungen.md

Diese Datei ist die wichtigste Investition für LH2–4.
Sie verhindert, dass neue LH alte Inhalte wiederholen.

**Format je alter LH (ca. 5–8 Zeilen):**

```markdown
## [Titel der alten LH] – [Jahr]

**Thema:** [1 Satz]
**Leitfrage:** [Die zentrale Frage der Einheit]
**Kerninhalt:** [2–3 Sätze: Was wird gemacht, was lernen die Schüler:innen?]
**Methoden:** [Stichworte: z.B. Fallstudie, Selbstexperiment, Quiz]
**Abgrenzung:** [Was darf eine neue LH auf diesem Thema NICHT wiederholen?]
```

**Warum das wichtig ist:**
Wenn Claude Code für LH2 ein Grobkonzept erstellt, liest der grobkonzept-agent diese Datei
und prüft automatisch: Gibt es Überschneidungen? Was ist wirklich neu?
Ohne diese Datei müsstest du die Abgrenzung manuell erklären.

---

## Sortier-Anleitung (einmalige Aktion, ca. 1–2 Stunden)

**Schritt 1 – Endversionen identifizieren**
Alle fertigen, eingereichten Handreichungen aus 2024 → `referenz/altmaterial/`
Nur die allerletzten Versionen, keine Entwürfe.

**Schritt 2 – Zusammenfassungen schreiben**
Für jede alte LH 5–8 Zeilen im oben beschriebenen Format → `referenz/altmaterial/zusammenfassungen.md`
Tipp: Das kannst du auch mit Claude erledigen – einfach die PDFs hochladen und das Format vorgeben.

**Schritt 3 – Wiederkehrende Bausteine prüfen**
`referenz/bausteine.md` (aus dem Paket) durchgehen – stimmen die KMK-Formulierungen mit den
aktuellen Vorgaben überein? Falls nein: einmalig anpassen.

**Schritt 4 – Alles andere ins Archiv**
Arbeitsstände, Entwürfe, Zwischenversionen → `archiv/`
Claude Code braucht das nicht, aber es ist gut, es nicht zu löschen.

---

## Was Claude Code automatisch findet

Wenn Claude Code im Projektordner gestartet wird, liest er:
1. `CLAUDE.md` – Projektkontext, Konventionen, Subagent-Definitionen
2. `status.md` – Wo stehen wir gerade?
3. `referenz/bausteine.md` – Wiederverwendbare Textblöcke
4. `referenz/altmaterial/zusammenfassungen.md` – Abgrenzungsreferenz

Alles andere (Skills, Subagents, LH-Dateien) wird bei Bedarf von den Subagents geladen.

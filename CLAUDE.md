# DURCHBLICKT! – Projektkontext für Claude Code
*BARMER / Klett MEX | Lehrkräftehandreichungen | Stand: März 2026*

---

## Wer ich bin und was dieses Projekt ist

Du arbeitest als KI-Assistent für **Michael Kohl (Mike)**, Autor der Lehrkräftehandreichungen
für das Programm **DURCHBLICKT! – Digital in eine gesunde Zukunft** (Auftraggeber: BARMER,
Verlag: Klett MEX).

Ziel ist die Entwicklung von Lehrkräftehandreichungen (LH) zu digitalen Gesundheitsthemen
für Sekundarstufe I und II (mit Grundschul-Erweiterung Klasse 3–4 in je 2 Phasen pro LH).

**Beteiligte:**
- **Mike** – Autor (du arbeitest immer für und mit Mike)
- **Fabienne** – Redaktion / Klett MEX (Feedback-Empfängerin)
- **Anka** – BARMER, Auftraggeber-Seite (Freigabe-Instanz)

---

## Beim Start: Immer zuerst lesen

1. `status.md` – Aktueller Stand aller LH, ausstehende Feedbacks, nächste Schritte
2. `referenz/bausteine.md` – Wiederkehrende Textblöcke (KMK, dGK, DSGVO etc.)
3. `referenz/altmaterial/zusammenfassungen.md` – Abgrenzungsreferenz zu alten LH (sobald vorhanden)

---

## Projektstruktur (Dateien)

```
durchblickt-projekt/
├── CLAUDE.md                                    ← diese Datei
├── status.md                                    ← Projektstatus je LH + Feedback-Log
├── durchblickt-skills/                          ← Skills & Subagents
├── referenz/
│   ├── bausteine.md                             ← Wiederkehrende Textblöcke
│   ├── altmaterial/
│   │   ├── zusammenfassungen.md                 ← 1 Absatz je alter LH (Abgrenzungsreferenz)
│   │   └── [fertige LH 2024 als PDF]
│   └── vorlagen/
│       └── DGK_LH1_KI_FS_MK_cleanVersion.docx  ← Formatreferenz Grundschul + 6 Phasen
├── lh1/                                          ← Fertige LH1-Materialien
├── lh2/                                          ← Arbeitsdateien LH2 (wird angelegt)
└── output/                                       ← Finale DOCX für Einreichung
```

---

## Leitlinien 2026 – Kurzfassung (IMMER beachten)

1. **Binnendifferenzierung statt Trennung:** Eine LH für alle – Sek I / Sek II intern differenziert
2. **Klare Leitfrage:** Jede LH hat EINEN Fokus, alle Inhalte zahlen darauf ein
3. **Andocken, nicht wiederholen:** An bestehende LH anschließen, keine Inhalte doppeln
4. **Gesundheitsbezug:** Psychische und soziale Gesundheit in jeder Phase verankert
5. **Grobkonzept zuerst:** Struktur klären, DANN ausarbeiten

---

## Entwicklungsphasen (Überblick)

| Phase | Aufgabe | Output |
|-------|---------|--------|
| 1 | Grobkonzept Sonnet | Erster Entwurf .md |
| 2 | Grobkonzept Opus | Zweiter Entwurf .md |
| 3 | Externe Quellen integrieren | Angereicherter Entwurf |
| 4 | Zusammenführung | Finales Grobkonzept .md |
| 4a | Leitlinien-Check | Geprüftes Grobkonzept |
| **4b** | **BARMER-Genehmigungsvorlage** | **Schlankes Freigabe-DOCX (wrf-Version) → an BARMER** |
| – | ⏳ Warte auf BARMER-Freigabe | – |
| 5 | Feinkonzept + Arbeitsblätter | Ausgearbeitetes Konzept |
| 5a | Stakeholder-Feedback einarbeiten | Überarbeitetes DOCX |
| 6 | Ablaufstruktur vertiefen | 6-Phasen-Unterrichtsvorlage |
| 6a | Grundschul-Erweiterung einbauen | In 2 thematisch gewählten Phasen |
| 7 | Methoden & Materialien | Methodensammlung |
| 8 | Redaktions-Check + EH-Check | Abgabereife bestätigt |
| 9 | DOCX-Export Endversion | Finale Einreichversion |

**Hinweis Phase 4b:** BARMER-Genehmigung kommt VOR dem Feinkonzept.
Erst nach Freigabe durch BARMER wird Phase 5 gestartet.
**Grundschul-Erweiterungen** sind in Mikes Grobkonzepten noch nicht enthalten
und werden erst in Phase 6a eingebaut – nach BARMER-Freigabe.

---

## Ablaufstruktur (6 Pflichtphasen)

| Phase | Bezeichnung | Inhalt | Zeit |
|-------|-------------|--------|------|
| Einstieg | Startervideo | Emotionaler Zugang | ca. 5 Min. |
| Hinführung | Emotionale Aktivierung | Vorwissen, Neugier | ca. 10 Min. |
| Erarbeitung 1 | [Themenspezifisch] | Grundlagen erarbeiten | ca. 15 Min. |
| Erarbeitung 2 | [Themenspezifisch] | Fallanalyse, Gruppenarbeit | ca. 25 Min. |
| Vertiefung | [Themenspezifisch] | Kriterien, Think-Pair-Share | ca. 20 Min. |
| **Transfer** | Persönlicher Transfer | Kompass, Vorsätze, Meinungslinie | ca. 20 Min. |
| **Reflexion** | Abschlussrunde | Lernrückblick, offene Fragen | ca. 10 Min. |
| Follow-up | (Optional, 2 Wochen später) | Challenge-Bilanz | ca. 15 Min. |

**WICHTIG – Transfer ≠ Reflexion:**
- **Transfer** = Konkretes Handeln planen: Produkt erstellen, Meinungslinie
- **Reflexion** = Rückblick auf den Lernprozess: Was habe ich gelernt? Offen, kein Produkt

**Grundschul-Erweiterung:** In genau 2 thematisch passenden Phasen eingebettet –
welche 2 Phasen, entscheidet sich je LH-Thema neu. Phasenwahl immer mit Mike abstimmen.

---

## Feedback-Workflow

Feedback kommt von außen (Anka/BARMER oder Fabienne/Redaktion) und kann Tage bis Wochen
nach Einreichung eintreffen. Bis dahin kann an der nächsten LH gearbeitet werden.

**Wenn Mike Feedback einbringt:**
1. `status.md` aktualisieren (Feedback-Log ausfüllen)
2. Feedback-Punkte in nummerierte Liste bringen
3. `[grobkonzept-agent]` → Einarbeiten mit `[NEU (Feedback)]`-Markierungen
4. Änderungs-Log-Tabelle am Dokumentanfang anlegen: `| Nr. | Quelle | Feedback-Punkt | Umsetzung | Status |`
5. `[leitlinien-agent]` → Erneuter Check
6. `[docx-agent]` → Aktualisiertes DOCX exportieren
7. `status.md` aktualisieren

---

## Subagent-Anweisungen

```
subagent:leitlinien-check
  → Skill: durchblickt-skills/skills/leitlinien-check/SKILL.md
  → Prüft Grobkonzept gegen alle 5 Leitlinien + Grundschul-Check

subagent:grobkonzept
  → Skill: durchblickt-skills/skills/grobkonzept/SKILL.md
  → Liest referenz/altmaterial/zusammenfassungen.md für Abgrenzung
  → 15-Abschnitte-Struktur, 6 Phasen, Transfer ≠ Reflexion

subagent:ablaufstruktur
  → Skill: durchblickt-skills/skills/ablaufstruktur/SKILL.md
  → 6 Phasen ausarbeiten, Sek I/II differenziert
  → Platzhalter für Grundschul-Erweiterung in 2 gewählten Phasen

subagent:grundschul-erweiterung
  → Skill: durchblickt-skills/skills/grundschul-erweiterung/SKILL.md
  → 2 Phasen je LH-Thema neu wählen, Phasenwahl mit Mike abstimmen
  → Direkt in Ablaufstruktur einbetten (nicht als Anhang)

subagent:arbeitsblätter
  → Skill: durchblickt-skills/skills/arbeitsblätter/SKILL.md
  → Fallszenarien + Analyse-/Reflexionsinstrumente, je Sek I + Sek II

subagent:docx-export
  → Skill: durchblickt-skills/skills/docx-export/SKILL.md
  → BARMER-Vorlage, inkl. Änderungs-Log falls Feedback eingearbeitet
  → Output: /output/LHX_Grobkonzept_[datum].docx

subagent:redaktions-check
  → Skill: durchblickt-skills/skills/redaktions-check/SKILL.md
  → Prüft gegen Fabiennes 8 redaktionelle Leitlinien (abgeleitet aus LH1-Feedback)
  → VOR jeder Einreichung an Fabienne oder BARMER ausführen

subagent:erwartungshorizont-check
  → Skill: durchblickt-skills/skills/erwartungshorizont-check/SKILL.md
  → Prüft Phasen-Vollständigkeit, Nummerierungskonsistenz (ABs + Materialien), Grundschul-Erweiterung
  → Wenn der Erwartungshorizont fertig ist, vor Einreichung ausführen
```

---

## Pflicht-Reihenfolge vor jeder Einreichung

```
1. [leitlinien-agent]           → Leitlinien 2026 erfüllt?
2. [erwartungshorizont-agent]   → EH strukturell konsistent?
3. [redaktions-agent]           → Fabiennes 8 Regeln eingehalten?
4. [docx-agent]                 → DOCX exportieren
```

---

## Wichtige Konventionen

- `status.md` lesen beim Start, aktualisieren nach jedem Meilenstein
- **Vor Einreichung immer alle 3 Checks** (Leitlinien + EH + Redaktion)
- Änderungs-Log immer bei Feedback-Integration
- `zusammenfassungen.md` für Abgrenzung zu alten LH nutzen
- Grundschul-Phasenwahl = aktive pädagogische Entscheidung, immer mit Mike abstimmen

---

*DURCHBLICKT! | BARMER | CLAUDE.md | Stand: März 2026*

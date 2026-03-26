---
name: barmer-genehmigung
description: >
  Erstellt die schlanke BARMER-Genehmigungsvorlage aus einem fertigen DURCHBLICKT!-Grobkonzept.
  Das ist ein eigenständiges, kürzeres Dokument (ca. 4–6 Seiten) das BARMER zur Freigabe vorgelegt
  wird – kein Auszug aus dem Feinkonzept. Enthält: Leitlinien-Tabelle, Kernbotschaften,
  Anknüpfungspunkte, KMK/dGK kompakt, zweispaltige Ablaufstruktur (Phase + Differenzierung).
  Trigger: "Genehmigungsvorlage", "BARMER-Version", "schlanke Version", "für BARMER kürzen",
  "Freigabe-Dokument", "wrf-Version", "Einreichung an BARMER".
---

# BARMER-Genehmigungsvorlage erstellen

## Zweck

Aus dem vollständigen Grobkonzept (15 Abschnitte) wird ein schlankes Freigabe-Dokument
für BARMER (Anka) erstellt. Dieses Dokument ist **nicht** das Feinkonzept – es ist die
offizielle Genehmigungsvorlage, die vor der Ausarbeitung der Materialien von BARMER
abgesegnet wird.

## Input

Mike stellt das fertige Grobkonzept als Datei bereit:
→ Quelle: `/referenz/grobkonzepte_2026/LHX_*.md`

Diese Datei zuerst vollständig lesen, dann die kompakte BARMER-Version daraus ableiten.

Referenz-Dokument für Format und Tiefe (LH1-Beispiel):
→ `referenz/lh1/grobkonzept/Kopie von Grobkonzept_LH1_2026_eingereicht_an_barmer.docx.md`
→ Auch gespeichert als: `references/barmer_genehmigung_lh1_referenz.md`

---

## Struktur des Dokuments (6 Abschnitte)

### 1. Kopfzeile
```
Durchblickt! // Leitlinien 2026
```

### 2. Leitlinien-Tabelle
Zweispaltige Tabelle: Kriterium | Umsetzung

| Kriterium | Umsetzung |
|-----------|-----------|
| Binnendifferenzierung | [Kurz: wie Sek I/II differenziert wird] |
| Klarer Fokus | [Die eine Leitfrage] |
| Andocken | [Welche bestehenden LH werden vorausgesetzt] |
| Gesundheitsbezug | [Wie psychische/soziale Gesundheit verankert] |
| „Langlebigkeit" | [Warum Inhalt nicht schnell veraltet] |
| Strukturelle Kontinuität | [Bewährter Phasen-Aufbau] |
| Einheit | 90 Minuten |

### 3. Grobkonzept-Kopf
```
Grobkonzept [X]. Handreichung
Arbeitstitel: [Titel]
```

### 4. Inhaltliche Abschnitte (kompakt)

**1. Kernbotschaften** – 3–4 prägnante Sätze, was Lernende mitnehmen

**2. Anknüpfungspunkte** – Stichpunktliste: welche bestehenden LH andocken, mit je 1 Halbsatz

**3. KMK-Kompetenzbereiche** – Nur Schwerpunkte nennen (z.B. „Bereiche 4, 5 und 6"), keine Tabelle

**4. Dimensionen digitaler Gesundheitskompetenz** – Nur Stichpunktliste der relevanten Dimensionen

### 5. Ablaufstruktur – KERNSTÜCK

**Format:** Zweispaltige Tabelle pro Phase
- Linke Spalte: Phasenbeschreibung (Ziel, Ablauf, Methoden, Materialien)
- Rechte Spalte: Differenzierung Sek I / Sek II + ggf. Grundschul-Erweiterung

**Wichtig:** Jede Phase beginnt mit fetter Phasenbezeichnung:
```
PHASE 1: Einstieg – [Titel] (10 Min.)
PHASE 2: Hinführung – [Titel] (15 Min.)
...
PHASE 5: Transfer – [Titel] (20 Min.)
PHASE 6: Reflexion / Follow-up
```

**Grundschul-Erweiterung** – falls vorhanden: in der rechten Spalte nach Sek I/II,
eingeleitet mit „MIT ERWEITERUNG GRUNDSCHULE"

**Infoboxen** – Wo nötig: `INFOBOX // [Titel]` mit kurzem Erklärtext (z.B. Fehlerquote KI,
Datenschutz-Hinweis)

### 6. Kommentar-Erklärung (optional, nur wenn Feedback eingearbeitet wurde)
Am Ende: Kursiv-Erklärung wie Kommentare berücksichtigt wurden, gegliedert nach
Inhalt (A, B) und Methode (A, B).

---

## Was NICHT ins Genehmigungsdokument gehört

- Vollständige Arbeitsblätter
- Erwartungshorizont / Musterlösungen
- Methodenanhang
- Materialübersichten
- Differenzierungsdetails (nur kompakt in rechter Spalte)

---

## Qualitätscheck vor Ausgabe

- [ ] Leitlinien-Tabelle vollständig ausgefüllt?
- [ ] Kernbotschaften: max. 4 Punkte, prägnant?
- [ ] Ablaufstruktur: alle Phasen zweispaltig?
- [ ] Grundschul-Erweiterung in den relevanten Phasen in rechter Spalte?
- [ ] Dokument schlank genug? (Ziel: ca. 4–6 Seiten A4)

---

## Ausgabe

**Schritt 1 – Markdown speichern:**
- Format: `.md`
- Dateiname: `lhX/LHX_Grobkonzept_[Thema]_barmer.md`
- Ablage: im jeweiligen LH-Ordner (z. B. `lh2/`, `lh3/`, `lh4/`)

**Schritt 2 – DOCX-Export:**
- → `[docx-agent]` aufrufen mit der gespeicherten `.md`-Datei als Input
- Dateiname: `LHX_Grobkonzept_[Thema]_[datum]_wrf_MK.docx`
- Ablage: `/output/`

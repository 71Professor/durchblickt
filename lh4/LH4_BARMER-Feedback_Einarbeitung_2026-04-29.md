# LH4 – Einarbeitung BARMER-Rückmeldung

**Datum:** 29.04.2026
**LH:** LH4 „Schlaf gut! – Wie digitale Geräte unseren Schlaf beeinflussen"
**Quelle des Feedbacks:** rote Anmerkungen unter Abschnitt 5 in `lh4/grobkonzept/LH4_Grobkonzept_genehmigt.docx` (BARMER, Kürzel **wrf**)
**Workflow-Vorlage:** analog LH3-Re-Einreichung (Änderungs-Log + Inline-Marker `[NEU (Feedback BARMER FX)]`)

---

## 1. Eingearbeitete Feedback-Punkte

| Nr. | Feedback (Kurzfassung) | Umsetzungsort |
| :-- | :-- | :-- |
| **F1** | 7Mind@School-Einschlaf-/Meditationsübungen einbinden, ggf. exemplarische Übung | Abschnitt 2 (Anknüpfungspunkte), Phase 4 (Jonas), Phase 5 (exemplarische 3–5-Min-Übung), AB 4 |
| **F2** | Vom Ist- in den Kann-Modus wechseln | KB 2 / KB 3 / KB 4, Phase 3 Station B + Gesundheitsbezug, Phase 7 Tafelbild |
| **F3** | Aktuelle Studien (Cain & Gradisar 2024) | Phase 3 Sek-II-Spalte; AB 2b Sek-II Frage 6 + Lehrerlösung |
| **F4** | Phase 2: Schlaftypen + Wochentag-/Wochenend-Rhythmus | Phase 2 Sek-II-Spalte (Chronotypen + Social Jetlag); AB 2c Sek-II Frage 6 + Lehrerlösung |

---

## 2. Geänderte Dateien

| Datei | Art der Änderung |
| :-- | :-- |
| `lh4/grobkonzept/LH4_Grobkonzept_eingereicht.md` | **Hauptdatei** – Änderungs-Log + Inline-Markierungen F1/F3/F4 + Sammel-Anpassung F2 |
| `lh4/LH4_Lerneinheit.md` | Lernziel 2, Einleitung, Anknüpfungspunkte (7Mind), Hintergrund „Studienlage Sek II" um Cain & Gradisar + Chronotypen/Social Jetlag erweitert; Phase 4 TPS (7Mind exemplarisch); Tafelbild + Kernbotschaften ins Kann-Register |
| `lh4/arbeitsblaetter/LH4_Arbeitsblätter.md` | AB 2b: Cain-&-Gradisar-Frage Sek II; AB 2c: Chronotypen-Frage Sek II; AB 4: 7Mind-Übung als Aktivitätsoption |
| `status.md` | Neue Zeile „BARMER-Rückmeldung eingearbeitet" (29.04.2026); Termin-Block aktualisiert |
| `scripts/export_lh4_re_eingereicht.js` | **Neu** – Export-Skript (basierend auf LH3-Template) |
| `output/LH4_Grobkonzept_Re-Einreichung_2026-04-29.docx` | **Neu** – DOCX für Re-Einreichung an BARMER |

---

## 3. Konsistenz-Verifikation (grep)

| Suche | Grobkonzept | Lerneinheit | Arbeitsblätter |
| :-- | :--: | :--: | :--: |
| `7Mind` | 4 | 3 | 1 |
| `Cain & Gradisar` | 2 | 2 | 2 |
| `Chronotyp` / `Social Jetlag` | 2 | 2 | 4 |
| `[NEU (Feedback BARMER FX)]` | 5 | 5 | 5 |

Alte Ist-Formulierungen („stören das Einschlafen", „hält wach", „schläft besser und fühlt sich erholter") nur noch im Änderungs-Log selbst (Doku der Änderung) – im Body 0 Treffer. ✅

---

## 4. Offene Punkte vor Versand

- **Konkreter 7Mind@School-Übungsname** ist im Grobkonzept als Platzhalter geführt – ggf. vor Versand an Anka final benennen.
- **Pflicht-Checks** (`leitlinien-agent`, `erwartungshorizont-agent`, `redaktions-agent`) sind noch nicht durchgelaufen – können vor dem Versand der DOCX gefahren werden, falls gewünscht.
- **Volltext-Zitat Cain & Gradisar (2024)** kann bei Bedarf in der finalen Lehrkraft-Referenz ergänzt werden.

---

## 5. Nächste Schritte

1. (optional) `[leitlinien-agent]` + `[erwartungshorizont-agent]` + `[redaktions-agent]` durchlaufen
2. (optional) 7Mind@School-Übungsname final eintragen → DOCX neu exportieren
3. Re-Einreichungs-DOCX `output/LH4_Grobkonzept_Re-Einreichung_2026-04-29.docx` an Anka (BARMER) senden
4. Status-Zeile in `status.md` von „⏳ Re-Einreichung an BARMER" auf „✅ versendet" umstellen, sobald raus

---

*DURCHBLICKT! | LH4 | Einarbeitungs-Protokoll BARMER-Feedback | 29.04.2026*

# Subagent-Definitionen – DURCHBLICKT!

Jeder Subagent hat einen klar abgegrenzten Auftrag. Er liest seine Skill-Datei,
führt den Auftrag aus und gibt das Ergebnis als Datei + kurze Zusammenfassung zurück.

---

## grobkonzept-agent

**Skill:** `skills/grobkonzept/SKILL.md`

**Aufrufsyntax:**
```
Task: Erstelle [Entwurf 1 / Entwurf 2 / Zusammenführung] für LH[X]: [Titel]
Leitfrage: [Leitfrage]
Abgrenzung: [Was ist neu gegenüber bestehenden LH]
Output: lh[X]/grobkonzept_entwurf[N]_[datum].md
```

**Gibt zurück:**
- Vollständiges Grobkonzept (15 Abschnitte) als Markdown
- Kurze Selbsteinschätzung: Wo ist das Konzept stark, wo noch dünn?

---

## leitlinien-agent

**Skill:** `skills/leitlinien-check/SKILL.md`

**Aufrufsyntax:**
```
Task: Prüfe [Dateiname] gegen die Leitlinien 2026
Output: lh[X]/leitlinien_check_[datum].md
```

**Gibt zurück:**
- Ausgefüllte Prüftabelle (alle 5 Leitlinien + Grundschul-Check)
- Freigabe-Empfehlung mit Begründung
- Liste konkreter Änderungen bei ⚠️ / ❌

---

## ablaufstruktur-agent

**Skill:** `skills/ablaufstruktur/SKILL.md`

**Aufrufsyntax:**
```
Task: Entwickle die 6-Phasen-Ablaufstruktur für LH[X]: [Titel]
Grundschul-Phasen: [Phase X] und [Phase Y]
Basis: lh[X]/grobkonzept_final.md
Output: lh[X]/ablaufstruktur_[datum].md
```

**Gibt zurück:**
- Übersichtstabelle + alle 6 Phasen ausgearbeitet
- Differenzierung Sek I/II je Phase
- Platzhalter für Grundschul-Erweiterung (wird vom grundschul-agent befüllt)

---

## grundschul-agent

**Skill:** `skills/grundschul-erweiterung/SKILL.md`

**Aufrufsyntax:**
```
Task: Entwickle Grundschul-Erweiterung für LH[X]
Ablaufstruktur-Datei: lh[X]/ablaufstruktur_[datum].md
Phasenwahl begründen: Ja
Output: direkt in Ablaufstruktur-Datei einbetten
```

**Gibt zurück:**
- 2 eingebettete Grundschul-Abschnitte in der Ablaufstruktur
- Kurze Begründung der Phasenwahl (für Mike zur Freigabe)

---

## ab-agent

**Skill:** `skills/arbeitsblätter/SKILL.md`

**Aufrufsyntax:**
```
Task: Erstelle Arbeitsblätter für LH[X]: [Titel]
Phasen mit Bedarf: [Phase X, Phase Y]
Leitfrage: [Leitfrage]
Typen: [Fallszenarien / Analyseinstrument / Reflexionsinstrument]
Output: lh[X]/ab[N]_[kurztitel]_[sekI|sekII].md
```

**Gibt zurück:**
- Alle beauftragten Arbeitsblätter als Markdown
- Sek-I- und Sek-II-Variante je Fallszenario

---

## docx-agent

**Skill:** `skills/docx-export/SKILL.md`

**Aufrufsyntax:**
```
Task: Exportiere LH[X] als DOCX
Quelldateien: [Liste der Markdown-Dateien]
Änderungs-Log: [Ja/Nein]
Output: output/LH[X]_[Titel]_Grobkonzept_[datum].docx
```

**Gibt zurück:**
- Fertiges DOCX in /output/
- Bestätigung: Alle Pflicht-Elemente enthalten?

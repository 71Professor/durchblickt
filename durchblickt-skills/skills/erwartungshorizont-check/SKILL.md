---
name: erwartungshorizont-check
description: >
  Prüft den Erwartungshorizont (Lehrkräfte-Informationen) einer DURCHBLICKT!-Handreichung auf
  strukturelle Konsistenz: korrekte Phasenstruktur, Vollständigkeit je Phase, Nummerierung von
  Arbeitsblättern und Materialien, Grundschul-Erweiterung. Verwende diesen Skill wenn der
  Erwartungshorizont eines Entwurfs überprüft, fertiggestellt oder auf Konsistenz geprüft werden soll.
  Trigger: "Erwartungshorizont prüfen", "EH checken", "Konsistenz prüfen", "Nummerierung stimmt nicht",
  "Arbeitsblätter prüfen", "Struktur Lehrkräfte-Informationen".
---

# Erwartungshorizont-Check

## Zweck

Strukturelle Konsistenzprüfung des Bereichs „Lehrkräfte-Informationen" (Erwartungshorizont).
Findet Abweichungen von der vorgeschriebenen Phasen-Struktur und Nummerierungsfehler.

Lies vor dem Check die vollständige Struktur-Checkliste:
→ `references/checkliste_erwartungshorizont.md`

---

## Pflichtstruktur je Phase

Jede Phase muss in dieser Reihenfolge enthalten:

1. **Überschrift der Phase** (Video / Einstieg / Hinführung / Erarbeitung / Vertiefung / Transfer / Reflexion / optional: Follow-up)
2. **Ziel der Phase**
3. **Didaktischer Hinweis 1** – Impuls oder Einführung
4. **Aufgabenstellung** mit Sozialform + Material
5. **Differenzierungsmöglichkeiten** (nur Verweis auf EH-Abschnitt in der Tabelle; hier vollständig)
6. **Methodenerklärung** (nur beim ersten Auftreten im Dokument; sonst nur Verweis auf Anhang)
7. **Lösungsvorschläge / Musterantworten**
8. **Didaktischer Hinweis als Überleitung** zur nächsten Phase
9. **Grundschul-Erweiterung** (falls vorhanden) – am Ende der Phase

---

## Nummerierungs-Konsistenz prüfen

Nach allen Phasen kommen in dieser Reihenfolge:

**Arbeitsblätter:**
- Nummerierung fortlaufend: AB 1, AB 2, AB 3 ...
- Prüfen: Stimmt die Nummerierung mit den Angaben im Erwartungshorizont überein?
- Prüfen: Sind alle ABs in der Übersichtstabelle Ablauf aufgeführt?

**Materialien:**
- Nummerierung: Material 1, Material 2 ...
- Prüfen: Stimmt die Nummerierung mit den Angaben im Erwartungshorizont überein?
- Prüfen: Sind alle Materialien in der Übersichtstabelle Ablauf aufgeführt?

---

## Grundschul-Erweiterung prüfen

- [ ] Steht die Grundschul-Erweiterung am Ende der jeweiligen Phase?
- [ ] Ist sie in der Übersichtstabelle Ablauf am Dokumentanfang aufgeführt?
- [ ] Genau 2 Phasen haben eine Grundschul-Erweiterung?

---

## Ausgabe-Format

```
## Erwartungshorizont-Check – [LH-Titel] – [Datum]

### Gesamtbefund: [✅ konsistent / ⚠️ kleinere Lücken / ❌ strukturelle Fehler]

### Phasen-Vollständigkeit

**Phase: [Name]**
✅ Überschrift vorhanden
✅ Ziel vorhanden
⚠️ Didaktischer Hinweis 1 fehlt → [Vorschlag]
✅ Aufgabenstellung mit Sozialform vorhanden
...

[alle Phasen durchgehen]

### Nummerierungs-Konsistenz

**Arbeitsblätter:**
[Befunde: AB X im EH erwähnt, aber nicht in Übersichtstabelle etc.]

**Materialien:**
[Befunde]

### Grundschul-Erweiterung
[Befunde]

### Handlungsbedarf (priorisiert)
1. [kritisch]
2. [wichtig]
3. [optional]
```

# KI-Bildprompts: Bilderpaar Grundschul-Erweiterung Phase 1

*DURCHBLICKT! LH 2 · Phase 1 — Einstieg (GS Kl. 3–4)*
*Zur Verwendung in Midjourney, DALL·E, Imagen, Flux, Ideogram, Recraft o. Ä.*

---

## Kontext

Für die Grundschul-Erweiterung der Phase 1 wird ein **gezeichnetes Bilderpaar** gebraucht: **dasselbe Kind** in zwei sehr unterschiedlichen Situationen. Die Bilder machen das Kernprinzip der Lerneinheit — *„Wir zeigen uns unterschiedlich, je nach Publikum"* — körperlich erfahrbar, ohne Smartphones oder Social Media vorauszusetzen.

**Impulsfrage im Unterricht:**
> *„Welches Bild zeigst du deiner Klasse? Welches deiner Oma? Warum?"*

**Wichtigste gestalterische Anforderung:**
Das Kind MUSS in beiden Bildern **eindeutig wiedererkennbar** als dieselbe Person sein — gleiches Gesicht, gleiche Frisur, gleiche Körperform. Nur Situation, Kleidung und Stimmung ändern sich.

---

## 🧒 Character-Sheet (in beide Prompts einbauen)

Damit dieselbe Figur in beiden Bildern erscheint, wird die Figur zuerst einheitlich beschrieben. Diesen Block in BEIDE Prompts übernehmen:

```
CHARACTER (identical in both images):
A 9-year-old child, gender-ambiguous, warm and approachable appearance.
Medium-length wavy brown hair reaching just above the shoulders, parted
slightly to the side. Round face, small nose, large expressive eyes,
light freckles across the cheeks and nose. Average build, friendly
posture. Light skin tone with a warm tan. NO logos on clothing, NO
branded items, NO visible text anywhere.
```

*Tipp: Wenn dein Tool einen „Character Reference"- oder „Seed"-Modus kennt (z. B. Midjourney `--cref`, Flux „Character Consistency", Recraft „Style Reference"), zuerst Bild 1 generieren, dann Bild 2 mit Verweis auf Bild 1 erzeugen.*

---

## 🖼️ BILD 1 — „Beim Matschen" (Hinterbühne / authentisch)

```
Hand-drawn black-and-white line illustration for a German elementary
school teaching material, A4 portrait format, clean ink-sketch style
reminiscent of classic children's book illustration (think Axel
Scheffler, Rotraut Susanne Berner, or Quentin Blake — warm, loose,
expressive linework).

SCENE:
A 9-year-old child playing joyfully in a large muddy puddle in a
garden on a grey drizzly afternoon. The child is mid-movement,
crouching and laughing out loud, splashing muddy water with both hands.
Muddy splatters on their cheeks, forehead, arms and clothes. Wearing
rubber boots (one slightly tipped over), a rain jacket hanging open,
and old play clothes. Tousled, wet hair sticking out in several
directions. A wooden stick lies next to them in the mud. In the
background: a simple fence, a few bare trees, a watering can tipped on
its side. Light rain suggested by a few diagonal dashes.

MOOD: unposed, spontaneous, delighted, genuinely happy — this is a
"backstage" moment, not a photograph.

CHARACTER (identical in both images):
A 9-year-old child, gender-ambiguous, warm and approachable appearance.
Medium-length wavy brown hair reaching just above the shoulders, parted
slightly to the side. Round face, small nose, large expressive eyes,
light freckles across the cheeks and nose. Average build, friendly
posture. Light skin tone with a warm tan. NO logos on clothing, NO
branded items, NO visible text anywhere.

STYLE:
- Black ink on white/cream paper
- Loose, confident contour lines with slight imperfections
- Soft cross-hatching for shading (no flat grey fills, no photo
  textures)
- Minimal detail, generous white space, childlike warmth
- Friendly, non-cartoonish — closer to a picture book than to anime
  or manga
- Square composition, single focal figure, simple readable background

AVOID:
Colour, photorealism, 3D rendering, glossy digital look, AI
"hyperdetail", uncanny faces, adult body proportions, sexualised
clothing, cultural stereotyping, visible brand logos, text or
speech bubbles, watermarks.

FORMAT:
A4 portrait (ratio 1:1.414), 300 dpi, print-ready, black-and-white
only.
```

---

## 🖼️ BILD 2 — „Geburtstagsfoto" (Vorderbühne / inszeniert)

```
Hand-drawn black-and-white line illustration for a German elementary
school teaching material, A4 portrait format, SAME clean ink-sketch
style as the paired image (classic children's book illustration, warm
and expressive linework — Axel Scheffler / Rotraut Susanne Berner /
Quentin Blake direction). The two images must visually belong
together as a matched pair.

SCENE:
The SAME 9-year-old child as in the paired illustration, now posing
neatly for a birthday photograph in a tidy living room. Standing
upright and slightly formally, shoulders squared, hands folded
politely in front. Wearing a crisp button-up shirt (or a simple neat
dress — gender-ambiguous formal children's clothing), freshly combed
hair, a small paper birthday hat sitting a little crooked on top. A
wide, obviously posed "photo smile" — friendly but clearly performed
for the camera. Behind the child: a birthday cake with lit candles on
a small table, a couple of balloons tied to a chair, a simple "Happy
Birthday" style paper garland (BUT WITHOUT readable text — draw it
as abstract triangular bunting only). Clean floor, a hint of a sofa.

MOOD: posed, proud, polished, a little stiff — this is the "front
stage" version: the photo that gets sent to the grandparents.

CHARACTER (identical in both images):
A 9-year-old child, gender-ambiguous, warm and approachable appearance.
Medium-length wavy brown hair reaching just above the shoulders, parted
slightly to the side. Round face, small nose, large expressive eyes,
light freckles across the cheeks and nose. Average build, friendly
posture. Light skin tone with a warm tan. NO logos on clothing, NO
branded items, NO visible text anywhere.

STYLE:
- Black ink on white/cream paper, matching Image 1 exactly
- Loose, confident contour lines with slight imperfections
- Soft cross-hatching for shading
- Minimal detail, generous white space, childlike warmth
- Non-cartoonish, picture-book feel
- Square composition, single focal figure, simple readable background

AVOID:
Colour, photorealism, 3D rendering, glossy digital look, AI
"hyperdetail", uncanny faces, adult body proportions, sexualised
clothing, cultural stereotyping, visible brand logos, readable text
on banners or the cake, watermarks.

FORMAT:
A4 portrait (ratio 1:1.414), 300 dpi, print-ready, black-and-white
only. Must clearly match Image 1 as a pair (same child, same
illustration style, same line weight).
```

---

## 💡 Tipps für die Umsetzung

1. **Reihenfolge:** Generiere zuerst Bild 1 („Matschen") bis es sitzt, fixiere den Seed bzw. lade es als Character-/Style-Reference, dann erst Bild 2 erzeugen — dann bleibt das Kind wirklich dieselbe Figur.
2. **Midjourney:** `--cref [URL Bild 1] --cw 100 --sref [URL Bild 1] --ar 3:4` nach dem Prompt anhängen, dann ist Wiedererkennung fast garantiert.
3. **Flux / Ideogram:** „Character Consistency"- oder „Character Lock"-Modus aktivieren.
4. **DALL·E 3 (in ChatGPT):** In einem einzigen Chat beide Bilder nacheinander anfordern und dabei auf das erste verweisen („Zeichne jetzt dasselbe Kind aus dem vorigen Bild, aber …") — DALL·E hält die Figur oft erstaunlich konsistent.
5. **Nachbearbeitung:** Beide Bilder am Ende nebeneinander auf ein A4-Querformat setzen (zwei Spalten, darüber die Impulsfrage als Text) — ergibt eine projizierbare Unterrichtsfolie.
6. **Datenschutz:** Kind bewusst **nicht fotorealistisch** und ohne reale Vorlage. Die Illustration hält Abstand zu echten Schüler:innen und vermeidet Pathologisierung oder Identifikation.

---

## Alternative für Hand-Skizzen-Look (falls pure Linienzeichnung gewünscht)

Falls das Ergebnis zu „aufwändig illustriert" aussieht — das didaktische Material verlangt ausdrücklich nur eine *skizzenhafte* Zeichnung. Dann diesen Style-Block ersetzen durch:

```
STYLE (alternative: very loose sketch):
Quick black ballpoint-pen or felt-tip sketch on white paper, very
loose and rough lines, minimal hatching, almost like a teacher's
blackboard drawing or a hand-drawn worksheet illustration. Childlike
and unpolished on purpose. Single uniform line weight.
```

---

*DURCHBLICKT! · LH 2 · Phase 1 · GS-Erweiterung · Prompt-Datei zum Bilderpaar*

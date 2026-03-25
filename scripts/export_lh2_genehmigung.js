const {
  Document, Packer, Paragraph, Table, TableRow, TableCell,
  TextRun, AlignmentType, WidthType, BorderStyle,
  ShadingType, TableLayoutType
} = require("docx");
const fs = require("fs");
const path = require("path");

const OQ = "\u201E";
const CQ = "\u201C";
const YELLOW = "FFD700";
const GREEN  = "4CAF50";
const DARK   = "333333";

function h2(text) {
  return new Paragraph({
    children: [new TextRun({ text, bold: true, size: 28, font: "Arial", color: DARK })],
    spacing: { before: 320, after: 140 },
    border: { bottom: { color: YELLOW, size: 4, style: BorderStyle.SINGLE } },
  });
}

function h3(text) {
  return new Paragraph({
    children: [new TextRun({ text, bold: true, size: 24, font: "Arial", color: DARK })],
    spacing: { before: 200, after: 80 },
  });
}

function p(runs, sp) {
  if (typeof runs === "string") runs = [new TextRun({ text: runs, size: 22, font: "Arial" })];
  return new Paragraph({ children: runs, spacing: sp || { before: 60, after: 60 } });
}

function B(text) { return new TextRun({ text, bold: true, size: 22, font: "Arial" }); }
function N(text) { return new TextRun({ text, size: 22, font: "Arial" }); }

function bullet(text, pre) {
  const runs = [];
  if (pre) runs.push(new TextRun({ text: pre + " ", bold: true, size: 22, font: "Arial" }));
  runs.push(new TextRun({ text, size: 22, font: "Arial" }));
  return new Paragraph({ children: runs, bullet: { level: 0 }, spacing: { before: 40, after: 40 } });
}

function sp() { return new Paragraph({ text: "", spacing: { before: 60, after: 60 } }); }

function mkCell(text, bg, isBold, width) {
  const c = {
    children: [new Paragraph({ children: [new TextRun({ text: String(text), bold: !!isBold, size: 20, font: "Arial", color: DARK })], spacing: { before: 60, after: 60 } })],
    shading: { type: ShadingType.CLEAR, fill: bg || "FFFFFF" },
    margins: { top: 80, bottom: 80, left: 120, right: 120 },
  };
  if (width) c.width = { size: width, type: WidthType.DXA };
  return new TableCell(c);
}

function tbl(headers, rows, widths) {
  const trows = [];
  if (headers && headers.length) {
    trows.push(new TableRow({ tableHeader: true, children: headers.map((h, i) => mkCell(h, YELLOW, true, widths ? widths[i] : null)) }));
  }
  rows.forEach((row, ri) => {
    trows.push(new TableRow({ children: row.map((v, i) => mkCell(v, ri % 2 === 0 ? "FFFFFF" : "FFFBEA", false, widths ? widths[i] : null)) }));
  });
  return new Table({ rows: trows, layout: TableLayoutType.FIXED, width: { size: 9360, type: WidthType.DXA } });
}

function box(color, label, lines) {
  const runs = label ? [new TextRun({ text: label + "  ", bold: true, size: 22, font: "Arial" })] : [];
  lines.forEach((l, i) => {
    runs.push(new TextRun({ text: l, size: 22, font: "Arial", break: i > 0 ? 1 : 0 }));
  });
  return new Paragraph({
    children: runs,
    shading: { type: ShadingType.CLEAR, fill: color === GREEN ? "E8F5E9" : "FFF9C4" },
    border: {
      top:    { color, size: 6, style: BorderStyle.SINGLE },
      bottom: { color, size: 6, style: BorderStyle.SINGLE },
      left:   { color, size: 18, style: BorderStyle.SINGLE },
      right:  { color, size: 6, style: BorderStyle.SINGLE },
    },
    spacing: { before: 120, after: 120 },
    indent: { left: 180 },
  });
}

// ── Inhalt ────────────────────────────────────────────────────────────────────
const ch = [];

// Titel
ch.push(
  new Paragraph({ children: [new TextRun({ text: "DURCHBLICKT! \u2013 Genehmigungsvorlage BARMER", bold: true, size: 36, font: "Arial", color: DARK })], spacing: { before: 0, after: 80 } }),
  new Paragraph({ children: [new TextRun({ text: "Lehrkr\u00e4ftehandreichung 2: " + OQ + "Wer bin ich online?" + CQ, bold: true, size: 28, font: "Arial", color: DARK })], spacing: { before: 0, after: 80 } }),
  new Paragraph({ children: [new TextRun({ text: "Digitale Identit\u00e4t zwischen Selbstausdruck und Selbstinszenierung", size: 24, font: "Arial", color: "555555", italics: true })], spacing: { before: 0, after: 200 } }),
  tbl([], [
    ["Dokument",     "Freigabevorlage Phase 4b | Stand: M\u00e4rz 2026"],
    ["Autor",        "Michael Kohl"],
    ["Verlag",       "Klett MEX"],
    ["Auftraggeber", "BARMER"],
    ["Zielgruppe",   "Lehrkr\u00e4fte Sekundarstufe I + II"],
    ["Dauer",        "90 Minuten (Doppelstunde)"],
  ], [2600, 6760]),
  sp()
);

// Leitlinien-Check
ch.push(
  h2("Leitlinien-Check 2026 (Phase 4a)"),
  tbl(
    ["#", "Leitlinie", "Befund", "\u2713"],
    [
      ["1", "Binnendifferenzierung", "Alle 5 Phasen enthalten explizite Sek\u00a0I / Sek\u00a0II-Varianten \u2013 in Aufgaben, Leitfragen, Theoriebezu\u0308gen und Materialien", "\u2705"],
      ["2", "Klarer Fokus", "Eine Leitfrage: Digitale Identit\u00e4t und ihre Auswirkung auf Selbstbild & psychische Gesundheit \u2013 alle Phasen zahlen darauf ein", "\u2705"],
      ["3", "Andocken", "Explizite Abgrenzung zu 8 bestehenden LH (LH1, LH29, LH19, LH14, LH7, LH5, LH3, LH9); neue Perspektive: psychologisch-reflexiv statt technisch-rechtlich", "\u2705"],
      ["4", "Gesundheitsbezug", "Psychische Gesundheit (Selbstwert, sozialer Vergleich, Identit\u00e4tsstress) und soziale Gesundheit (Authentizit\u00e4t, Beziehungsqualit\u00e4t) in jeder Phase verankert", "\u2705"],
      ["5", "Grobkonzept zuerst", "Vollst\u00e4ndige Konzeptstruktur; Grundschul-Erweiterung folgt in Phase 6a nach BARMER-Freigabe", "\u2705"],
    ],
    [400, 2200, 6160, 400]
  ),
  sp(),
  box(GREEN, "\u2713  Gesamtbewertung:", ["\u2705 Einreichungsreif", "Grundschul-Check entf\u00e4llt \u2013 Erweiterung wird nach BARMER-Freigabe in Phase 6a eingebaut."]),
  sp()
);

// Rahmendaten
ch.push(
  h2("1. Rahmendaten"),
  tbl([], [
    ["Arbeitstitel",          OQ + "Wer bin ich online? \u2013 Digitale Identit\u00e4t zwischen Selbstausdruck und Selbstinszenierung" + CQ],
    ["Zielgruppe",            "Lehrkr\u00e4fte weiterf\u00fchrender Schulen (Sekundarstufe I + II)"],
    ["Altersgruppe Lernende", "11\u201318 Jahre (mit Binnendifferenzierung)"],
    ["Dauer",                 "90 Minuten (Doppelstunde)"],
    ["DSGVO-Hinweis",         "Alle Methoden ohne Registrierung/personenbezogene Daten umsetzbar; Arbeit mit fiktiven Beispielen; keine Offenlegung privater Profile erforderlich"],
  ], [2600, 6760]),
  sp()
);

// Leitfrage
ch.push(
  h2("2. Leitfrage"),
  box(YELLOW, "Leitfrage", [
    "Wie beeinflusst die Art, wie ich mich online pr\u00e4sentiere, mein Selbstbild,",
    "meine psychische Gesundheit und meine Beziehungen \u2013 und wie kann ich",
    "eine bewusste und gesunde digitale Identit\u00e4t entwickeln?",
  ]),
  sp()
);

// Kernbotschaften
ch.push(
  h2("3. Kernbotschaften"),
  bullet("Digitale Identit\u00e4t ist gestaltbar \u2013 Online-Profile sind konstruiert; niemand zeigt die ganze Wahrheit \u00fcber sich.", "1."),
  bullet("Online-Selbstdarstellung ist nie neutral \u2013 Sie bedient psychologische Bed\u00fcrfnisse (Anerkennung, Zugeh\u00f6rigkeit, Selbstwert).", "2."),
  bullet("Soziale Vergleiche k\u00f6nnen schaden \u2013 Der st\u00e4ndige Vergleich mit kuratierten Profilen belastet Selbstwertgef\u00fchl und Wohlbefinden.", "3."),
  bullet("Authentizit\u00e4t ist Gesundheitsschutz \u2013 Reflexion \u00fcber die eigene Online-Pr\u00e4senz f\u00f6rdert mentale Gesundheit.", "4."),
  sp()
);

// Abgrenzung
ch.push(
  h2("4. Abgrenzung zu bestehenden Handreichungen"),
  tbl(
    ["Bestehende LH", "Schwerpunkt bisher", "Diese LH \u2013 neuer Blickwinkel"],
    [
      ["LH1 Grundlagen Datenschutz",  "Identit\u00e4t im rechtlichen Sinne",            "Identit\u00e4t im psychologischen Sinne"],
      ["LH29 Selbstwahrnehmung",      "Allgemeines Selbstbild, Hate Speech",          "Konstruktion & Wirkung der digitalen Identit\u00e4t"],
      ["LH19 K\u00f6rperbilder",            "Sch\u00f6nheitsideale, Bildmanipulation",         "Gesamte Selbstdarstellung, Identit\u00e4tskonstruktion"],
      ["LH7 Influencer:innen",        "Fremde Profile analysieren, Werbung erkennen", "Eigene Online-Pr\u00e4sentation reflektieren"],
      ["LH14 Challenges",             "Algorithmen, virale Mechanismen",              "Pers\u00f6nliche Selbstdarstellungsstrategien"],
    ],
    [2400, 3480, 3480]
  ),
  sp(),
  p([B("Neuer Blickwinkel: "), N("Alle bisherigen LH behandeln das Thema funktional, technisch oder rechtlich. Diese LH er\u00f6ffnet erstmals die psychologisch-reflexive Dimension \u2013 Identit\u00e4tsentwicklung durch und in sozialen Medien.")]),
  sp()
);

// Gesundheitsbezug
ch.push(
  h2("5. Gesundheitsbezug"),
  h3("Psychische Gesundheit"),
  bullet("Sozialer Vergleich \u2192 Unzufriedenheit, beeintr\u00e4chtigtes Selbstwertgef\u00fchl"),
  bullet("Perfektionsdruck \u2192 Stress, Angst vor negativem Feedback"),
  bullet("Abh\u00e4ngigkeit von externer Best\u00e4tigung (Likes, Kommentare)"),
  bullet("Diskrepanz Online-Persona / reales Selbst \u2192 Identit\u00e4tsstress"),
  bullet("Ersch\u00f6pfung durch st\u00e4ndige Selbstoptimierung"),
  h3("Soziale Gesundheit"),
  bullet("Authentizit\u00e4t als Basis f\u00fcr echte Beziehungen"),
  bullet("Gruppendruck durch Erwartungen an Online-Pr\u00e4senz"),
  bullet("Risiko der Isolation trotz hoher Online-Pr\u00e4senz"),
  h3("Medienkompetenz als Schutzfaktor"),
  bullet("Bewusstsein f\u00fcr die Konstruiertheit von Online-Profilen"),
  bullet("F\u00e4higkeit zur kritischen Selbstreflexion der eigenen Pr\u00e4sentation"),
  bullet("Balance zwischen Selbstausdruck und Selbstschutz"),
  sp()
);

// Ablaufstruktur
ch.push(
  h2("6. Ablaufstruktur (\u00dcberblick, 90 Min.)"),
  tbl(
    ["Phase", "Bezeichnung", "Inhalt (Kurzform)", "Zeit", "Sek\u00a0I / Sek\u00a0II"],
    [
      ["1", "Einstieg & Aktivierung",     "Bildcollage: 4 Profile derselben Person; " + OQ + "Wer ist die echte Person?" + CQ,                                      "15 Min.", "Sek\u00a0I: eigene Plattformen\nSek\u00a0II: + Impression Management"],
      ["2", "Hinf\u00fchrung & Grundlagen", OQ + "5 Bausteine der digitalen Identit\u00e4t" + CQ + " \u2013 Welche Entscheidungen treffen wir?",                 "20 Min.", "Sek\u00a0I: konkrete Beschreibung\nSek\u00a0II: + Goffman-Theorie"],
      ["3", "Vertiefung I \u2013 Profile",   "3 fiktive Profile analysieren (Der Perfekte / Der Authentische / Der Kreative)",                                       "20 Min.", "Sek\u00a0I: Beschreibung\nSek\u00a0II: + psychologische Analyse"],
      ["4", "Vertiefung II \u2013 Vergleiche","3 Fallbeispiele: Soziale Vergleiche & Auswirkungen auf Selbstbild",                                                  "20 Min.", "Sek\u00a0I: Gef\u00fchle erkennen\nSek\u00a0II: + Social Comparison Theory"],
      ["5", "Transfer & Reflexion",       "Eigene Pr\u00e4senz reflektieren; " + OQ + "5 Fragen vor dem Posten" + CQ + "; Meinungslinie",                          "15 Min.", "Sek\u00a0I: Verhaltenstipps\nSek\u00a0II: + gesellschaftl. Verantwortung"],
    ],
    [500, 1900, 3060, 700, 3200]
  ),
  sp()
);

// Materialuebersicht
ch.push(
  h2("7. Material\u00fcbersicht"),
  tbl(
    ["Nr.", "Material", "Einsatz"],
    [
      ["Bildmaterial 1", "4 Profile derselben Person (verschiedene Plattformen)",                                             "Phase 1"],
      ["Infografik",     OQ + "Die 5 Bausteine der digitalen Identit\u00e4t" + CQ,                                          "Phase 2"],
      ["AB 1",           "Bausteine-Analyse (Gestaltungsentscheidungen bei Online-Profilen)",                                  "Phase 2"],
      ["AB 2",           "Profil-Analyse (3 fiktive Profile mit Leitfragen)",                                                 "Phase 3"],
      ["AB 3a/b/c",      "Fallbeispiele Soziale Vergleiche & Auswirkungen",                                                   "Phase 4"],
      ["AB 4",           "Selbstreflexion eigene Online-Pr\u00e4senz (anonym)",                                               "Phase 5"],
      ["AB 5",           OQ + "5 Fragen vor dem Posten" + CQ + " \u2013 Leitfragen f\u00fcr reflektierte Selbstdarstellung", "Phase 5"],
      ["Exkurs",         "Psychologie der Selbstdarstellung (Erikson, Goffman, Festinger)",                                   "Lehrkr\u00e4ftebereich"],
    ],
    [1400, 5760, 2200]
  ),
  sp(),
  p("Alle Materialien in Sek\u00a0I- und Sek\u00a0II-Variante. Kein Einsatz digitaler Tools zwingend erforderlich."),
  sp()
);

// Offene Fragen
ch.push(
  h2("8. Offene Fragen / Abstimmungsbedarf mit BARMER"),
  p("Folgende Punkte ben\u00f6tigen eine Entscheidung vor Beginn des Feinkonzepts:"),
  sp(),
  tbl(
    ["Nr.", "Frage", "Optionen"],
    [
      ["1", "Arbeitstitel",       OQ + "Wer bin ich online?" + CQ + " (jugendnah) | " + OQ + "Mein digitales Ich" + CQ + " | " + OQ + "Digitale Identit\u00e4t zwischen Selbstausdruck und Selbstinszenierung" + CQ + " (fachlich)"],
      ["2", "Bildmaterial",       "Fiktive Mockup-Profile (Instagram-Layout) oder abstrahierte Darstellung? Eigene Produktion oder vorhandenes Material?"],
      ["3", "Exkurs-Schwerpunkt", "Psychologische Theorie (Goffman, Festinger, Erikson) oder praktische Tipps f\u00fcr Eltern / " + OQ + "Digital Wellbeing" + CQ + "?"],
      ["4", "Fiktive Profile",    "Als Social-Media-Mockups gestalten oder abstrakt mit Icons/Textbeschreibung?"],
      ["5", "Querverweise",       "Explizite Verweise auf LH1/LH29/LH19 im Sch\u00fcler:innen-Material oder nur im Lehrkr\u00e4fteteil?"],
      ["6", "Video-Einstieg",     "Erg\u00e4nzendes Startervideo gew\u00fcnscht oder rein materialbasiert?"],
    ],
    [400, 2600, 6360]
  ),
  sp()
);

// Naechste Schritte
ch.push(
  h2("9. N\u00e4chste Schritte nach BARMER-Freigabe"),
  p("Nach Freigabe durch BARMER startet Phase 5 (Feinkonzept + Arbeitsbl\u00e4tter):"),
  bullet("Feinkonzept ausarbeiten", "1."),
  bullet("Fiktive Profile entwickeln (3 Selbstdarstellungs-Typen)", "2."),
  bullet("Fallbeispiele zu sozialen Vergleichen ausformulieren", "3."),
  bullet("Arbeitsbl\u00e4tter entwerfen (Sek\u00a0I / Sek\u00a0II-Varianten: AB 1\u20135)", "4."),
  bullet("Exkurs-Seite ausarbeiten (Erikson, Goffman, Festinger)", "5."),
  bullet("Ablaufstruktur (6 Phasen) vertiefen \u2013 inkl. Platzhalter Grundschul-Erweiterung", "6."),
  bullet("Grundschul-Erweiterung in 2 thematisch passenden Phasen einbauen (Phase 6a)", "7."),
  sp(),
  new Paragraph({ children: [new TextRun({ text: "DURCHBLICKT! \u2013 Digital in eine gesunde Zukunft  |  BARMER / Klett MEX", size: 18, font: "Arial", color: "888888", italics: true })], alignment: AlignmentType.CENTER, spacing: { before: 240, after: 40 } }),
  new Paragraph({ children: [new TextRun({ text: "Genehmigungsvorlage LH2  |  Autor: Michael Kohl  |  M\u00e4rz 2026", size: 18, font: "Arial", color: "888888", italics: true })], alignment: AlignmentType.CENTER, spacing: { before: 0, after: 0 } })
);

// ── Dokument ──────────────────────────────────────────────────────────────────
const doc = new Document({
  styles: { default: { document: { run: { font: "Arial", size: 22, color: DARK } } } },
  sections: [{
    properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 1134, bottom: 1134, left: 1134, right: 1134 } } },
    children: ch,
  }],
});

const outPath = path.join(__dirname, "../output/LH2_Genehmigungsvorlage_BARMER_2026-03.docx");
Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync(outPath, buf);
  console.log("\u2705 DOCX erstellt: " + outPath);
});

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
  new Paragraph({ children: [new TextRun({ text: "Lehrkr\u00e4ftehandreichung 3: \u201EGesundheitsmythen im Netz\u201C", bold: true, size: 28, font: "Arial", color: DARK })], spacing: { before: 0, after: 80 } }),
  new Paragraph({ children: [new TextRun({ text: "Wie erkenne ich verl\u00e4ssliche Gesundheitsinformationen \u2013 und warum ist das wichtig?", size: 24, font: "Arial", color: "555555", italics: true })], spacing: { before: 0, after: 200 } }),
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
      ["1", "Binnendifferenzierung", "Alle 5 Phasen enthalten explizite Sek\u00a0I / Sek\u00a0II-Varianten \u2013 in Aufgaben, Methoden und Materialien (z.\u00a0B. QQQQ-Methode vereinfacht vs. erweitert; Quiz Multiple Choice vs. offen)", "\u2705"],
      ["2", "Klarer Fokus", "Eine Leitfrage: Wie erkenne ich verl\u00e4ssliche Gesundheitsinformationen im Netz \u2013 und warum ist das f\u00fcr meine k\u00f6rperliche und mentale Gesundheit wichtig? Alle Phasen zahlen darauf ein.", "\u2705"],
      ["3", "Andocken", "Explizite Abgrenzung zu LH6 (Fake News allgemein), LH19 (K\u00f6rperbilder), LH8 (Gesundheitsgewohnheiten), LH7 (Influencer); neue Perspektive: gesundheitsspezifische Falschinformation + Faktencheck-Kompetenz", "\u2705"],
      ["4", "Gesundheitsbezug", "K\u00f6rperliche Gesundheit (gef\u00e4hrliche Trends, Ern\u00e4hrungsrisiken), psychische Gesundheit (Verunsicherung, Schamgef\u00fchle, K\u00f6rperbild-Druck) und Medienkompetenz als Schutzfaktor in allen Phasen verankert", "\u2705"],
      ["5", "Grobkonzept zuerst", "Vollst\u00e4ndige Konzeptstruktur mit 16 Abschnitten; Grundschul-Erweiterung folgt in Phase 6a nach BARMER-Freigabe", "\u2705"],
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
    ["Arbeitstitel",          OQ + "Gesundheitsmythen im Netz \u2013 Was stimmt wirklich?" + CQ],
    ["Alternativtitel",       OQ + "Fakt oder Fake? Gesundheitsbehauptungen kritisch pr\u00fcfen" + CQ],
    ["Zielgruppe",            "Lehrkr\u00e4fte weiterf\u00fchrender Schulen (Sekundarstufe I + II)"],
    ["Altersgruppe Lernende", "11\u201318 Jahre (mit Binnendifferenzierung)"],
    ["Dauer",                 "90 Minuten (Doppelstunde)"],
    ["DSGVO-Hinweis",         "Alle Methoden ohne Registrierung/personenbezogene Daten umsetzbar; Arbeit mit fiktiven Beispielen"],
  ], [2600, 6760]),
  sp()
);

// Leitfrage
ch.push(
  h2("2. Leitfrage"),
  box(YELLOW, "Leitfrage", [
    "Wie erkenne ich verl\u00e4ssliche Gesundheitsinformationen im Netz \u2013",
    "und warum ist das f\u00fcr meine k\u00f6rperliche und mentale Gesundheit wichtig?",
  ]),
  sp()
);

// Kernbotschaften
ch.push(
  h2("3. Kernbotschaften"),
  bullet("Nicht alles, was viral geht, ist wahr \u2013 Gesundheitsmythen verbreiten sich online besonders schnell, weil sie einfache L\u00f6sungen versprechen.", "1."),
  bullet("K\u00f6rperbilder und Gesundheitsideale sind oft konstruiert \u2013 Social Media zeigt unrealistische, teilweise gesundheitssch\u00e4dliche Standards.", "2."),
  bullet("Wissenschaftliche Quellen erkennen sch\u00fctzt \u2013 Wer Fakten von Mythen unterscheiden kann, trifft bessere Gesundheitsentscheidungen.", "3."),
  bullet("Kritisches Denken ist Gesundheitsschutz \u2013 Medienkompetenz bef\u00e4higt zu informierten Entscheidungen \u00fcber den eigenen K\u00f6rper.", "4."),
  sp()
);

// Abgrenzung
ch.push(
  h2("4. Abgrenzung zu bestehenden Handreichungen"),
  tbl(
    ["Bestehende LH", "Schwerpunkt bisher", "Diese LH \u2013 neuer Blickwinkel"],
    [
      ["LH6 Desinformation",  "Fake News allgemein, politische Fehlinformation",     "Gesundheitsspezifische Falschinformationen"],
      ["LH19 K\u00f6rperbilder",    "Sch\u00f6nheitsideale und Bildmanipulation",             "Gesundheitsmythen zu K\u00f6rper, Ern\u00e4hrung, \u201EWellness\u201C"],
      ["LH8 Digital stark",   "Gesunde Gewohnheiten (Schlaf, Bewegung)",             "Kritische Bewertung von Gesundheitsbehauptungen"],
      ["LH7 Influencer:innen","Werbung erkennen",                                    "Gesundheits-Influencer:innen und ihre Aussagen pr\u00fcfen"],
    ],
    [2200, 3580, 3580]
  ),
  sp(),
  p([B("Neuer Blickwinkel: "), N("Keine bisherige LH verbindet Faktencheck-Kompetenz mit gesundheitsspezifischen Inhalten und K\u00f6rperbild-Reflexion in einer Einheit.")]),
  sp()
);

// Gesundheitsbezug
ch.push(
  h2("5. Gesundheitsbezug"),
  h3("K\u00f6rperliche Gesundheit"),
  bullet("Gef\u00e4hrliche Gesundheitstrends (extreme Di\u00e4ten, fragw\u00fcrdige Challenges, \u201EDetox\u201C-Produkte)"),
  bullet("Risiken durch Falschinformationen zu Ern\u00e4hrung, Nahrungserg\u00e4nzung, Medikamenten"),
  bullet("Unrealistische K\u00f6rperbilder als Motivation f\u00fcr ungesunde Verhaltensweisen"),
  h3("Psychische Gesundheit"),
  bullet("Druck durch idealisierte K\u00f6rperbilder und Gesundheitsstandards"),
  bullet("Verunsicherung und Stress durch widerspr\u00fcchliche Gesundheitsinfos"),
  bullet("Schamgef\u00fchle und Selbstwertverluste durch Online-Vergleiche"),
  h3("Medienkompetenz als Schutzfaktor"),
  bullet("Wissenschaftliche Quellen von Meinungen unterscheiden"),
  bullet("Kommerzielle Interessen hinter Gesundheitsbehauptungen erkennen"),
  bullet("Selbstbestimmte, informierte Entscheidungen \u00fcber die eigene Gesundheit treffen"),
  sp()
);

// Ablaufstruktur
ch.push(
  h2("6. Ablaufstruktur (\u00dcberblick, 90 Min.)"),
  tbl(
    ["Phase", "Bezeichnung", "Inhalt (Kurzform)", "Zeit", "Sek\u00a0I / Sek\u00a0II"],
    [
      ["1", OQ + "Glaubst du das?" + CQ,    "8 Gesundheitsbehauptungen; \u201EDaumen hoch/runter\u201C; Br\u00fcckenfrage zu Gesundheitsentscheidungen",       "15 Min.", "Sek\u00a0I: TikTok/Instagram\nSek\u00a0II: + Gesundheitsblogs, pseudowiss. Studien"],
      ["2", "Warum verbreiten sich Mythen?", "Verbreitungsmechanismen; psychische Gesundheitsfolgen von Fehlinformation benennen",                       "15 Min.", "Sek\u00a0I: konkrete Beispiele\nSek\u00a0II: + Dunning-Kruger, Best\u00e4tigungsfehler"],
      ["3", "Faktencheck-Werkstatt",         "QQQQ-Methode; 4 Behauptungen in Gruppen pr\u00fcfen; Pr\u00e4sentation",                                     "25 Min.", "Sek\u00a0I: vereinfachte Checkliste\nSek\u00a0II: + Studienqualit\u00e4t, Eigenrecherche"],
      ["4", "K\u00f6rperbilder & Mythen",        "3 fiktive Influencer-Profile analysieren (Fitness / Ern\u00e4hrung / Beauty)",                              "15 Min.", "Sek\u00a0I: Beschreiben, Erkennen\nSek\u00a0II: + Gesch\u00e4ftsmodelle, Essst\u00f6rungen"],
      ["5", OQ + "Wahr oder Fake?\u201C-Quiz",   "Quiz-Fragen erstellen und spielen; \u201EMein Faktencheck-Versprechen\u201C",                               "20 Min.", "Sek\u00a0I: Multiple Choice\nSek\u00a0II: offene Fragen + Quellenangabe"],
    ],
    [500, 2000, 2960, 700, 3200]
  ),
  sp()
);

// Materialuebersicht
ch.push(
  h2("7. Material\u00fcbersicht"),
  tbl(
    ["Nr.", "Material", "Einsatz"],
    [
      ["Bildmaterial",  "Collage: 8 Gesundheitsbehauptungen aus Social Media",                                        "Phase 1"],
      ["AB 1",          "Verbreitungsmechanismen: \u201EWarum verbreiten sich Mythen?\u201C",                          "Phase 2"],
      ["AB 2",          "QQQQ-Methode, Quellencheck-Checkliste, Liste verl\u00e4sslicher Quellen",                    "Phase 3"],
      ["AB 3a\u2013d",  "Praxis-Faktencheck: 4 Gesundheitsbehauptungen",                                              "Phase 3"],
      ["AB 4",          "Influencer-Analyse: 3 fiktive Profile (Fitness / Ern\u00e4hrung / Beauty)",                  "Phase 4"],
      ["AB 5",          "Quiz-Erstellungsvorlage \u201EWahr oder Fake?\u201C",                                         "Phase 5"],
      ["Exkurs",        "Wissenschaft vs. Meinung; verl\u00e4ssliche deutsche Gesundheitsquellen",                    "Lehrkr\u00e4ftebereich"],
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
      ["1", "Arbeitstitel",       OQ + "Gesundheitsmythen im Netz\u201C (direkt) | " + OQ + "Fakt oder Fake? Gesundheitsinformationen bewerten\u201C (methodisch)"],
      ["2", "Bildmaterial",       "Fiktive Mockups/Screenshots (rechtssicher) oder echte anonymisierte Beispiele?"],
      ["3", "Video",              "Vorhandenes Material zu Faktencheck-Methoden oder Neuproduktion?"],
      ["4", "Quiz-Tool",          "Digital (Kahoot, LearningApps) oder analog (Karten)?"],
      ["5", "Influencer-Profile", "Als Social-Media-Mockups gestalten oder abstrakt mit Textbeschreibung?"],
      ["6", "KI-Erweiterung",     "Sollen KI-generierte Gesundheitstipps als neue Dimension aufgenommen werden?"],
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
  bullet("4 Beispiel-Behauptungen f\u00fcr Faktenchecks ausw\u00e4hlen und aufbereiten (mit Quellen)", "2."),
  bullet("3 fiktive Influencer-Profile entwickeln (Fitness / Ern\u00e4hrung / Beauty)", "3."),
  bullet("QQQQ-Methodenblatt und Checklisten erstellen (Sek\u00a0I / Sek\u00a0II)", "4."),
  bullet("Quiz-Vorlagen entwickeln (Multiple Choice / offen)", "5."),
  bullet("Exkurs-Seite ausarbeiten", "6."),
  bullet("Ablaufstruktur (6 Phasen) vertiefen \u2013 inkl. Platzhalter Grundschul-Erweiterung", "7."),
  bullet("Grundschul-Erweiterung in 2 thematisch passenden Phasen einbauen (Phase 6a)", "8."),
  sp(),
  new Paragraph({ children: [new TextRun({ text: "DURCHBLICKT! \u2013 Digital in eine gesunde Zukunft  |  BARMER / Klett MEX", size: 18, font: "Arial", color: "888888", italics: true })], alignment: AlignmentType.CENTER, spacing: { before: 240, after: 40 } }),
  new Paragraph({ children: [new TextRun({ text: "Genehmigungsvorlage LH3  |  Autor: Michael Kohl  |  M\u00e4rz 2026", size: 18, font: "Arial", color: "888888", italics: true })], alignment: AlignmentType.CENTER, spacing: { before: 0, after: 0 } })
);

// ── Dokument ──────────────────────────────────────────────────────────────────
const doc = new Document({
  styles: { default: { document: { run: { font: "Arial", size: 22, color: DARK } } } },
  sections: [{
    properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 1134, bottom: 1134, left: 1134, right: 1134 } } },
    children: ch,
  }],
});

const outPath = path.join(__dirname, "../output/LH3_Genehmigungsvorlage_BARMER_2026-03.docx");
Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync(outPath, buf);
  console.log("\u2705 DOCX erstellt: " + outPath);
});

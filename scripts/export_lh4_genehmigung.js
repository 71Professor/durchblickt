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
  new Paragraph({ children: [new TextRun({ text: "Lehrkr\u00e4ftehandreichung 4: \u201ESchlaf gut!\u201C", bold: true, size: 28, font: "Arial", color: DARK })], spacing: { before: 0, after: 80 } }),
  new Paragraph({ children: [new TextRun({ text: "Wie digitale Ger\u00e4te unseren Schlaf beeinflussen \u2013 und was wir tun k\u00f6nnen", size: 24, font: "Arial", color: "555555", italics: true })], spacing: { before: 0, after: 200 } }),
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
      ["1", "Binnendifferenzierung", "Alle 5 Phasen enthalten explizite Sek\u00a0I / Sek\u00a0II-Varianten \u2013 in Materialtiefe, Reflexionsgrad und Aufgabenformaten (z.\u00a0B. AB\u00a04: vorstrukturiert vs. offen; Hypothesenbildung nur Sek\u00a0II)", "\u2705"],
      ["2", "Klarer Fokus", "Eine Leitfrage: Was passiert in meinem K\u00f6rper und Gehirn, wenn ich abends am Bildschirm bin \u2013 und wie kann ich besser einschlafen? Alle Phasen fokussiert auf Bildschirmzeit\u2013Schlaf-Zusammenhang.", "\u2705"],
      ["3", "Andocken", "Explizite Abgrenzung zu LH1 (Gehirn allgemein \u2192 hier: Melatonin spezifisch), LH8 (Schlaf als Randthema \u2192 hier: Kernthema), LH23 (K\u00f6rper/Augen \u2192 hier: Schlafqualit\u00e4t), LH32 (Stress allgemein \u2192 hier: abendliche Mediennutzung konkret)", "\u2705"],
      ["4", "Gesundheitsbezug", "K\u00f6rperliche Gesundheit (Melatonin, Immunsystem), psychische Gesundheit (Stimmung, Konzentration) und soziale Gesundheit (Erreichbarkeitserwartungen, sozialer Druck) in allen Phasen verankert", "\u2705"],
      ["5", "Grobkonzept zuerst", "Vollst\u00e4ndige Konzeptstruktur mit 16 Abschnitten inkl. Exkurs Chronobiologie; Grundschul-Erweiterung folgt in Phase 6a nach BARMER-Freigabe", "\u2705"],
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
    ["Arbeitstitel",          OQ + "Schlaf gut! \u2013 Wie digitale Ger\u00e4te unseren Schlaf beeinflussen" + CQ],
    ["Alternativtitel",       OQ + "Gute Nacht, Handy!\u201C | \u201EBildschirm aus, Erholung an" + CQ],
    ["Zielgruppe",            "Lehrkr\u00e4fte weiterf\u00fchrender Schulen (Sekundarstufe I + II)"],
    ["Altersgruppe Lernende", "12\u201318 Jahre (mit Binnendifferenzierung)"],
    ["Dauer",                 "90 Minuten (Doppelstunde)"],
    ["DSGVO-Hinweis",         "Alle Methoden ohne Registrierung/personenbezogene Daten umsetzbar"],
  ], [2600, 6760]),
  sp()
);

// Leitfrage
ch.push(
  h2("2. Leitfrage"),
  box(YELLOW, "Leitfrage", [
    "Was passiert in meinem K\u00f6rper und Gehirn, wenn ich abends am Bildschirm bin \u2013",
    "und wie kann ich besser einschlafen?",
  ]),
  sp()
);

// Kernbotschaften
ch.push(
  h2("3. Kernbotschaften"),
  bullet("Schlaf ist kein Luxus, sondern lebenswichtig \u2013 besonders f\u00fcr Konzentration, Lernen und psychische Gesundheit.", "1."),
  bullet("Blaues Licht beeinflusst den Schlaf-Wach-Rhythmus \u2013 Bildschirme senden Signale ans Gehirn, die uns wach halten.", "2."),
  bullet("Nicht nur das Licht ist das Problem \u2013 auch Inhalte, Aufregung und sozialer Druck (FOMO, Erreichbarkeit) st\u00f6ren das Einschlafen.", "3."),
  bullet("Bildschirmfreie Rituale helfen \u2013 wer bewusst Pausen vor dem Schlafengehen einlegt, schläft besser und fühlt sich erholter.", "4."),
  bullet("Selbstbeobachtung schafft Bewusstsein \u2013 wer den eigenen Schlaf protokolliert, erkennt Muster und Handlungsm\u00f6glichkeiten.", "5."),
  sp()
);

// Abgrenzung
ch.push(
  h2("4. Abgrenzung zu bestehenden Handreichungen"),
  tbl(
    ["Bestehende LH", "Schwerpunkt bisher", "Diese LH \u2013 neuer Blickwinkel"],
    [
      ["LH1 Mediennutzung und Gehirn",  "Dopamin, Hormone \u2013 allgemein",           "Schlaf-Wach-Rhythmus und Melatonin \u2013 spezifisch"],
      ["LH8 Digital stark",             "Schlaf als einer von vielen Aspekten",       "Schlaf als zentrales Thema, vertieft"],
      ["LH23 Nutzungsdauer / K\u00f6rper",   "Haltung, Augenprobleme",                   "Bildschirmnutzung und Schlafqualit\u00e4t"],
      ["LH32 Stress",                   "Allgemeine Stressbew\u00e4ltigung",             "Abendliche Mediennutzung als konkreter Schlafst\u00f6rer"],
    ],
    [2400, 3480, 3480]
  ),
  sp(),
  p([B("Neuer Blickwinkel: "), N("Erste LH, die den wissenschaftlich fundierten Zusammenhang Bildschirmzeit\u2013Schlaf mit praktischen Selbstexperimenten verbindet.")]),
  sp()
);

// Gesundheitsbezug
ch.push(
  h2("5. Gesundheitsbezug"),
  h3("K\u00f6rperliche Gesundheit"),
  bullet("Schlaf-Wach-Rhythmus (zirkadianer Rhythmus) und Melatoninproduktion"),
  bullet("Regeneration von K\u00f6rper und Gehirn im Schlaf"),
  bullet("Immunsystem und Schlafmangel"),
  h3("Psychische Gesundheit"),
  bullet("Zusammenhang Schlafmangel und Stimmung, Konzentration, Lernf\u00e4higkeit"),
  bullet("Langfristige Folgen chronischen Schlafmangels"),
  bullet("Stress und Erholung als Gesundheitsfaktor"),
  h3("Soziale Gesundheit"),
  bullet("Sozialer Druck zu st\u00e4ndiger Erreichbarkeit und n\u00e4chtlicher Online-Aktivit\u00e4t"),
  bullet("FOMO und Gruppenerwartungen als Schlafst\u00f6rer"),
  bullet("Bewusste Grenzsetzung als Schutz f\u00fcr Beziehungsqualit\u00e4t und Wohlbefinden"),
  h3("Medienkompetenz als Schutzfaktor"),
  bullet("Bewusste Entscheidungen \u00fcber Bildschirmzeit am Abend"),
  bullet("Erkennen eigener Muster durch Selbstbeobachtung"),
  bullet("Entwickeln individueller Abendrituale"),
  sp()
);

// Ablaufstruktur
ch.push(
  h2("6. Ablaufstruktur (\u00dcberblick, 90 Min.)"),
  tbl(
    ["Phase", "Bezeichnung", "Inhalt (Kurzform)", "Zeit", "Sek\u00a0I / Sek\u00a0II"],
    [
      ["1", "Einstieg",            "Bild: Jugendlicher liegt nachts wach; Blitzumfrage; Anschlussfrage: \u201EWie habt ihr euch heute Morgen gef\u00fchlt?\u201C",     "10 Min.", "Sek\u00a0I: Alltagserfahrungen\nSek\u00a0II: + Hypothesenbildung"],
      ["2", "Hinf\u00fchrung",         "Erkl\u00e4rvideo / Infografik Schlafbiologie; Informationskarten (Blaulicht, Melatonin, Zirkadianer Rhythmus)",          "15 Min.", "Sek\u00a0I: vereinfachtes Schaubild\nSek\u00a0II: + wissenschaftl. Details"],
      ["3", "Erarbeitung",         "Stationenarbeit: Blaues Licht / Inhalte & sozialer Druck / Schlaffunktionen / Schlafprofil",                         "25 Min.", "Sek\u00a0I: Alltagsbeispiele\nSek\u00a0II: + Studien lesen und bewerten"],
      ["4", "Praxis / Anwendung",  "Abendrituale entwickeln; \u201EBildschirmfrei-Challenge\u201C planen; Schlafprotokoll einf\u00fchren",                        "25 Min.", "Sek\u00a0I: vorstrukturiert\nSek\u00a0II: offenes Protokoll, Hypothesen"],
      ["5", "Transfer & Abschluss","Meinungslinie; H\u00fcrden besprechen; \u201EMein erster Schritt f\u00fcr besseren Schlaf\u201C; Ausblick Folgestunde",          "15 Min.", "Sek\u00a0I: pers\u00f6nliche Ebene\nSek\u00a0II: + Always-on-Kultur"],
    ],
    [500, 1800, 3160, 700, 3200]
  ),
  sp()
);

// Materialuebersicht
ch.push(
  h2("7. Material\u00fcbersicht"),
  tbl(
    ["Nr.", "Material", "Einsatz"],
    [
      ["AB 1",          "Infokarten Schlafbiologie (Melatonin, Blaues Licht, Zirkadianer Rhythmus)",          "Phase 2"],
      ["AB 2a",         "Station: Blaues Licht \u2013 Experiment Nachtmodus",                                 "Phase 3"],
      ["AB 2b",         "Station: Inhalte, Aufregung & sozialer Druck (FOMO, Erreichbarkeit)",                "Phase 3"],
      ["AB 2c",         "Station: Schlaffunktionen \u2013 Infografik \u201EWas passiert beim Schlafen?\u201C", "Phase 3"],
      ["AB 2d",         "Schlafprofil-Fragebogen (Selbsteinsch\u00e4tzung)",                                  "Phase 3"],
      ["AB 3",          "Ideensammlung Abendrituale",                                                          "Phase 4"],
      ["AB 4",          "Mein Abendritual (individuelle Gestaltungsvorlage)",                                  "Phase 4"],
      ["AB 5",          "Schlafprotokoll (Wochenprotokoll)",                                                   "Phase 4 + Folgestunde"],
      ["Exkurs",        "Chronobiologie \u2013 Schlafforschung, Chronotyp Jugendliche",                       "Lehrkr\u00e4ftebereich"],
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
      ["1", "Arbeitstitel",    OQ + "Schlaf gut!\u201C (umgangssprachlich) | \u201EGute Nacht, Handy!\u201C | \u201EBildschirm aus, Erholung an\u201C"],
      ["2", "Erkl\u00e4rvideo",    "Vorhandenes DSGVO-konformes Material (z.\u00a0B. \u00f6ffentlich-rechtlich) oder Neuproduktion?"],
      ["3", "Exkurs-Thema",   "Chronobiologie (wissenschaftlich) oder \u201ESchlaf-Apps: Sinnvoll oder kontraproduktiv?\u201C (praktisch)?"],
      ["4", "Folgestunde",    "Soll Auswertung des Schlafprotokolls als separates Mini-Material (10\u00a0Min.) ausgearbeitet werden?"],
      ["5", "Elternmaterial", "Begleitende Elterninformation zum Thema sinnvoll?"],
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
  bullet("Bestehendes Videomaterial pr\u00fcfen (\u00f6ffentlich-rechtliche Sender)", "2."),
  bullet("Arbeitsbl\u00e4tter entwerfen (Sek\u00a0I / Sek\u00a0II-Varianten)", "3."),
  bullet("Infografik \u201ESchlaf-Wach-Rhythmus\u201C gestalten", "4."),
  bullet("Schlafprotokoll-Vorlage entwickeln", "5."),
  bullet("Exkurs-Seite ausarbeiten", "6."),
  bullet("Ablaufstruktur (6 Phasen) vertiefen \u2013 inkl. Platzhalter Grundschul-Erweiterung", "7."),
  bullet("Grundschul-Erweiterung in 2 thematisch passenden Phasen einbauen (Phase 6a)", "8."),
  sp(),
  new Paragraph({ children: [new TextRun({ text: "DURCHBLICKT! \u2013 Digital in eine gesunde Zukunft  |  BARMER / Klett MEX", size: 18, font: "Arial", color: "888888", italics: true })], alignment: AlignmentType.CENTER, spacing: { before: 240, after: 40 } }),
  new Paragraph({ children: [new TextRun({ text: "Genehmigungsvorlage LH4  |  Autor: Michael Kohl  |  M\u00e4rz 2026", size: 18, font: "Arial", color: "888888", italics: true })], alignment: AlignmentType.CENTER, spacing: { before: 0, after: 0 } })
);

// ── Dokument ──────────────────────────────────────────────────────────────────
const doc = new Document({
  styles: { default: { document: { run: { font: "Arial", size: 22, color: DARK } } } },
  sections: [{
    properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 1134, bottom: 1134, left: 1134, right: 1134 } } },
    children: ch,
  }],
});

const outPath = path.join(__dirname, "../output/LH4_Genehmigungsvorlage_BARMER_2026-03.docx");
Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync(outPath, buf);
  console.log("\u2705 DOCX erstellt: " + outPath);
});

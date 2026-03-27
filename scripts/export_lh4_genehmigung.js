const {
  Document, Packer, Paragraph, Table, TableRow, TableCell,
  TextRun, AlignmentType, WidthType, BorderStyle,
  ShadingType, TableLayoutType
} = require("docx");
const fs = require("fs");
const path = require("path");

const YELLOW = "FFD700";
const GREEN  = "4CAF50";
const DARK   = "333333";
const PAGE_W = 9360; // usable width in DXA (A4, 2cm margins each side)

// ── Hilfsfunktionen ───────────────────────────────────────────────────────────

function h1(text) {
  return new Paragraph({
    children: [new TextRun({ text, bold: true, size: 36, font: "Arial", color: DARK })],
    spacing: { before: 200, after: 120 },
    border: { bottom: { color: YELLOW, size: 6, style: BorderStyle.SINGLE } },
  });
}

function h2(text) {
  return new Paragraph({
    children: [new TextRun({ text, bold: true, size: 26, font: "Arial", color: DARK })],
    spacing: { before: 280, after: 100 },
    border: { bottom: { color: YELLOW, size: 4, style: BorderStyle.SINGLE } },
  });
}

function h3(text) {
  return new Paragraph({
    children: [new TextRun({ text, bold: true, size: 22, font: "Arial", color: DARK })],
    spacing: { before: 160, after: 60 },
  });
}

function p(runs, sp) {
  if (typeof runs === "string") runs = [new TextRun({ text: runs, size: 22, font: "Arial" })];
  return new Paragraph({ children: runs, spacing: sp || { before: 60, after: 60 } });
}

function B(text) { return new TextRun({ text, bold: true, size: 22, font: "Arial" }); }
function N(text) { return new TextRun({ text, size: 22, font: "Arial" }); }
function I(text) { return new TextRun({ text, italics: true, size: 20, font: "Arial", color: "555555" }); }

function bullet(text, pre) {
  const runs = [];
  if (pre) runs.push(new TextRun({ text: pre + " ", bold: true, size: 22, font: "Arial" }));
  runs.push(new TextRun({ text, size: 22, font: "Arial" }));
  return new Paragraph({ children: runs, bullet: { level: 0 }, spacing: { before: 40, after: 40 } });
}

function sp(px) { return new Paragraph({ text: "", spacing: { before: px || 60, after: px || 60 } }); }

// Einfache Tabellenzelle (Text)
function mkCell(text, bg, isBold, width) {
  return new TableCell({
    children: [new Paragraph({
      children: [new TextRun({ text: String(text), bold: !!isBold, size: 20, font: "Arial", color: DARK })],
      spacing: { before: 60, after: 60 },
    })],
    shading: { type: ShadingType.CLEAR, fill: bg || "FFFFFF" },
    margins: { top: 80, bottom: 80, left: 120, right: 120 },
    ...(width ? { width: { size: width, type: WidthType.DXA } } : {}),
  });
}

// Tabelle mit Header
function tbl(headers, rows, widths) {
  const trows = [];
  if (headers && headers.length) {
    trows.push(new TableRow({
      tableHeader: true,
      children: headers.map((h, i) => mkCell(h, YELLOW, true, widths ? widths[i] : null)),
    }));
  }
  rows.forEach((row, ri) => {
    trows.push(new TableRow({
      children: row.map((v, i) => mkCell(v, ri % 2 === 0 ? "FFFFFF" : "FFFBEA", false, widths ? widths[i] : null)),
    }));
  });
  return new Table({ rows: trows, layout: TableLayoutType.FIXED, width: { size: PAGE_W, type: WidthType.DXA } });
}

// Infobox
function infoBox(label, lines, color) {
  color = color || YELLOW;
  const bg = color === GREEN ? "E8F5E9" : "FFF9C4";
  const runs = label ? [new TextRun({ text: label + "  ", bold: true, size: 22, font: "Arial" })] : [];
  lines.forEach((l, i) => {
    if (i > 0) runs.push(new TextRun({ break: 1 }));
    runs.push(new TextRun({ text: l, size: 22, font: "Arial" }));
  });
  return new Paragraph({
    children: runs,
    shading: { type: ShadingType.CLEAR, fill: bg },
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

// Zelle mit mehreren Paragraphen (für Ablaufstruktur-Tabelle)
function richCell(paragraphs, width, bg) {
  return new TableCell({
    children: paragraphs,
    shading: { type: ShadingType.CLEAR, fill: bg || "FFFFFF" },
    margins: { top: 100, bottom: 100, left: 140, right: 140 },
    ...(width ? { width: { size: width, type: WidthType.DXA } } : {}),
  });
}

function rp(runs, spacing) {
  if (typeof runs === "string") runs = [new TextRun({ text: runs, size: 20, font: "Arial" })];
  return new Paragraph({ children: runs, spacing: spacing || { before: 60, after: 60 } });
}

function rb(text) { return new TextRun({ text, bold: true, size: 20, font: "Arial" }); }
function rn(text) { return new TextRun({ text, size: 20, font: "Arial" }); }

function rBullet(text) {
  return new Paragraph({
    children: [new TextRun({ text, size: 19, font: "Arial" })],
    bullet: { level: 0 },
    spacing: { before: 30, after: 30 },
  });
}

function rSp() { return new Paragraph({ text: "", spacing: { before: 40, after: 0 } }); }

// ── Ablaufstruktur-Tabelle (zweispaltig) ──────────────────────────────────────

function ablaufTable(rows) {
  const trows = [
    new TableRow({
      tableHeader: true,
      children: [
        mkCell("Phase / Inhalt", YELLOW, true, 5800),
        mkCell("Differenzierung Sek\u00a0I / Sek\u00a0II", YELLOW, true, 3560),
      ],
    }),
    ...rows,
  ];
  return new Table({ rows: trows, layout: TableLayoutType.FIXED, width: { size: PAGE_W, type: WidthType.DXA } });
}

function phaseRow(leftParas, rightParas, bg) {
  return new TableRow({
    children: [
      richCell(leftParas, 5800, bg || "FFFFFF"),
      richCell(rightParas, 3560, bg || "FFFEF0"),
    ],
  });
}

function infoBoxRow(label, lines) {
  return new TableRow({
    children: [
      richCell([
        rp([rb("INFOBOX // " + label)], { before: 60, after: 40 }),
        ...lines.map(l => rp(l)),
      ], 9360, "FFF9C4"),
    ],
  });
}

// ── Inhalt aufbauen ───────────────────────────────────────────────────────────
const ch = [];

// Titel
ch.push(
  h1("Durchblickt! // Leitlinien 2026"),
  sp(80),
  tbl([], [
    ["Binnendifferenzierung",       "Durchgehend Sek\u00a0I/Sek\u00a0II-Varianten in Materialien und Reflexionstiefe"],
    ["Klarer Fokus",                "Eine Leitfrage: Was passiert in meinem K\u00f6rper, wenn ich abends am Bildschirm bin \u2013 und wie kann ich besser einschlafen?"],
    ["Andocken",                    "Baut auf LH1 (Gehirn/Hormone), LH8 (Gesundheit), LH23 (Bildschirmzeit) und LH32 (Stress) auf \u2013 ohne Wiederholung"],
    ["Gesundheitsbezug",            "K\u00f6rperliche (Schlaf-Wach-Rhythmus, Melatonin) und psychische Gesundheit (Stimmung, Konzentration, Stress) in jeder Phase verankert"],
    ["\u201ELanglebigkeit\u201C",   "Biologische Grundlagen (Chronobiologie, Melatonin) statt kurzlebiger App-Tipps"],
    ["Strukturelle Kontinuit\u00e4t","Bew\u00e4hrter 6-Phasen-Aufbau"],
    ["Einheit",                     "90 Minuten"],
  ], [2800, 6560]),
  sp(120),
);

// Grobkonzept-Kopf
ch.push(
  h2("Grobkonzept 4. Handreichung"),
  p([B("Arbeitstitel: "), N("\u201ESchlaf gut! \u2013 Wie digitale Ger\u00e4te unseren Schlaf beeinflussen\u201C")]),
  sp(80),
);

// 1. Kernbotschaften
ch.push(
  h3("1. Kernbotschaften"),
  bullet("Schlaf ist kein Luxus, sondern lebenswichtig \u2013 besonders f\u00fcr Konzentration, Lernen und psychische Gesundheit.", "1."),
  bullet("Blaues Licht beeinflusst den Schlaf-Wach-Rhythmus \u2013 Bildschirme senden Signale ans Gehirn, die uns wach halten.", "2."),
  bullet("Nicht nur das Licht ist das Problem \u2013 auch Inhalte, Aufregung und FOMO st\u00f6ren das Einschlafen.", "3."),
  bullet("Bewusste Abendrituale helfen \u2013 wer Bildschirmpausen vor dem Schlafen einlegt, schläft besser und fühlt sich erholter.", "4."),
  sp(80),
);

// 2. Anknüpfungspunkte
ch.push(
  h3("2. Ankn\u00fcpfungspunkte an bestehende Einheiten"),
  bullet("LH1 Mediennutzung und das Gehirn \u2013 Hormone, Belohnungssystem (wird aktiviert/vertieft: Melatonin)"),
  bullet("LH5 Der Trend zum Zweitbildschirm \u2013 Mediennutzung am Abend, Ablenkung"),
  bullet("LH8 Digital stark: Gesundheit entdecken \u2013 Schlaf als Teil eines gesunden Lebensstils"),
  bullet("LH23 Nutzungsdauer und k\u00f6rperliche Probleme \u2013 Bildschirmzeit, k\u00f6rperliche Auswirkungen"),
  bullet("LH32 Stress ist nicht gleich Stress \u2013 Abendliche Entspannung, Achtsamkeit"),
  sp(80),
);

// 3. KMK
ch.push(
  h3("3. KMK-Kompetenzbereiche (Schwerpunkt: Bereiche 4 und 5)"),
  sp(80),
);

// 4. dGK
ch.push(
  h3("4. Dimensionen digitaler Gesundheitskompetenz"),
  bullet("DGK\u00a02: Verstehen der biologischen Zusammenh\u00e4nge (Blaulicht, Melatonin, Zirkadianer Rhythmus)"),
  bullet("DGK\u00a03: Bewerten der eigenen Abendroutine und Schlafqualit\u00e4t"),
  bullet("DGK\u00a04: Anwenden von Strategien f\u00fcr besseren Schlaf"),
  bullet("DGK\u00a05: Sch\u00fctzen der eigenen Gesundheit durch bewusste Bildschirmzeit am Abend"),
  sp(120),
);

// 5. Ablaufstruktur
ch.push(h3("5. Ablaufstruktur (90 Minuten)"), sp(60));

ch.push(ablaufTable([
  // Phase 1
  phaseRow(
    [
      rp([rb("PHASE 1: Einstieg \u2013 Schlaf und Bildschirm: Was hat das miteinander zu tun? (10 Min.)")], { before: 60, after: 80 }),
      rp([rb("Ziel: "), rn("Alltagsbezug herstellen, Vorwissen aktivieren, Neugier wecken")]),
      rSp(),
      rp("Die Phase beginnt mit einem Bild/Szenario (Folie): Jugendliche:r liegt nachts wach, Handy leuchtet im Dunkeln."),
      rSp(),
      rp("Im Plenum folgt eine Blitzumfrage: \u201EWer hat gestern Abend noch aufs Handy geschaut? Wie war der Schlaf?\u201C \u2013 direkte Anschlussfrage: \u201EWie habt ihr euch heute Morgen gef\u00fchlt \u2013 erholt oder noch m\u00fcde?\u201C"),
      rSp(),
      rp("Impulsfrage: \u201EWas k\u00f6nnte das eine mit dem anderen zu tun haben?\u201C \u2013 Erste Vermutungen werden gesammelt."),
    ],
    [
      rp([rb("Sek\u00a0I: ")], { before: 60, after: 30 }),
      rp("Fokus auf eigenen Erfahrungen und konkreten Alltagsbeispielen."),
      rSp(),
      rp([rb("Sek\u00a0II: ")], { before: 60, after: 30 }),
      rp("Zus\u00e4tzlich Hypothesenbildung zu m\u00f6glichen biologischen Ursachen."),
    ]
  ),
  // Phase 2
  phaseRow(
    [
      rp([rb("PHASE 2: Hinf\u00fchrung \u2013 Was passiert in meinem Gehirn beim Einschlafen? (15 Min.)")], { before: 60, after: 80 }),
      rp([rb("Ziel: "), rn("Wissenschaftliche Grundlagen verstehen, Zusammenh\u00e4nge erschlie\u00dfen")]),
      rSp(),
      rp("Ein Kurzinput (Erkl\u00e4rvideo oder Infografik, ca. 3\u20134 Min.) erl\u00e4utert: Was passiert im Gehirn beim Einschlafen?"),
      rSp(),
      rp("In Partnerarbeit erarbeiten die Lernenden anhand von Arbeitsblatt 1 (Informationskarten) die Grundbegriffe: Blaues Licht, Melatonin, Zirkadianer Rhythmus."),
      rSp(),
      rp("Im Plenum wird gemeinsam ein Schaubild vervollst\u00e4ndigt: Licht \u2192 Gehirn \u2192 Melatonin \u2192 Schlaf."),
    ],
    [
      rp([rb("Sek\u00a0I: ")], { before: 60, after: 30 }),
      rp("Vereinfachtes Schaubild mit drei Grundbegriffen."),
      rSp(),
      rp([rb("Sek\u00a0II: ")], { before: 60, after: 30 }),
      rp("Erweiterte Darstellung mit wissenschaftlichen Details (Suprachiasmatischer Kern, Blaulicht-Wellenl\u00e4nge 450\u2013495\u00a0nm)."),
    ]
  ),
  // Phase 3
  phaseRow(
    [
      rp([rb("PHASE 3: Erarbeitung \u2013 Schlafst\u00f6rer entdecken (25 Min.)")], { before: 60, after: 80 }),
      rp([rb("Ziel: "), rn("Vielf\u00e4ltige Schlafst\u00f6rer erkennen, Selbstreflexion ansto\u00dfen")]),
      rSp(),
      rp([rb("Stationenarbeit "), rn("(Gruppenrotation, je ca. 6 Min.) \u2013 vier Stationen:")]),
      rBullet("Station\u00a0A \u201EBlaues Licht und seine Wirkung\u201C \u2013 Experiment Nachtmodus, Farbtemperatur (AB 2a)"),
      rBullet("Station\u00a0B \u201EEs ist nicht nur das Licht\u201C \u2013 Inhalte, Aufregung, FOMO und soziale Erreichbarkeit als Schlafst\u00f6rer (AB 2b)"),
      rBullet("Station\u00a0C \u201EWarum ist Schlaf so wichtig?\u201C \u2013 K\u00f6rper und Gehirn im Schlaf (AB 2c)"),
      rBullet("Station\u00a0D \u201EMein Schlafprofil\u201C \u2013 Kurzfragebogen zur Selbsteinsch\u00e4tzung (AB 2d)"),
      rSp(),
      rp([rb("Gesundheitsbezug Station\u00a0B: "), rn("Explizit aufnehmen, dass soziale Erwartungen \u2013 st\u00e4ndige Erreichbarkeit in Chatgruppen, Gruppendruck zu n\u00e4chtlicher Online-Aktivit\u00e4t \u2013 den Schlaf als soziale Gesundheitskomponente beeinflussen.")]),
    ],
    [
      rp([rb("Sek\u00a0I: ")], { before: 60, after: 30 }),
      rp("Fokus auf konkrete Alltagsbeispiele und einfache Sprache."),
      rSp(),
      rp([rb("Sek\u00a0II: ")], { before: 60, after: 30 }),
      rp("Zus\u00e4tzlich wissenschaftliche Studien lesen und bewerten."),
    ]
  ),
  // Infobox
  new TableRow({
    children: [
      new TableCell({
        columnSpan: 2,
        children: [
          rp([rb("INFOBOX // Chronotyp und Schulbeginn")], { before: 60, after: 60 }),
          rp([rb("Wusstest du das?  "), rn("Teenager schlafen von Natur aus sp\u00e4ter ein und wachen sp\u00e4ter auf \u2013 das ist biologisch bedingt (Chronotyp). Fr\u00fcher Schulbeginn trifft auf einen entwicklungsbedingt verschobenen Schlafrhythmus \u2013 Schlafmangel ist die Folge. Bildschirmnutzung am Abend verst\u00e4rkt diesen Effekt zus\u00e4tzlich.")]),
          rp([rb("Lehrkraft-Hinweis: "), rn("Dieser Aspekt kann entlasten \u2013 Jugendliche sind nicht \u201Efaul\u201C, sondern biologisch anders getaktet.")]),
        ],
        shading: { type: ShadingType.CLEAR, fill: "FFF9C4" },
        margins: { top: 80, bottom: 80, left: 140, right: 140 },
        width: { size: PAGE_W, type: WidthType.DXA },
        borders: {
          top:    { color: YELLOW, size: 4, style: BorderStyle.SINGLE },
          bottom: { color: YELLOW, size: 4, style: BorderStyle.SINGLE },
          left:   { color: YELLOW, size: 4, style: BorderStyle.SINGLE },
          right:  { color: YELLOW, size: 4, style: BorderStyle.SINGLE },
        },
      }),
    ],
  }),
  // Phase 4
  phaseRow(
    [
      rp([rb("PHASE 4: Vertiefung \u2013 Mein Abendritual entwickeln (20 Min.)")], { before: 60, after: 80 }),
      rp([rb("Ziel: "), rn("Handlungsstrategien entwickeln, pers\u00f6nliche Ver\u00e4nderung planen")]),
      rSp(),
      rp("Impuls: \u201EWas k\u00f6nnte helfen?\u201C \u2013 Brainstorming zu bildschirmfreien Abendritualen in Partnerarbeit (AB 3)."),
      rSp(),
      rp("In Einzelarbeit entwickelt jede:r ein pers\u00f6nliches Abendritual (30\u201360 Min. vor dem Schlafen) auf Arbeitsblatt 4 \u2013 mit konkreten Bausteinen f\u00fcr die eigene Abendroutine."),
      rSp(),
      rp("Im Plenum: Vorstellung der \u201EBildschirmfrei-Challenge\u201C \u2013 eine Woche lang das eigene Schlafverhalten beobachten und im Schlafprotokoll (AB 5) dokumentieren."),
    ],
    [
      rp([rb("Sek\u00a0I: ")], { before: 60, after: 30 }),
      rp("Vorstrukturiertes Protokoll, konkrete Ritualvorschl\u00e4ge zum Ankreuzen."),
      rSp(),
      rp([rb("Sek\u00a0II: ")], { before: 60, after: 30 }),
      rp("Offenes Protokoll, eigene Hypothesen formulieren und testen: \u201EWas ver\u00e4ndert sich, wenn ich 60 Min. vor dem Schlafen keinen Bildschirm nutze?\u201C"),
    ]
  ),
  // Infobox 2
  new TableRow({
    children: [
      new TableCell({
        columnSpan: 2,
        children: [
          rp([rb("INFOBOX // Schlaf-Apps: Hilfreich oder kontraproduktiv?")], { before: 60, after: 60 }),
          rp([rb("\u26a0 Aufgepasst!  "), rn("Schlaf-Apps messen Schlafqualit\u00e4t \u00fcber Bewegung und Ger\u00e4usche \u2013 sie sind kein medizinisches Ger\u00e4t und k\u00f6nnen erheblich von tats\u00e4chlichen Schlafwerten abweichen. Wichtig: Das Handy vor dem Schlafen einzuschalten, um den Schlaf zu \u201Emessen\u201C, widerspricht dem Ziel, Bildschirmzeit am Abend zu reduzieren. Wer seinen Schlaf reflektieren m\u00f6chte, kann das einfach mit einem schriftlichen Tagebuch tun.")]),
        ],
        shading: { type: ShadingType.CLEAR, fill: "FFF9C4" },
        margins: { top: 80, bottom: 80, left: 140, right: 140 },
        width: { size: PAGE_W, type: WidthType.DXA },
        borders: {
          top:    { color: YELLOW, size: 4, style: BorderStyle.SINGLE },
          bottom: { color: YELLOW, size: 4, style: BorderStyle.SINGLE },
          left:   { color: YELLOW, size: 4, style: BorderStyle.SINGLE },
          right:  { color: YELLOW, size: 4, style: BorderStyle.SINGLE },
        },
      }),
    ],
  }),
  // Phase 5
  phaseRow(
    [
      rp([rb("PHASE 5: Transfer \u2013 Mein erster Schritt (10 Min.)")], { before: 60, after: 80 }),
      rp([rb("Ziel: "), rn("Pers\u00f6nlichen Transfer sichern, Selbstverpflichtung f\u00f6rdern")]),
      rSp(),
      rp("Positionierung entlang einer Meinungslinie: \u201EIch werde heute Abend mein Handy fr\u00fcher weglegen.\u201C \u2013 H\u00fcrden und L\u00f6sungsideen werden im Plenum besprochen: Was hindert mich? Was k\u00f6nnte helfen?"),
      rSp(),
      rp("In Einzelarbeit notiert jede:r auf einem Notizzettel: \u201EMein erster Schritt f\u00fcr besseren Schlaf\u201C \u2013 anonym, f\u00fcr sich behalten."),
    ],
    [
      rp([rb("Sek\u00a0I: ")], { before: 60, after: 30 }),
      rp("Fokus auf pers\u00f6nliche Ebene, kleine konkrete Schritte."),
      rSp(),
      rp([rb("Sek\u00a0II: ")], { before: 60, after: 30 }),
      rp("Zus\u00e4tzlich: Diskussion \u00fcber gesellschaftliche Dimension \u2013 Always-on-Kultur, Erreichbarkeitserwartungen, Arbeitswelt."),
    ]
  ),
  // Phase 6
  phaseRow(
    [
      rp([rb("PHASE 6: Reflexion & Follow-up (10 Min. + optional 15 Min. nach 1\u20132 Wochen)")], { before: 60, after: 80 }),
      rp([rb("Ziel: "), rn("Lernprozess reflektieren, Erfahrungen mit dem Schlafprotokoll verankern")]),
      rSp(),
      rp("Abschlussrunde im Plenum: \u201EWas nehme ich heute mit? Was \u00fcberrascht mich?\u201C \u2013 Offene Runde ohne Produkt, Lernr\u00fcckblick."),
      rSp(),
      rp("Hinweis auf die Schlafprotokoll-Auswertung in einer Folgestunde."),
      rSp(),
      rp([rb("Follow-up (ca. 15\u00a0Min., nach 1\u20132 Wochen): "), rn("Auswertung der Schlafprotokolle \u2013 Vergleich \u201EMit Handy ins Bett\u201C vs. \u201EHandyfreie Stunde vorher\u201C. Erfahrungsaustausch zur Bildschirmfrei-Challenge. Optional: Kurze Mentimeter-Umfrage zum Vergleich mit dem Einstieg.")]),
    ],
    [
      rp("", { before: 60, after: 60 }),
    ]
  ),
]));

// Footer
ch.push(
  sp(200),
  new Paragraph({
    children: [new TextRun({ text: "DURCHBLICKT! \u2013 Digital in eine gesunde Zukunft  |  BARMER / Klett MEX", size: 18, font: "Arial", color: "888888", italics: true })],
    alignment: AlignmentType.CENTER, spacing: { before: 120, after: 40 },
  }),
  new Paragraph({
    children: [new TextRun({ text: "Genehmigungsvorlage LH4 \u201ESchlaf gut!\u201C  |  Autor: Michael Kohl  |  M\u00e4rz 2026", size: 18, font: "Arial", color: "888888", italics: true })],
    alignment: AlignmentType.CENTER, spacing: { before: 0, after: 0 },
  }),
);

// ── Dokument & Export ─────────────────────────────────────────────────────────
const doc = new Document({
  styles: { default: { document: { run: { font: "Arial", size: 22, color: DARK } } } },
  sections: [{
    properties: {
      page: {
        size: { width: 11906, height: 16838 },
        margin: { top: 1134, bottom: 1134, left: 1134, right: 1134 },
      },
    },
    children: ch,
  }],
});

const outPath = path.join(__dirname, "../output/LH4_Grobkonzept_Schlaf_2026-03_wrf_MK.docx");
Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync(outPath, buf);
  console.log("\u2705 DOCX erstellt: " + outPath);
}).catch(e => console.error("\u274C Fehler:", e));

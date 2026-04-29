// LH4 Re-Einreichung nach BARMER-Rückmeldung (Stand: 29.04.2026)
// Quelle: lh4/grobkonzept/LH4_Grobkonzept_eingereicht.md (mit eingearbeitetem Feedback F1–F4)

const {
  Document, Packer, Paragraph, Table, TableRow, TableCell,
  TextRun, AlignmentType, WidthType, BorderStyle,
  ShadingType, TableLayoutType, HeadingLevel
} = require("docx");
const fs = require("fs");
const path = require("path");

const OQ = "„";
const CQ = "“";
const YELLOW = "FFD700";
const GREEN  = "4CAF50";
const RED    = "C0392B";
const DARK   = "333333";

function h1(text) {
  return new Paragraph({
    children: [new TextRun({ text, bold: true, size: 36, font: "Arial", color: DARK })],
    spacing: { before: 0, after: 120 },
  });
}
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
function NEU(text) { return new TextRun({ text: " " + text, size: 18, font: "Arial", color: RED, italics: true }); }
function bullet(text, pre) {
  const runs = [];
  if (pre) runs.push(new TextRun({ text: pre + " ", bold: true, size: 22, font: "Arial" }));
  runs.push(new TextRun({ text, size: 22, font: "Arial" }));
  return new Paragraph({ children: runs, bullet: { level: 0 }, spacing: { before: 40, after: 40 } });
}
function bulletNeu(text, pre, neuLabel) {
  const runs = [];
  if (pre) runs.push(new TextRun({ text: pre + " ", bold: true, size: 22, font: "Arial" }));
  runs.push(new TextRun({ text, size: 22, font: "Arial" }));
  runs.push(new TextRun({ text: " " + neuLabel, size: 18, font: "Arial", color: RED, italics: true }));
  return new Paragraph({ children: runs, bullet: { level: 0 }, spacing: { before: 40, after: 40 } });
}
function sp() { return new Paragraph({ text: "", spacing: { before: 60, after: 60 } }); }

function mkCell(content, bg, isBold, width) {
  let paragraphs;
  if (typeof content === "string") {
    paragraphs = [new Paragraph({
      children: [new TextRun({ text: content, bold: !!isBold, size: 20, font: "Arial", color: DARK })],
      spacing: { before: 60, after: 60 }
    })];
  } else if (Array.isArray(content) && content[0] instanceof Paragraph) {
    paragraphs = content;
  } else {
    paragraphs = [new Paragraph({ children: content, spacing: { before: 60, after: 60 } })];
  }
  const c = {
    children: paragraphs,
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
    shading: { type: ShadingType.CLEAR, fill: color === GREEN ? "E8F5E9" : color === RED ? "FDEBEA" : "FFF9C4" },
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

function phaseCell(parts, width) {
  const para = new Paragraph({
    children: parts.flatMap(part => {
      if (part.type === "b") return [B(part.text)];
      if (part.type === "neu") return [NEU(part.text)];
      return [N(part.text)];
    }),
    spacing: { before: 60, after: 60 }
  });
  const c = {
    children: [para],
    shading: { type: ShadingType.CLEAR, fill: "FFFFFF" },
    margins: { top: 80, bottom: 80, left: 120, right: 120 },
  };
  if (width) c.width = { size: width, type: WidthType.DXA };
  return new TableCell(c);
}

// ── Inhalt ────────────────────────────────────────────────────────────────────
const ch = [];

// Titel
ch.push(
  h1("DURCHBLICKT! – Lehrkräftehandreichung 4"),
  new Paragraph({ children: [new TextRun({ text: OQ + "Schlaf gut! – Wie digitale Geräte unseren Schlaf beeinflussen" + CQ, bold: true, size: 28, font: "Arial", color: DARK })], spacing: { before: 0, after: 80 } }),
  new Paragraph({ children: [new TextRun({ text: "Re-Einreichung nach BARMER-Rückmeldung  |  Stand: 29.04.2026", size: 22, font: "Arial", color: "555555", italics: true })], spacing: { before: 0, after: 240 } }),
  tbl([], [
    ["Dokument",     "Grobkonzept Re-Einreichung (nach Phase-4b-Rückmeldung)"],
    ["Autor",        "Michael Kohl"],
    ["Verlag",       "Klett MEX"],
    ["Auftraggeber", "BARMER"],
    ["Zielgruppe",   "Lehrkräfte Sekundarstufe I + II (Grundschul-Erweiterung Phase 4 + 5)"],
    ["Dauer",        "90 Minuten (Doppelstunde)"],
  ], [2600, 6760]),
  sp()
);

// Änderungs-Log
ch.push(
  h2("Änderungs-Log – BARMER-Feedback (Stand: 29.04.2026)"),
  p("Eingearbeitet aus den roten Anmerkungen unter Abschnitt 5 „Ablaufstruktur“ der Genehmigungsvorlage. Quelle: BARMER (Kürzel wrf)."),
  sp(),
  tbl(
    ["Nr.", "Quelle", "Feedback-Punkt", "Umsetzung", "Status"],
    [
      ["F1", "BARMER (wrf)", "7Mind@School-Einschlaf-/Meditationsübungen einbinden",            "Abschnitt 2: 7Mind@School als BARMER-Programmpartner ergänzt; Phase 4 (Fallbeispiel Jonas) als konkretes Element verlinkt; Phase 5 mit exemplarischer 7Mind@School-Einschlaf-/Atemübung (3–5 Min.) als Vorschlag für das bildschirmfreie Abendritual",  "✅"],
      ["F2", "BARMER (wrf)", "Vom Ist- in den Kann-Modus",                                       "KB 2, KB 3, KB 4 + Phasen-Texte 2/3 in „kann/können“-Form überführt; einzelne Stellen siehe Hinweis",                                                                                                                                                       "✅"],
      ["F3", "BARMER (wrf)", "Aktuelle Studien (Cain & Gradisar 2024)",                          "Phase 3 Sek-II-Block: Studienverweis „Aktiv vs. passiv“ als Differenzierung der FOMO-/Inhalte-Wirkung",                                                                                                                                                "✅"],
      ["F4", "BARMER (wrf)", "Phase 2: Schlaftypen + Wochentag-/Wochenend-Rhythmus",             "Phase 2 Sek-II-Block ergänzt: Chronotypen (Eule/Lerche) + Social Jetlag als Brücke zu Phase 3",                                                                                                                                                       "✅"],
    ],
    [500, 1300, 2700, 4360, 500]
  ),
  sp(),
  box(YELLOW, "Stellen für F2 (Ist→Kann):", [
    "KB 2 („beeinflusst“ → „kann beeinflussen“; „halten“ → „können … halten“)",
    "KB 3 („stören“ → „können stören“)",
    "KB 4 („schläft besser und fühlt sich erholter“ → „kann besser schlafen und sich erholter fühlen“)",
    "Phase-3-Station-B („hält wach“ → „kann wachhalten“); Phase 7 Tafelbild („halten wach“ → „können wachhalten“)",
    "KB 1 bleibt unangetastet (normative Setzung „Schlaf ist Gesundheit“)."
  ]),
  sp()
);

// Leitlinien-Check
ch.push(
  h2("Leitlinien 2026 – Erfüllung"),
  tbl(
    ["Kriterium", "Umsetzung"],
    [
      ["Binnendifferenzierung",     "Durchgehend Sek I / Sek II-Varianten in allen Phasen"],
      ["Klarer Fokus",              "Eine Leitfrage: Was passiert in meinem Körper und Gehirn, wenn ich abends am Bildschirm bin – und wie kann ich besser einschlafen?"],
      ["Andocken",                  "Baut auf LH1, LH5, LH8, LH13, LH15, LH23, LH32 auf – ohne inhaltliche Dopplung; 7Mind@School als BARMER-Programmpartner ergänzt"],
      ["Gesundheitsbezug",          "Physische, psychische und soziale Gesundheit in jeder Phase verankert"],
      ["Langlebigkeit",             "Biologische Grundlagen und Bedürfnispsychologie statt kurzlebiger App-Tipps"],
      ["Strukturelle Kontinuität",  "Bewährter 7-Phasen-Aufbau"],
      ["Einheit",                   "90 Minuten"],
    ],
    [3000, 6360]
  ),
  sp()
);

// Arbeitstitel
ch.push(
  h2("Arbeitstitel"),
  box(YELLOW, "", [OQ + "Schlaf gut! – Wie digitale Geräte unseren Schlaf beeinflussen" + CQ]),
  sp()
);

// 1. Kernbotschaften (Ist→Kann eingearbeitet)
ch.push(
  h2("1. Kernbotschaften"),
  bullet("Schlaf ist kein Luxus, sondern lebenswichtig – besonders für Konzentration, Lernen und psychische Gesundheit.", "1."),
  bullet("Blaues Licht kann unseren Schlaf-Wach-Rhythmus beeinflussen – Bildschirme können Signale ans Gehirn senden, die uns wach halten.", "2."),
  bullet("Nicht nur das Licht ist das Problem – auch Inhalte, Erregung und FOMO können das Einschlafen stören.", "3."),
  bullet("Bildschirmfreie Rituale können helfen – wer bewusst Pausen vor dem Schlafengehen einlegt, kann besser schlafen und sich erholter fühlen.", "4."),
  bullet("Selbstbeobachtung schafft Bewusstsein – wer seinen eigenen Schlaf protokolliert, erkennt Muster und Handlungsmöglichkeiten.", "5."),
  sp()
);

// 2. Anknüpfungspunkte
ch.push(
  h2("2. Anknüpfungspunkte an bestehende Einheiten"),
  bullet("LH1 Mediennutzung und das Gehirn – Hormone, Belohnungssystem (wird vorausgesetzt / kurz aktiviert: Melatonin)"),
  bullet("LH8 Digital stark: Gesundheit entdecken – Schlaf als Teil eines gesunden Lebensstils"),
  bullet("[LH13 Dos and Don'ts Handy – Smartphone-Nutzung, bewusste Entscheidungen]"),
  bullet("LH15 Gesund bleiben im digitalen Alltag – Digitales Stressmanagement, Selbstorganisation"),
  bullet("LH23 Nutzungsdauer und körperliche Probleme – Bildschirmzeit, körperliche Auswirkungen"),
  bullet("LH32 Stress ist nicht gleich Stress – Abendliche Entspannung, Achtsamkeit"),
  bulletNeu("7Mind@School (BARMER-Programmpartner) – Einschlaf- und Meditationsübungen als konkretes Element bildschirmfreier Abendrituale (Bezug in Phase 5; exemplarisch in Phase 4 verlinkt)", null, "[NEU F1]"),
  sp()
);

// 3. Gesundheitsbezug
ch.push(
  h2("3. Gesundheitsbezug"),
  h3("Physische Gesundheit"),
  bullet("Schlaf-Wach-Rhythmus (zirkadianer Rhythmus) und Melatoninproduktion durch Blaulicht"),
  bullet("Regeneration von Körper und Gehirn im Schlaf"),
  bullet("Immunsystem, Wachstum und Stoffwechsel bei Schlafmangel"),
  h3("Psychische Gesundheit"),
  bullet("Zusammenhang Schlafmangel und Stimmung / emotionale Regulation"),
  bullet("Konzentration und Lernfähigkeit"),
  bullet("Schlafmangel als Risikofaktor für Angst und Depression"),
  h3("Soziale Gesundheit"),
  bullet("FOMO (Fear of Missing Out) und soziale Medien vor dem Schlafen"),
  bullet("Auswirkungen von Übermüdung auf soziale Interaktionen"),
  bullet("Familiäre Konflikte um Mediennutzung am Abend"),
  h3("Medienkompetenz als Schutzfaktor"),
  bullet("Verstehen biologischer Zusammenhänge (blaues Licht, Melatonin, zirkadianer Rhythmus)"),
  bullet("Bewusste Entscheidungen über Bildschirmzeit am Abend"),
  bullet("Erkennen eigener Muster durch Selbstbeobachtung"),
  bullet("Entwickeln individueller Abendrituale"),
  sp()
);

// 4. KMK-Kompetenzbereiche
ch.push(
  h2("4. KMK-Kompetenzbereiche"),
  p([B("Schwerpunkt: "), N("Bereiche 4, 5 und 6")]),
  sp()
);

// 5. Dimensionen digitaler Gesundheitskompetenz
ch.push(
  h2("5. Dimensionen digitaler Gesundheitskompetenz"),
  bullet("DGK 2: Verstehen der biologischen Zusammenhänge (Blaulicht, Melatonin, zirkadianer Rhythmus)"),
  bullet("DGK 3: Kritisches Bewerten der eigenen Abendroutine und Schlafqualität"),
  bullet("DGK 4: Gesunde Abendroutinen ohne Bildschirme entwickeln und umsetzen"),
  bullet("DGK 5: Schlafqualität als Gesundheitsressource aktiv schützen"),
  sp()
);

// 6. Ablaufstruktur
ch.push(
  h2("6. Ablaufstruktur (90 Minuten)"),
  p([B("Video-Idee: "), N("Kurzclip – Jugendliche:r liegt nachts wach, Handy leuchtet im Dunkeln. Direkte Frage: „Was könnte das eine mit dem anderen zu tun haben?“ Das Video zeigt den Moment des Erkennens: Bildschirm, Gehirn, Schlaflosigkeit – ohne zu moralisieren, mit Neugier als Einstiegshaltung.")]),
  sp()
);

// Phasen-Tabelle
const phaseHeaderWidths = [3680, 5680];
ch.push(new Table({
  layout: TableLayoutType.FIXED,
  width: { size: 9360, type: WidthType.DXA },
  rows: [
    new TableRow({ tableHeader: true, children: [
      mkCell("Phase / Inhalt", YELLOW, true, phaseHeaderWidths[0]),
      mkCell("Sek I / Sek II", YELLOW, true, phaseHeaderWidths[1]),
    ]}),
    // Phase 1
    new TableRow({ children: [
      phaseCell([
        { type: "b", text: "Phase 1: Einstieg – Alltagsbezug & Vorwissen (10 Min.) " },
        { type: "b", text: "Ziel: " },
        { type: "n", text: "Alltagsbezug herstellen, Vorwissen aktivieren, Neugier wecken. Blitzlicht im Plenum: „Wer hat gestern gut geschlafen? Wer hatte gestern Abend noch Handy oder Tablet dabei?“ – Meldungen werden kommentarlos sichtbar gemacht (Handzeichen oder Klebepunkt an der Tafel). Anschließend Impulsfrage: „Was könnte das eine mit dem anderen zu tun haben?“ – spontane Antworten, keine Bewertung. Optional: Bild/Szenario projizieren – Jugendliche:r liegt nachts wach, Handy leuchtet im Dunkeln. " },
        { type: "b", text: "Gesundheitsbezug: " },
        { type: "n", text: "Schlafqualität als unmittelbar erfahrbare Gesundheitsdimension – persönliche Relevanz von Anfang an sichtbar machen." }
      ], phaseHeaderWidths[0]),
      phaseCell([
        { type: "n", text: "In " }, { type: "b", text: "Sek I" }, { type: "n", text: " Fokus auf eigene Erfahrungen und Alltagsbeispiele; intuitives Wissen aktivieren. In " }, { type: "b", text: "Sek II" }, { type: "n", text: " zusätzlich Hypothesenbildung zu möglichen biologischen Ursachen." }
      ], phaseHeaderWidths[1]),
    ]}),
    // Phase 2 – mit F4
    new TableRow({ children: [
      phaseCell([
        { type: "b", text: "Phase 2: Hinführung – Was passiert im Gehirn beim Einschlafen? (15 Min.) " },
        { type: "b", text: "Ziel: " },
        { type: "n", text: "Wissenschaftliche Grundlagen verstehen: Melatonin, zirkadianer Rhythmus, blaues Licht. Kurzinput mit Infografik oder Erklärvideo im Plenum: „Was passiert im Gehirn beim Einschlafen?“ In Partnerarbeit: Arbeitsblatt 1 – Infokarten zu den drei Grundbegriffen lesen, Schaubild vervollständigen (Licht → Gehirn → Melatonin → Schlaf). Sicherung im Plenum: Ergebnisse zusammenführen, Schaubild gemeinsam vervollständigen." }
      ], phaseHeaderWidths[0]),
      phaseCell([
        { type: "n", text: "In " }, { type: "b", text: "Sek I" }, { type: "n", text: " vereinfachte Darstellung mit drei Grundbegriffen (Melatonin = Schlafhormon, blaues Licht = Signal „Tag“, zirkadianer Rhythmus = innere Uhr). In " }, { type: "b", text: "Sek II" }, { type: "n", text: " erweiterte Darstellung mit wissenschaftlichen Details (Lichtspektrum, Wellenlänge, suprachiasmatischer Kern, aktuelle Studienlage). " },
        { type: "b", text: "Zusatz Sek II: " },
        { type: "n", text: "Chronotypen (Eule/Lerche) und Social Jetlag – warum sich der Schlafrhythmus zwischen Wochentagen und Wochenende oft verschiebt (frühe Schulzeiten vs. biologische Phasenverschiebung in der Pubertät). Brücke zu Phase 3: Schlaf wirkt multifaktoriell" },
        { type: "neu", text: "[NEU F4]" },
        { type: "n", text: "." }
      ], phaseHeaderWidths[1]),
    ]}),
    // Phase 3 – mit F2 + F3
    new TableRow({ children: [
      phaseCell([
        { type: "b", text: "Phase 3: Erarbeitung I – Nicht nur das Licht ist das Problem (15 Min.) " },
        { type: "b", text: "Ziel: " },
        { type: "n", text: "Vielfältige Einflussfaktoren auf den Schlaf erkennen; über blaues Licht hinausdenken. Stationenarbeit in 3er-/4er-Gruppen mit drei Stationen (Rotation, je ca. 4 Min.): " },
        { type: "b", text: "Station A – Blaues Licht und seine Wirkung: " },
        { type: "n", text: "Erkundung des Nachtmodus/Blaulichtfilters; Reflexionsfrage: „Reicht der Nachtmodus als Lösung?“ (Arbeitsblatt 2a). " },
        { type: "b", text: "Station B – Inhalte, Aufregung und FOMO: " },
        { type: "n", text: "Fallbeispiele zu aufwühlenden vs. beruhigenden Abendmedien; Reflexion: Warum kann soziale Interaktion wachhalten, auch ohne helles Licht? (Arbeitsblatt 2b). " },
        { type: "b", text: "Station C – Warum ist Schlaf so wichtig? " },
        { type: "n", text: "Infografik: Was passiert im Körper und Gehirn während des Schlafs? Kurzauftrag: drei überraschende Fakten markieren und erklären (Arbeitsblatt 2c). Sicherung im Plenum: Kurzes Blitzlicht – welche Station war am überraschendsten? " },
        { type: "b", text: "Gesundheitsbezug: " },
        { type: "n", text: "Schlafmangel als multifaktorielles Problem – nicht nur Technik, sondern auch Inhalte, FOMO und Gewohnheiten können die Schlafqualität beeinflussen." }
      ], phaseHeaderWidths[0]),
      phaseCell([
        { type: "n", text: "In " }, { type: "b", text: "Sek I" }, { type: "n", text: " Fokus auf konkrete Alltagsbeispiele und einfache Sprache; Erkennen von Mustern steht im Vordergrund. In " }, { type: "b", text: "Sek II" }, { type: "n", text: " zusätzlich: wissenschaftliche Studien auswerten, statistische Daten zu Jugendschlaf einbeziehen. " },
        { type: "b", text: "Studienbezug Cain & Gradisar (2024): " },
        { type: "n", text: "„Nicht jede Bildschirmzeit ist gleich“ – passives Scrollen wirkt schlafstörender als aktive Kommunikation mit Freundinnen und Freunden. Diskussion in Station B: Welche Konsequenz hat das für mein eigenes Abendverhalten?" },
        { type: "neu", text: "[NEU F3]" },
      ], phaseHeaderWidths[1]),
    ]}),
    // Phase 4 – mit F1 (Jonas)
    new TableRow({ children: [
      phaseCell([
        { type: "b", text: "Phase 4: Erarbeitung II – Fallbeispiele: Wer schläft wie und warum? (20 Min.) " },
        { type: "b", text: "Ziel: " },
        { type: "n", text: "Zusammenhänge zwischen Mediennutzung und Schlafqualität konkret erleben; Muster erkennen. In 3er-/4er-Gruppen analysieren die Lernenden je ein Fallbeispiel: „Was macht die Person vor dem Schlafen? Wie ist ihre Schlafqualität? Warum? Was könnte sie ändern?“ Vier Fallbeispiele: " },
        { type: "b", text: "Lena (16): " },
        { type: "n", text: "Scrollt bis 23 Uhr durch Instagram → schläft schlecht ein, ist morgens müde. " },
        { type: "b", text: "Malik (14): " },
        { type: "n", text: "Liest ab 21 Uhr ein Buch (Print) → schläft gut. " },
        { type: "b", text: "Sarah (17): " },
        { type: "n", text: "Schaut Netflix bis spät, Smartphone neben dem Bett → mehrfach durch Benachrichtigungen aufgewacht. " },
        { type: "b", text: "Jonas (13): " },
        { type: "n", text: "Festes Abendritual ohne Bildschirm (Musik, kurze Entspannungsübung – z. B. eine kurze 7Mind@School-Übung" },
        { type: "neu", text: "[NEU F1]" },
        { type: "n", text: ") → schläft tief und erholsam." }
      ], phaseHeaderWidths[0]),
      phaseCell([
        { type: "n", text: "In " }, { type: "b", text: "Sek I" }, { type: "n", text: " Fokus auf Erkennen und Benennen von Mustern; klare Kausalität; einfache Sprache. In " }, { type: "b", text: "Sek II" }, { type: "n", text: " zusätzlich: Wirkungsmechanismen, gesellschaftliche Dimension (Always-on-Kultur, Plattform-Verantwortung), Studienlage einbeziehen. " },
        { type: "b", text: "Grundschule (Kl. 3–4): " },
        { type: "n", text: "Statt Fallbeispielanalyse arbeiten die Kinder mit PS AB 1: Plakat mit Satzanfängen rund um „Warum braucht mein Körper Schlaf?“ Vier Impulse („Wenn ich schlafe, kann mein Körper …“ etc.). Einzelarbeit + Sitzkreis. Abschluss: gemeinsames „Schlaf-hilft-mir“-Plakat." }
      ], phaseHeaderWidths[1]),
    ]}),
    // Phase 5 – mit F1 (7Mind exemplarisch)
    new TableRow({ children: [
      phaseCell([
        { type: "b", text: "Phase 5: Vertiefung – Mein Abendritual & Experiment planen (15 Min.) " },
        { type: "b", text: "Ziel: " },
        { type: "n", text: "Handlungsstrategien entwickeln, persönliches Abendritual entwerfen, Schlafexperiment vorbereiten. Impulsfrage im Plenum mit Think-Pair-Share: „Was könnte helfen? Und was macht es schwer, das umzusetzen?“ – Ideen für bildschirmfreie Abendrituale sammeln. " },
        { type: "b", text: "Exemplarisch wird eine kurze 7Mind@School-Einschlaf-/Atemübung (ca. 3–5 Min.) als ein konkreter Vorschlag für das Abendritual vorgestellt – nicht als Pflicht, sondern als ein niedrigschwelliges Beispiel unter mehreren" },
        { type: "neu", text: "[NEU F1]" },
        { type: "n", text: ". In Partnerarbeit: AB 4 – Jede:r entwirft ein eigenes bildschirmfreies Abendritual (30–60 Min. vor dem Schlafen). Im Plenum: Einführung des Schlafprotokolls (AB 5) als Herzstück. Dokumentiert ab heute für eine Woche: Einschlafzeit, Aufwachzeit, Schlafdauer, Bildschirmzeit, subjektive Schlafqualität (1–5)." }
      ], phaseHeaderWidths[0]),
      phaseCell([
        { type: "n", text: "In " }, { type: "b", text: "Sek I" }, { type: "n", text: " vorstrukturiertes Protokoll mit Ankreuzoptionen; konkrete Ritualvorschläge zum Auswählen. In " }, { type: "b", text: "Sek II" }, { type: "n", text: " offenes Protokoll; eigene Hypothesen formulieren und testen; Reflexion über innere Barrieren und SMART-Ziele. " },
        { type: "b", text: "Grundschule (Kl. 3–4): " },
        { type: "n", text: "Statt offenem Ritualentwurf arbeiten die Kinder mit PS AB 2: Sortierspiel in 2er-Gruppen mit Bildkarten von Abendaktivitäten (Buch lesen, Handy schauen, Musik hören, Videospiel, kuscheln, Gute-Nacht-Geschichte) – „Macht eher müde“ / „Hält eher wach“. Präsentation, behutsame Diskussion. Jedes Kind wählt am Ende eine Idee für sein Abendritual." }
      ], phaseHeaderWidths[1]),
    ]}),
    // Phase 6
    new TableRow({ children: [
      phaseCell([
        { type: "b", text: "Phase 6: Transfer – Mein erster Schritt (10 Min.) " },
        { type: "b", text: "Ziel: " },
        { type: "n", text: "Persönlichen Transfer sichern, Selbstverpflichtung fördern. Meinungslinie im Plenum: „Ich werde heute Abend mein Handy früher weglegen.“ Lernende positionieren sich; Begründungen werden gehört, Positionswechsel ist erwünscht. In Einzelarbeit notiert jede:r anonym: Mein Ziel für diese Woche / Was könnte schwierig werden / Was hilft mir dabei? Die Notizen bleiben privat. Optional: Klassen-Challenge „Bildschirmfreie Stunde vor dem Schlafen“ – Auswertung im Follow-up." }
      ], phaseHeaderWidths[0]),
      phaseCell([
        { type: "n", text: "In " }, { type: "b", text: "Sek I" }, { type: "n", text: " Fokus auf persönliche Ebene und kleine Schritte; konkrete externe Stützen (Timer, Absprache mit Eltern). In " }, { type: "b", text: "Sek II" }, { type: "n", text: " zusätzlich: Reflexion über gesellschaftliche Verantwortung, Diskussion über Regulierung (Always-on-Kultur, Plattformdesign)." }
      ], phaseHeaderWidths[1]),
    ]}),
    // Phase 7 – Tafelbild mit angepasster Botschaft (F2)
    new TableRow({ children: [
      phaseCell([
        { type: "b", text: "Phase 7: Reflexion – Abschlussrunde (5 Min.) " },
        { type: "b", text: "Ziel: " },
        { type: "n", text: "Rückblick auf den Lernprozess – kein Produkt, kein Handlungsdruck. Blitzlicht-Abschlussrunde im Plenum: „Was nimmst du aus dieser Stunde mit? Was überrascht dich? Was möchtest du ausprobieren?“ Kernbotschaften als Tafelbild (optional Aushang/Handout): „Schlaf ist Gesundheit – kein Luxus!“, „Blaues Licht und aufwühlende Inhalte können wachhalten“, „Kleine Rituale – große Wirkung“, „Du hast die Wahl – und du kannst es testen!“ Offene Fragen werden gesammelt – ohne Auflösung, als Impuls zum Weiterdenken." }
      ], phaseHeaderWidths[0]),
      phaseCell([
        { type: "n", text: "Einheitlich für Sek I und Sek II. Niedrigschwellig, freiwillig, kein Bewertungsdruck." }
      ], phaseHeaderWidths[1]),
    ]}),
    // Follow-up
    new TableRow({ children: [
      phaseCell([
        { type: "b", text: "Fakultativ nach 1–2 Wochen: Follow-up (ca. 15 Min.) " },
        { type: "b", text: "Ziel: " },
        { type: "n", text: "Schlafprotokolle auswerten, Kernbotschaften reaktivieren, Erkenntnisse sichern. Im Plenum: Freiwillige Wortmeldungen – „Was hat funktioniert? Was nicht? Was war überraschend?“ Auswertung der Schlafprotokolle: Wer möchte, teilt seinen Befund. Kernfrage: „Habt ihr einen Zusammenhang zwischen Bildschirmzeit und Schlafqualität gefunden?“ Optional: Erneute Einstiegsumfrage. Die vier Kernbotschaften vom Tafelbild werden kurz reaktiviert – als Anker." }
      ], phaseHeaderWidths[0]),
      phaseCell([
        { type: "n", text: "In " }, { type: "b", text: "Sek I" }, { type: "n", text: " Fokus auf persönliche Erfahrungen; freiwillig, ohne Bewertung. In " }, { type: "b", text: "Sek II" }, { type: "n", text: " zusätzlich: Mini-Auswertung der Protokolldaten; Hypothesen überprüfen; gesellschaftliche Dimension vertiefen." }
      ], phaseHeaderWidths[1]),
    ]}),
  ]
}));
ch.push(sp());
ch.push(p([B("Phasenzeiten gesamt: "), N("10 + 15 + 15 + 20 + 15 + 10 + 5 = 90 Min.")]));
ch.push(sp());

// Footer
ch.push(
  new Paragraph({ children: [new TextRun({ text: "DURCHBLICKT! – Digital in eine gesunde Zukunft  |  BARMER / Klett MEX", size: 18, font: "Arial", color: "888888", italics: true })], alignment: AlignmentType.CENTER, spacing: { before: 240, after: 40 } }),
  new Paragraph({ children: [new TextRun({ text: "Re-Einreichung LH4  |  Autor: Michael Kohl  |  29.04.2026", size: 18, font: "Arial", color: "888888", italics: true })], alignment: AlignmentType.CENTER, spacing: { before: 0, after: 0 } })
);

// ── Dokument ──────────────────────────────────────────────────────────────────
const doc = new Document({
  styles: { default: { document: { run: { font: "Arial", size: 22, color: DARK } } } },
  sections: [{
    properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 1134, bottom: 1134, left: 1134, right: 1134 } } },
    children: ch,
  }],
});

const outPath = path.join(__dirname, "../output/LH4_Grobkonzept_Re-Einreichung_2026-04-29.docx");
Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync(outPath, buf);
  console.log("✅ DOCX erstellt: " + outPath);
});

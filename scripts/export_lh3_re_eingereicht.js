// LH3 Re-Einreichung nach BARMER-Rückmeldung (Stand: 29.04.2026)
// Quelle: lh3/grobkonzept/LH3_Grobkonzept_eingereicht.md (mit eingearbeitetem Feedback F1–F5)

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
function sp() { return new Paragraph({ text: "", spacing: { before: 60, after: 60 } }); }

function mkCell(content, bg, isBold, width) {
  // content can be a string or an array of TextRuns
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

// Phase cell: combines main description (left col) with NEU markers
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
  h1("DURCHBLICKT! – Lehrkräftehandreichung 3"),
  new Paragraph({ children: [new TextRun({ text: OQ + "Gesundheitsmythen im Netz – Was stimmt wirklich?" + CQ, bold: true, size: 28, font: "Arial", color: DARK })], spacing: { before: 0, after: 80 } }),
  new Paragraph({ children: [new TextRun({ text: "Re-Einreichung nach BARMER-Rückmeldung  |  Stand: 29.04.2026", size: 22, font: "Arial", color: "555555", italics: true })], spacing: { before: 0, after: 240 } }),
  tbl([], [
    ["Dokument",     "Grobkonzept Re-Einreichung (nach Phase-4b-Rückmeldung)"],
    ["Autor",        "Michael Kohl"],
    ["Verlag",       "Klett MEX"],
    ["Auftraggeber", "BARMER"],
    ["Zielgruppe",   "Lehrkräfte Sekundarstufe I + II (Grundschul-Erweiterung Phase 6a)"],
    ["Dauer",        "90 Minuten (Doppelstunde)"],
  ], [2600, 6760]),
  sp()
);

// Änderungs-Log
ch.push(
  h2("Änderungs-Log – BARMER-Feedback (Stand: 29.04.2026)"),
  p("Eingearbeitet aus den roten Anmerkungen unter Abschnitt 5 „Ablaufstruktur“ in der Genehmigungsvorlage. Quelle: BARMER (Kürzel wrf)."),
  sp(),
  tbl(
    ["Nr.", "Quelle", "Feedback-Punkt", "Umsetzung", "Status"],
    [
      ["F1", "BARMER (wrf)", "DURCHBLICKT!-QuellenChecker einbinden",                "Phase 3: Tool-Demo im Plenum + optionale Tool-Anwendung in der Gruppenarbeit",                                  "✅"],
      ["F2", "BARMER (wrf)", "Exkurs „Gesundheitsmythen und KI“",          "Phase 2, Sek-II-Block: KI-generierte Falschinfos, Deepfakes, ChatGPT ohne Quellen",                              "✅"],
      ["F3", "BARMER (wrf)", "Liste vertrauenswürdiger Gesundheitsquellen",     "Phase 3 Mini-Infobox + neuer Abschnitt 7 als Lehrkraft-Referenz",                                                "✅"],
      ["F4", "BARMER (wrf)", "Illusory Truth Effect (Phase 2, Sek II)",              "In Mechanismen-Liste der Sek-II-Spalte ergänzt, mit Kurzdefinition",                                          "✅"],
      ["F5", "BARMER (wrf)", "Mythen-Labor (von passiv zu aktiv)",                   "Phase 6 Transfer als Sek-II-Variante (Sek I bleibt beim Quiz). Bewusste Umverortung von Phase 2 nach Phase 6",  "✅"],
    ],
    [500, 1300, 2700, 4360, 500]
  ),
  sp(),
  box(YELLOW, "Hinweis zur Umverortung F5:", [
    "Im DOCX als Phase-2-Anregung notiert; inhaltlich („eigenen viralen Post erstellen“) jedoch eine produktive Transfer-Aktivität.",
    "Verortung in Phase 6 wahrt das Prinzip Transfer ≠ Reflexion und vermeidet eine zweite produktive Aktivität in der Hinführung."
  ]),
  sp()
);

// Leitlinien-Check
ch.push(
  h2("Leitlinien 2026 – Erfüllung"),
  tbl(
    ["Kriterium", "Umsetzung"],
    [
      ["Binnendifferenzierung", "Durchgehend Sek I / Sek II-Varianten in allen Phasen (Phase 6 zusätzlich Quiz vs. Mythen-Labor)"],
      ["Klarer Fokus",          "Eine Leitfrage: Wie erkenne ich verlässliche Gesundheitsinformationen im Netz – und warum ist das für meine Gesundheit wichtig?"],
      ["Andocken",              "Baut auf LH6, LH19, LH8, LH7, LH21, LH14 auf – ohne inhaltliche Dopplung"],
      ["Gesundheitsbezug",      "Körperliche und mentale Gesundheit in jeder Phase verankert"],
      ["Langlebigkeit",         "Faktencheck-Methoden statt plattformspezifischer Details; Beispiele jederzeit austauschbar"],
      ["Strukturelle Kontinuität", "Bewährter 7-Phasen-Aufbau"],
      ["Einheit",               "90 Minuten"],
    ],
    [3000, 6360]
  ),
  sp()
);

// Arbeitstitel
ch.push(
  h2("Arbeitstitel"),
  box(YELLOW, "", [OQ + "Gesundheitsmythen im Netz – Was stimmt wirklich?" + CQ]),
  sp()
);

// 1. Kernbotschaften
ch.push(
  h2("1. Kernbotschaften"),
  bullet("Nicht alles, was viral geht, ist wahr – Gesundheitsmythen verbreiten sich online besonders schnell, weil sie einfache Lösungen versprechen.", "1."),
  bullet("Körperbilder und Gesundheitsideale sind oft konstruiert – Social Media zeigt unrealistische, teilweise gesundheitsschädliche Standards.", "2."),
  bullet("Wissenschaftliche Quellen erkennen schützt – Wer Fakten von Mythen unterscheiden kann, trifft bessere Gesundheitsentscheidungen.", "3."),
  bullet("Kritisches Denken ist Gesundheitsschutz – Medienkompetenz befähigt zu informierten Entscheidungen über den eigenen Körper und schützt vor gefährlichen Trends.", "4."),
  sp()
);

// 2. Anknüpfungspunkte
ch.push(
  h2("2. Anknüpfungspunkte an bestehende Einheiten"),
  bullet("LH6 Desinformation im Netz – Methoden zur Faktenprüfung (werden vorausgesetzt / kurz aktiviert)"),
  bullet("LH19 Körperbilder im Internet – Unrealistische Körperideale, Bildmanipulation"),
  bullet("LH8 Digital stark: Gesundheit entdecken – Ernährung, Bewegung, Schlaf als Grundthemen"),
  bullet("LH7 Die Welt der Influencerinnen und Influencer – Werbung vs. Information, kommerzielle Interessen"),
  bullet("LH21 Medien und Prävention – Gesundheitsinformationen finden und bewerten"),
  bullet("LH14 Challenges im Netz – Gefährliche Trends, Gruppendruck"),
  sp()
);

// 3. Gesundheitsbezug
ch.push(
  h2("3. Gesundheitsbezug"),
  h3("Körperliche Gesundheit"),
  bullet("Gefährliche Gesundheitstrends: extreme Diäten, fragwürdige Fitness-Challenges, „Detox“-Produkte"),
  bullet("Risiken durch Falschinformationen zu Ernährung, Nahrungsergänzung, Medikamenten"),
  bullet("Unrealistische Körperbilder als Motivation für ungesunde Verhaltensweisen (Essstörungen, Übertraining)"),
  h3("Mentale Gesundheit"),
  bullet("Druck durch idealisierte Körperbilder und Gesundheitsstandards"),
  bullet("Verunsicherung und Stress durch widersprüchliche Gesundheitsinformationen"),
  bullet("Selbstwertprobleme durch Vergleich mit „perfekten“ Online-Körpern"),
  bullet("Schuldgefühle, wenn man „Gesundheitstrends“ nicht folgt"),
  h3("Medienkompetenz als Schutzfaktor"),
  bullet("Wissenschaftliche Quellen von Meinungen unterscheiden"),
  bullet("Kommerzielle Interessen hinter Gesundheitsbehauptungen erkennen"),
  bullet("Selbstbestimmte, informierte Entscheidungen über die eigene Gesundheit treffen"),
  sp()
);

// 4. KMK-Kompetenzbereiche
ch.push(
  h2("4. KMK-Kompetenzbereiche"),
  p([B("Schwerpunkt: "), N("Bereiche 1, 4 und 6")]),
  sp()
);

// 5. Dimensionen digitaler Gesundheitskompetenz
ch.push(
  h2("5. Dimensionen digitaler Gesundheitskompetenz"),
  p([B("Schwerpunkt: "), N("Dimensionen 2, 3, 4, 5, 7")]),
  bullet("DGK 2: Verstehen, wie Gesundheitsmythen entstehen und sich verbreiten"),
  bullet("DGK 3: Kritisches Bewerten von Gesundheitsinformationen und Quellen"),
  bullet("DGK 4: Faktencheck-Methoden anwenden, verlässliche Quellen nutzen"),
  bullet("DGK 5: Gesundheit durch informierte Entscheidungen schützen"),
  bullet("DGK 7: Eigene wissenschaftsbasierte Quiz-Inhalte erstellen"),
  sp()
);

// 6. Ablaufstruktur
ch.push(
  h2("6. Ablaufstruktur (90 Minuten)"),
  p([B("Video-Idee: "), N("Kurzclip – eine Gesundheitsbehauptung (z. B. „Detox-Tee entgiftet deinen Körper“) geht viral. Gegenschnitt: Eine Ernährungswissenschaftlerin oder ein Ernährungswissenschaftler widerlegt die Aussage in 30 Sekunden. Einstiegsfrage: „Wem glaubst du – und warum?“")]),
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
      mkCell("Sek I / Sek II", YELLOW, true, phaseHeaderWidths[1]),
    ]}),
    // Phase 1
    new TableRow({ children: [
      phaseCell([
        { type: "b", text: "Phase 1: Einstieg – „Glaubst du das?“ (10 Min.) " },
        { type: "b", text: "Ziel: " },
        { type: "n", text: "Vorwissen aktivieren, persönliche Relevanz herstellen, Neugier wecken. Bildcollage: 8 Gesundheitsbehauptungen aus Social Media (Mix aus Fakt/Fake) im Plenum – spontane Einschätzung per „Daumen hoch/runter“. Anschließend Think-Pair-Share: „Welche Gesundheitstipps habt ihr online gesehen?“ Brückenfrage zur Überleitung: „Welche dieser Behauptungen könnte eure Gesundheitsentscheidungen beeinflussen?“" }
      ], phaseHeaderWidths[0]),
      phaseCell([
        { type: "n", text: "In " }, { type: "b", text: "Sek I" }, { type: "n", text: " Fokus auf TikTok, Instagram, YouTube (Fitness, Beauty, „Life Hacks“). In " }, { type: "b", text: "Sek II" }, { type: "n", text: " zusätzlich Gesundheitsblogs, Influencer-Marketing, pseudowissenschaftliche Studien." }
      ], phaseHeaderWidths[1]),
    ]}),
    // Phase 2
    new TableRow({ children: [
      phaseCell([
        { type: "b", text: "Phase 2: Hinführung – Warum verbreiten sich Mythen? (15 Min.) " },
        { type: "b", text: "Ziel: " },
        { type: "n", text: "Mechanismen der Verbreitung verstehen, Verbindung zu Körperbildern und psychischer Gesundheit herstellen. Kurzvideo/Infografik: „Warum verbreiten sich Gesundheitsmythen so schnell?“ im Plenum. In 2er-Gruppen Gründe sammeln (AB 1): Algorithmen, Emotionen, vereinfachte Botschaften, Körperideale. Sicherung im Plenum: „Welche Rolle spielen Körperbilder?“ – Hinweis: Widersprüchliche Gesundheitsinfos erzeugen Verunsicherung, Stress und Schamgefühle. " },
        { type: "b", text: "Grundschule (Kl. 3–4): " },
        { type: "n", text: "Statt Kurzvideo/Infografik: Detektiv-Geschichte im Sitzkreis. Lehrkraft erzählt: Lena sieht in einem Video, dass ein bestimmtes Getränk nie krank macht – die Geschichte wandert weiter, niemand prüft sie. Ziel: Stille-Post-Prinzip kindgerecht." }
      ], phaseHeaderWidths[0]),
      phaseCell([
        { type: "n", text: "In " }, { type: "b", text: "Sek I" }, { type: "n", text: " konkrete Beispiele (Before-After-Bilder, „Wundermittel“, Challenges). In " }, { type: "b", text: "Sek II" }, { type: "n", text: " zusätzlich psychologische Mechanismen: Bestätigungsfehler, Dunning-Kruger-Effekt, Sozialer Beweis, " }, { type: "b", text: "Illusory Truth Effect" }, { type: "n", text: " (Wiederholung erzeugt subjektiv Wahrheit – je öfter eine Falschinformation wiederholt wird, desto wahrer erscheint sie)" },
        { type: "neu", text: "[NEU F4]" },
        { type: "n", text: ". " }, { type: "b", text: "Kurz-Exkurs „Gesundheitsmythen und KI“: " }, { type: "n", text: "KI-generierte Bilder/Videos, Deepfakes von Ärztinnen, Ärzten oder Prominenten, ChatGPT-Antworten ohne Quellenangabe und automatisiert produzierte „Health-Hacks“-Clips verstärken Mythen massiv – plausibel klingend, aber ungeprüft" },
        { type: "neu", text: "[NEU F2]" },
        { type: "n", text: "." }
      ], phaseHeaderWidths[1]),
    ]}),
    // Phase 3
    new TableRow({ children: [
      phaseCell([
        { type: "b", text: "Phase 3: Erarbeitung I – Faktencheck-Werkstatt (25 Min.) " },
        { type: "b", text: "Ziel: " },
        { type: "n", text: "Praktische Methoden zur Überprüfung von Gesundheitsbehauptungen erlernen und anwenden. QQQQ-Methode (Quelle / Qualität / Querbezüge / Qualitätssiegel) im Plenum anhand von AB 2. " },
        { type: "b", text: "Anschließend Demo des DURCHBLICKT!-QuellenCheckers (durch-blickt.de): " },
        { type: "n", text: "Gemeinsam wird eine Beispielbehauptung mit dem Tool geprüft – Schritt-für-Schritt-Logik und QQQQ-Bezug parallel sichtbar" },
        { type: "neu", text: "[NEU F1]" },
        { type: "n", text: ". In 4er-Gruppen überprüfen die Lernenden 4 Gesundheitsbehauptungen (AB 3a–d). " },
        { type: "b", text: "Optional: " },
        { type: "n", text: "SuS prüfen 1–2 ihrer Behauptungen zusätzlich mit dem QuellenChecker und vergleichen Tool-Ergebnis und eigene QQQQ-Einschätzung" },
        { type: "neu", text: "[NEU F1]" },
        { type: "n", text: ". Kurzpräsentation im Plenum (je 3 Min.). " },
        { type: "b", text: "Gesundheitsbezug: " },
        { type: "n", text: "Unkritisch übernommene Gesundheitstipps können zu schädlichen Entscheidungen führen – die QQQQ-Methode schützt vor gesundheitlichen Fehlentscheidungen. " },
        { type: "b", text: "Infobox „Wo finde ich verlässliche Gesundheitsinfos?“: " },
        { type: "n", text: "Vertrauenswürdige Anlaufstellen u. a.: gesundheitsinformation.de (IQWiG), rki.de, bzga.de, barmer.de/gesundheit. Vollständige Liste s. Abschnitt 7" },
        { type: "neu", text: "[NEU F3]" },
        { type: "n", text: ". " },
        { type: "b", text: "Grundschule (Kl. 3–4): " },
        { type: "n", text: "Statt QQQQ-Methode: Detektiv-Arbeitsblatt mit drei kindgerechten Fragen: 1. „Wer sagt das?“ 2. „Warum sagt die Person das?“ 3. „Fragt noch jemand anders?“" }
      ], phaseHeaderWidths[0]),
      phaseCell([
        { type: "n", text: "In " }, { type: "b", text: "Sek I" }, { type: "n", text: " vereinfachte QQQQ-Checkliste, klare Mythen vs. Fakten, vorgegebene Quellen. In " }, { type: "b", text: "Sek II" }, { type: "n", text: " zusätzlich: Studienqualität bewerten, Interessenkonflikte erkennen, eigene Recherche." }
      ], phaseHeaderWidths[1]),
    ]}),
    // Phase 4
    new TableRow({ children: [
      phaseCell([
        { type: "b", text: "Phase 4: Erarbeitung II – Körperbilder & Gesundheitsmythen (15 Min.) " },
        { type: "b", text: "Ziel: " },
        { type: "n", text: "Verbindung zwischen konstruierten Körperbildern und Gesundheitsmythen erkennen. In 4er-Gruppen analysieren die Lernenden 3 fiktive Influencer-Profile (Fitness / Ernährung / Beauty) anhand von AB 4. Leitfragen: „Welches Körperbild wird vermittelt? Welche Mythen? Wer profitiert?“" }
      ], phaseHeaderWidths[0]),
      phaseCell([
        { type: "n", text: "In " }, { type: "b", text: "Sek I" }, { type: "n", text: " Beschreiben und Erkennen von Unrealistischem, persönliche Einschätzung. In " }, { type: "b", text: "Sek II" }, { type: "n", text: " zusätzlich: Geschäftsmodelle analysieren, gesellschaftliche Auswirkungen, Bodyshaming, Essstörungen." }
      ], phaseHeaderWidths[1]),
    ]}),
    // Phase 5
    new TableRow({ children: [
      phaseCell([
        { type: "b", text: "Phase 5: Vertiefung – Wer steckt dahinter? (10 Min.) " },
        { type: "b", text: "Ziel: " },
        { type: "n", text: "Kommerzielle und algorithmische Interessen hinter Gesundheitsmythen erkennen. Impulsfrage im Plenum: „Wem nützt es, wenn Gesundheitsmythen geglaubt werden?“ Diskussion im Plenum: „Macht es einen Unterschied, ob jemand bezahlt wurde?“ " },
        { type: "b", text: "Gesundheitsbezug: " },
        { type: "n", text: "Kommerzielle Gesundheitsmythen erzeugen gezielt Unsicherheit über den eigenen Körper – das Erkennen dieser Mechanismen schützt vor Druck, Schamgefühlen und unrealistischen Körperidealen." }
      ], phaseHeaderWidths[0]),
      phaseCell([
        { type: "n", text: "In " }, { type: "b", text: "Sek I" }, { type: "n", text: " Werbung erkennen, einfache Interessen benennen. In " }, { type: "b", text: "Sek II" }, { type: "n", text: " zusätzlich: EU-Regulierung, Transparenzpflichten, gesellschaftliche Verantwortung von Plattformen." }
      ], phaseHeaderWidths[1]),
    ]}),
    // Phase 6
    new TableRow({ children: [
      phaseCell([
        { type: "b", text: "Phase 6: Transfer (10 Min.) " },
        { type: "b", text: "Ziel: " },
        { type: "n", text: "Gelerntes anwenden – von passiver Mythen-Erkennung zu aktivem Mechanismen-Verständnis. " },
        { type: "b", text: "Sek I – „Wahr oder Fake?“-Quiz: " },
        { type: "n", text: "In 2er-Gruppen erstellen die Lernenden je 2–3 Quiz-Fragen mit Auflösung und kurzer Begründung (AB 5). Die besten Fragen werden im Plenum gespielt. " },
        { type: "b", text: "Sek II – Mythen-Labor" },
        { type: "neu", text: "[NEU F5]" },
        { type: "b", text: ": " },
        { type: "n", text: "In 2er-Gruppen entwickeln die Lernenden einen eigenen fiktiven viralen Gesundheits-Post (Behauptung + Bild-/Captionidee + Hashtag) inkl. Mythen-Auflösung auf der Rückseite: Welche QQQQ-Schwächen wurden gezielt eingebaut (z. B. fehlende Quelle, emotionale Sprache, scheinbares Qualitätssiegel, Cherry Picking)? Anschließend kurze Galerie-Runde im Plenum (3–4 ausgewählte Posts). " },
        { type: "n", text: "Persönliches Faktencheck-Versprechen auf Notizzettel – einheitlich für beide Niveaus." }
      ], phaseHeaderWidths[0]),
      phaseCell([
        { type: "n", text: "In " }, { type: "b", text: "Sek I" }, { type: "n", text: " Multiple-Choice-Quiz mit klaren Antworten; Fokus: Wahr oder Fake? In " }, { type: "b", text: "Sek II" }, { type: "n", text: " Mythen-Labor: produktive Anwendung der QQQQ-Kriterien durch bewusstes Konstruieren eines glaubwürdig wirkenden Mythos und Reflexion über die eingebauten Manipulationsmechanismen" },
        { type: "neu", text: "[NEU F5]" },
        { type: "n", text: "." }
      ], phaseHeaderWidths[1]),
    ]}),
    // Phase 7
    new TableRow({ children: [
      phaseCell([
        { type: "b", text: "Phase 7: Reflexion (5 Min.) " },
        { type: "b", text: "Ziel: " },
        { type: "n", text: "Rückblick auf den Lernprozess – kein Produkt, kein Handlungsdruck. Blitzlicht-Abschlussrunde im Plenum: „Was nehme ich heute mit? Was hat mich überrascht? Was beschäftigt mich noch?“ Offene Fragen werden gesammelt – ohne Auflösung. Optional: Kurze anonyme Selbstreflexion: „Welchen Gesundheitstipp werde ich das nächste Mal hinterfragen?“" }
      ], phaseHeaderWidths[0]),
      phaseCell([
        { type: "n", text: "Einheitlich für Sek I und Sek II. Niedrigschwellig, freiwillig, kein Bewertungsdruck." }
      ], phaseHeaderWidths[1]),
    ]}),
  ]
}));
ch.push(sp());
ch.push(p([B("Phasenzeiten gesamt: "), N("10 + 15 + 25 + 15 + 10 + 10 + 5 = 90 Min.")]));
ch.push(sp());

// 7. Vertrauenswürdige Quellen
ch.push(
  h2("7. Vertrauenswürdige Gesundheitsquellen (Lehrkraft-Referenz)"),
  p([NEU("[NEU F3]")]),
  p("Kuratierte Liste valider Anlaufstellen für Faktenchecks und vertiefende Recherche. Sie dient der eigenen Vorbereitung der Lehrkraft und kann den Lernenden in Phase 3 als Aushang/Handout zur Verfügung gestellt werden – ersetzt aber nicht die Anwendung der QQQQ-Methode."),
  sp(),
  tbl(
    ["Quelle", "URL", "Profil"],
    [
      ["IQWiG / gesundheitsinformation.de",                "gesundheitsinformation.de",                  "Unabhängige, evidenzbasierte Gesundheitsinformationen für die Allgemeinbevölkerung"],
      ["Robert Koch-Institut (RKI)",                       "rki.de",                                     "Bundesinstitut für Infektions- und nichtübertragbare Krankheiten"],
      ["Bundeszentrale für gesundheitliche Aufklärung", "bzga.de",                                   "Prävention, Aufklärung, Jugendgesundheit"],
      ["BARMER Gesundheitsportal",                         "barmer.de/gesundheit",                       "Krankenkassen-Gesundheitsinfos, Themenseiten"],
      ["Stiftung Gesundheitswissen",                       "stiftung-gesundheitswissen.de",              "Patientenorientierte, qualitätsgeprüfte Inhalte"],
      ["MedlinePlus / Cochrane (engl.)",                   "medlineplus.gov / cochrane.org",             "International, systematische Übersichtsarbeiten"],
      ["DURCHBLICKT! QuellenChecker",                      "durch-blickt.de",                            "Interaktives Tool zur Quellenprüfung (in Phase 3 eingebunden)"],
    ],
    [3000, 2360, 4000]
  ),
  sp(),
  // Footer
  new Paragraph({ children: [new TextRun({ text: "DURCHBLICKT! – Digital in eine gesunde Zukunft  |  BARMER / Klett MEX", size: 18, font: "Arial", color: "888888", italics: true })], alignment: AlignmentType.CENTER, spacing: { before: 240, after: 40 } }),
  new Paragraph({ children: [new TextRun({ text: "Re-Einreichung LH3  |  Autor: Michael Kohl  |  29.04.2026", size: 18, font: "Arial", color: "888888", italics: true })], alignment: AlignmentType.CENTER, spacing: { before: 0, after: 0 } })
);

// ── Dokument ──────────────────────────────────────────────────────────────────
const doc = new Document({
  styles: { default: { document: { run: { font: "Arial", size: 22, color: DARK } } } },
  sections: [{
    properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 1134, bottom: 1134, left: 1134, right: 1134 } } },
    children: ch,
  }],
});

const outPath = path.join(__dirname, "../output/LH3_Grobkonzept_Re-Einreichung_2026-04-29.docx");
Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync(outPath, buf);
  console.log("✅ DOCX erstellt: " + outPath);
});

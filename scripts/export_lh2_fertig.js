const {
  Document, Packer, Paragraph, Table, TableRow, TableCell,
  TextRun, AlignmentType, WidthType, BorderStyle,
  ShadingType, TableLayoutType,
} = require("docx");
const fs   = require("fs");
const path = require("path");

const OQ     = "\u201E";  // „
const CQ     = "\u201C";  // "
const YELLOW = "FFD700";
const GREEN  = "4CAF50";
const BLUE   = "1E88E5";
const DARK   = "333333";
const GREY   = "666666";


// ── Helpers ───────────────────────────────────────────────────────────────────

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

function h4(text) {
  return new Paragraph({
    children: [new TextRun({ text, bold: true, size: 22, font: "Arial", color: DARK })],
    spacing: { before: 160, after: 60 },
  });
}

function p(runs, spacing) {
  if (typeof runs === "string")
    runs = [new TextRun({ text: runs, size: 22, font: "Arial", color: DARK })];
  return new Paragraph({ children: runs, spacing: spacing || { before: 60, after: 60 } });
}

function B(text) { return new TextRun({ text, bold: true,    size: 22, font: "Arial", color: DARK }); }
function I(text) { return new TextRun({ text, italics: true, size: 22, font: "Arial", color: DARK }); }
function N(text) { return new TextRun({ text,                size: 22, font: "Arial", color: DARK }); }

function bullet(text, level) {
  return new Paragraph({
    children: [new TextRun({ text, size: 22, font: "Arial", color: DARK })],
    bullet: { level: level || 0 },
    spacing: { before: 40, after: 40 },
  });
}

function bulletRuns(runs, level) {
  return new Paragraph({
    children: runs,
    bullet: { level: level || 0 },
    spacing: { before: 40, after: 40 },
  });
}

function numbered(num, text) {
  return new Paragraph({
    children: [new TextRun({ text: num + ".  " + text, size: 22, font: "Arial", color: DARK })],
    spacing: { before: 60, after: 60 },
    indent: { left: 360 },
  });
}

function sp() { return new Paragraph({ text: "", spacing: { before: 40, after: 40 } }); }

// ── Table helpers ─────────────────────────────────────────────────────────────

function mkCell(content, bg, bold, width) {
  let children;
  if (Array.isArray(content)) {
    children = content.map(line =>
      new Paragraph({
        children: [new TextRun({ text: String(line), bold: !!bold, size: 20, font: "Arial", color: DARK })],
        spacing: { before: 40, after: 40 },
      })
    );
  } else {
    children = [new Paragraph({
      children: [new TextRun({ text: String(content), bold: !!bold, size: 20, font: "Arial", color: DARK })],
      spacing: { before: 60, after: 60 },
    })];
  }
  const cfg = {
    children,
    shading: { type: ShadingType.CLEAR, fill: bg || "FFFFFF" },
    margins: { top: 80, bottom: 80, left: 120, right: 120 },
  };
  if (width) cfg.width = { size: width, type: WidthType.DXA };
  return new TableCell(cfg);
}

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
      children: row.map((v, i) =>
        mkCell(v, ri % 2 === 0 ? "FFFFFF" : "FFFBEA", false, widths ? widths[i] : null)
      ),
    }));
  });
  return new Table({
    rows: trows,
    layout: TableLayoutType.FIXED,
    width: { size: 9360, type: WidthType.DXA },
  });
}

function box(color, label, lines) {
  const runs = label ? [new TextRun({ text: label + "  ", bold: true, size: 22, font: "Arial" })] : [];
  lines.forEach((l, i) => {
    if (i > 0) runs.push(new TextRun({ text: "", break: 1 }));
    runs.push(new TextRun({ text: l, size: 22, font: "Arial" }));
  });
  let fill = "FFF9C4";
  if (color === GREEN) fill = "E8F5E9";
  if (color === BLUE)  fill = "E3F2FD";
  return new Paragraph({
    children: runs,
    shading: { type: ShadingType.CLEAR, fill },
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

// Ablauf-Tabelle: Zeit | Element | Sozialform | Material | Durchf\u00fchrung
const AW = [700, 1760, 1300, 1700, 3900];

function ablaufTbl(rows) {
  return tbl(["Zeit", "Element", "Sozialform", "Material", "Durchf\u00fchrung"], rows, AW);
}

// ── Content ────────────────────────────────────────────────────────────────────────────────

const ch = [];

// ── Titelblock ────────────────────────────────────────────────────────────────────────────────

ch.push(
  new Paragraph({
    children: [new TextRun({ text: "DURCHBLICKT! – Digital in eine gesunde Zukunft", bold: true, size: 44, font: "Arial", color: DARK })],
    spacing: { before: 0, after: 80 },
  }),
  new Paragraph({
    children: [new TextRun({ text: "Lehrkräftehandreichung 2", bold: true, size: 32, font: "Arial", color: DARK })],
    spacing: { before: 0, after: 60 },
  }),
  new Paragraph({
    children: [new TextRun({ text: "„Wer bin ich online?“", bold: true, size: 32, font: "Arial", color: DARK })],
    spacing: { before: 0, after: 60 },
  }),
  new Paragraph({
    children: [new TextRun({ text: "Digitale Identität zwischen Selbstausdruck und Selbstinszenierung", italics: true, size: 26, font: "Arial", color: GREY })],
    spacing: { before: 0, after: 240 },
  }),
  tbl([], [
    ["Thema",      "Digitale Identität: Selbstausdruck vs. Selbstinszenierung"],
    ["Leitfrage",  "Wer bin ich online – und warum zeige ich, was ich zeige?"],
    ["Zielgruppe", "Sek I (Kl. 7–10) und Sek II (Kl. 11–13), mit GS-Erweiterung (Kl. 3–4)"],
    ["Umfang",     "90 Minuten (6 Phasen) + optionales Follow-up (ca. 15 Min.)"],
    ["Anknüpfung", "LH1 (KI & Bedürfnisse), LH29 (Selbstwahrnehmung), LH19 (Körperbilder), LH14 (Challenges), LH7 (Influencer:innen)"],
    ["Verlag",     "Klett MEX  |  Auftraggeber: BARMER  |  Autor: Michael Kohl"],
    ["Stand",      "April 2026"],
  ], [2600, 6760]),
  sp()
);

// ── Phasenübersicht ────────────────────────────────────────────────────────────────────────────────

ch.push(
  h2("Phasenübersicht"),
  tbl(
    ["Phase", "Bezeichnung", "Zeit", "Methode", "Material"],
    [
      ["1", "Einstieg & Aktivierung",          "15 Min.", "Impuls → Plenum → Einzelarbeit → Plenum", "Video-Idee (Bildcollage), Karten/Padlet"],
      ["2", "Hinführung & Grundlagen",         "20 Min.", "Kurzimpuls → Partnerarbeit → Sicherung", "Infografik „5 Bausteine“, AB 1"],
      ["3", "Vertiefung I: Profile analysieren","20 Min.", "Partnerarbeit → Plenum",               "AB 2 (fiktive Profile)"],
      ["4", "Vertiefung II: Soziale Vergleiche","20 Min.", "Gruppenarbeit → Kurzvorstellung",       "AB 3a / 3b / 3c"],
      ["5", "Transfer",                         "10 Min.", "Partnerarbeit → Meinungslinie → Einzelarbeit", "AB 5"],
      ["6", "Reflexion",                        "5 Min.",  "Blitzlicht Plenum",                        "AB 4 (optional)"],
      ["–", "Follow-up (optional)",        "15 Min.", "Einzelarbeit → Plenum",                "–"],
    ],
    [400, 2200, 700, 2860, 3200]
  ),
  sp()
);

// ── Lernziele ────────────────────────────────────────────────────────────────────────────────

ch.push(
  h2("Lernziele"),
  p("Nach dieser Lerneinheit können die Schüler:innen:"),
  numbered(1, "Erklären, dass digitale Identität konstruiert und kuratiert ist – niemand zeigt sich online vollständig."),
  numbered(2, "Analysieren, welche Gestaltungsentscheidungen hinter Online-Profilen stecken und welche psychologischen Bedürfnisse sie erfüllen."),
  numbered(3, "Erkennen, wie soziale Vergleiche mit kuratierten Profilen Selbstbild und Wohlbefinden beeinflussen."),
  numbered(4, "Unterscheiden zwischen Selbstausdruck (authentisch) und Selbstinszenierung (strategisch) – und den fließenden Übergängen."),
  numbered(5, "Entwickeln eigener Strategien für eine bewusste, gesunde Online-Präsenz."),
  sp()
);

// ── Voraussetzungen ────────────────────────────────────────────────────────────────────────────────

ch.push(
  h2("Voraussetzungen & Anknüpfungspunkte"),
  p("Die Lerneinheit baut auf folgenden Vorkenntnissen auf:"),
  bulletRuns([B("LH1 – KI & menschliche Bedürfnisse:"), N(" Grundverständnis von Datenschutz und Identitätsbegriff (wird in Phase 1 kurz aktiviert, nicht wiederholt).")]),
  bulletRuns([B("LH29 – Selbstwahrnehmung:"), N(" Grundbegriffe Selbstbild, Selbstwert (werden vorausgesetzt).")]),
  bulletRuns([B("LH19 – Körperbilder im Internet:"), N(" Bildmanipulation, unrealistische Darstellungen (werden als bekannt vorausgesetzt; direkter Bezug in Phase 4).")]),
  bulletRuns([B("LH14 – Challenges:"), N(" Algorithmen, Social-Media-Mechanismen, Gruppendruck (werden vorausgesetzt; Bezug in Phase 2).")]),
  bulletRuns([B("LH7 – Die Welt der Influencer:innen:"), N(" Inszenierungsstrategien, Authentizitätsfragen (werden vorausgesetzt; Bezug in Phase 3).")]),
  sp()
);

// ── Hinweise für die Lehrkraft ────────────────────────────────────────────────────────────────────────────────

ch.push(
  h2("Hinweise für die Lehrkraft"),
  box(YELLOW, "Sensibilität:", [
    "Das Thema berührt das Selbstbild der Lernenden direkt. Viele haben persönliche Erfahrungen mit sozialen",
    "Vergleichen, Perfektionsdruck oder Selbstwertproblemen. Ziel ist Reflexion – nicht Bewertung von Online-Verhalten.",
    "Wichtig: Nicht moralisieren. Die Kernbotschaft ist nicht „Social Media ist schlecht“, sondern",
    "„Wie gehe ich bewusst damit um?“",
  ]),
  sp(),
  box(YELLOW, "Anonymität wahren:", [
    "Bei der Kartenabfrage (Phase 1) und dem Selbstreflexionsbogen (AB 4, Phase 6) gilt: Alles bleibt anonym",
    "und muss nicht geteilt werden. Darauf explizit hinweisen – vor allem bei Sek I.",
  ]),
  sp(),
  box(YELLOW, "Differenzierung:", [
    "Sek I und Sek II arbeiten mit denselben Materialien. Die Differenzierung erfolgt durch gezielte",
    "Impulsfragen und Zusatzaufgaben (siehe jeweilige Phase).",
  ]),
  sp(),
  box(BLUE, "↔ Erweiterung Grundschule (Kl. 3–4):", [
    "Die GS-Erweiterungen in Phase 1 und Phase 3 ersetzen die entsprechenden Sek-Aufgaben vollständig.",
    "Grundschulkinder benötigen kein Vorwissen über Social Media.",
  ]),
  sp(),
  box(YELLOW, "Technische Vorbereitung:", [
    "Für die Kartenabfrage (Phase 1) empfiehlt sich ein digitales Tool (Padlet, Mentimeter) oder physische Karten.",
    "Für Phase 3 werden die fiktiven Profile (AB 2) als Ausdrucke oder via Beamer benötigt.",
  ]),
  sp()
);

// ── Phase 1 ────────────────────────────────────────────────────────────────────────────────

ch.push(h2("Phase 1: Einstieg & Aktivierung (15 Min.)"));

ch.push(
  h3("Ziel"),
  p("Thema emotional aktivieren, Vorwissen sichtbar machen, Bewusstsein für die Konstruiertheit digitaler Identität wecken"),
  sp()
);

ch.push(
  h3("Ablauf"),
  ablaufTbl([
      ["3 Min.", "Startervideo – Bildcollage (Idee, noch zu produzieren)", "Plenum", "Video-Idee: Bildcollage – 4 Profile derselben Person", "Lehrkraft zeigt die Bildcollage oder beschreibt das Konzept: Vier Profile derselben Person im direkten Vergleich. Die Frage „Wer ist die echte Person?“ wird eingeblendet, ohne sofortige Antwort zu liefern. Kein Kommentar, keine Wertung – nur schauen lassen."],
      ["5 Min.", "Impulsgespräch", "Plenum", "–", "Lehrkraft stellt die Fragen im offenen Austausch: „Wer ist die echte Person? Welchem Profil würdest du am ehesten folgen? Was zeigen wir online – was zeigen wir nicht?“ Spontane Wortmeldungen, keine Bewertung. Lehrkraft notiert Stichworte an der Tafel."],
      ["5 Min.", "Anonyme Kartenabfrage / Padlet", "Einzelarbeit → Plenum", "Karten oder Padlet/Mentimeter", "Schüler:innen notieren anonym: „Wo präsentiere ich mich online?“ (z. B. Instagram, TikTok, Snapchat, Gaming-Profile, WhatsApp-Status). Karten werden geclustert oder Padlet-Antworten gemeinsam gelesen."],
      ["2 Min.", "Überleitung", "Plenum", "–", "Lehrkraft leitet über: „All diese Profile zeigen etwas von euch – aber nie alles. Heute fragen wir: Was zeigen wir bewusst, was unbewusst? Und was macht das mit uns?“"],
  ]),
  sp()
);

ch.push(
  h3("Differenzierung Sek I / Sek II"),
  h4("Sek I (Kl. 7–10)"),
  bullet("Fokus auf eigene, vertraute Plattformen (Instagram, TikTok, Snapchat, WhatsApp-Status)"),
  bullet("Impulsfragen in einfacher, konkreter Sprache: „Was postest du? Was würdest du nie posten?“"),
  bullet("Kartenabfrage: Plattformnamen genügen als Antwort"),
  bullet("Noch keine Fachbegriffe einführen"),
  h4("Sek II (Kl. 11–13)"),
  bullet("Zusätzliche Plattformen: LinkedIn, Xing, persönliche Websites, berufliche Kontexte"),
  bullet("Impulsfragen erweitern: „Welches Profil würdest du deiner zukünftigen Chefin zeigen? Welches deinen Mitschüler:innen?“"),
  bullet("Begriffe Selbstdarstellung und Impression Management (Goffman) können bereits im Einstieg fallen gelassen werden"),
  bullet("Kartenabfrage: Plattform + kurze Funktionsbeschreibung"),
  sp()
);

ch.push(
  box(BLUE, "↔ Erweiterung Grundschule (Klasse 3–4)", [
    "Anpassung des Einstiegs für 8–10-Jährige:",
    "",
    "Statt der Bildcollage mit vier Social-Media-Profilen wird ein gezeichnetes",
    "Bilderpaar eingesetzt: dasselbe Kind beim Matschen vs. Geburtstagsfoto mit festlicher Kleidung.",
    "",
    "Impulsfrage im Plenum: „Welches Bild zeigst du deiner Klasse? Welches deiner Oma? Warum?“",
    "",
    "Methodische Hinweise:",
    "• Bilderpaar wird an der Tafel oder per Beamer gezeigt – groß, klar erkennbar",
    "• Kinder äußern sich spontan im Plenum, Lehrkraft notiert Stichworte",
    "• Anschlussfrage: „Gibt es noch andere Situationen, wo du dich anders zeigst als sonst?“",
    "• Keine anonyme Kartenabfrage – kurze mündliche Runde im Sitzkreis",
    "• Überleitung: „Heute schauen wir, warum das so ist – und was das mit uns macht.“",
    "",
    "Materialhinweis: Einfaches Schwarz-Weiß-Bilderpaar (A4, projizierbar). Zeitumfang: ca. 15 Minuten.",
  ]),
  sp()
);

ch.push(
  h3("Didaktischer Kommentar"),
  p([B("Warum dieser Einstieg? "), N("Die Bildcollage schafft unmittelbare kognitive Dissonanz: Die Frage „Wer ist die echte Person?“ lässt sich nicht einfach beantworten – und das ist didaktisch gewollt.")]),
  p([B("Methodische Begründung:")]),
  bullet("Bildimpuls ohne Ton: Ermöglicht individuelles Wahrnehmen vor der Beeinflussung durch Peers"),
  bullet("Offene Impulsfragen: Keine „richtige“ Antwort vorgegeben, divergentes Denken wird gefördert"),
  bullet("Anonyme Kartenabfrage: Senkt die Hemmschwelle – gerade bei sensiblen Themen"),
  p([B("Fallstricke:")]),
  bullet("Nicht werten: Wer sich intensiv auf Social Media präsentiert, macht nichts falsch"),
  bullet("Keine Pathologisierung: Selbstdarstellung ist ein normales menschliches Bedürfnis"),
  sp()
);

ch.push(
  h3("Erwartete Schüler:innen-Antworten"),
  h4("Zur Frage „Wer ist die echte Person?“"),
  p([I("Typische Antworten Sek I: ")]),
  bullet("„Alle irgendwie, je nach Situation“"),
  bullet("„Das private Profil, da ist man authentischer“"),
  bullet("„Man weiß es gar nicht – vielleicht zeigt keines die echte Person“"),
  p([I("Typische Antworten Sek II: ")]),
  bullet("„Identität ist immer kontextabhängig – es gibt nicht die eine echte Person“"),
  bullet("„Impression Management: wir alle spielen verschiedene Rollen“"),
  sp()
);

// ── Phase 2 ────────────────────────────────────────────────────────────────────────────────

ch.push(h2("Phase 2: Hinführung & Grundlagen (20 Min.)"));

ch.push(
  h3("Ziel"),
  p("Mechanismen der Online-Selbstdarstellung verstehen, die 5 Bausteine digitaler Identität kennenlernen, Gestaltungsentscheidungen als psychologische Entscheidungen erkennen"),
  sp()
);

ch.push(
  h3("Ablauf"),
  ablaufTbl([
      ["5 Min.", "Kurzimpuls: Die „5 Bausteine der digitalen Identität“", "Plenum", "Infografik (projiziert oder ausgedruckt)", "Lehrkraft zeigt und erläutert die Infografik: Profilbild – Bio/Steckbrief – Posts/Inhalte – Interaktionen (Likes, Kommentare, Follows) – Netzwerk. Kurze Erklärung: Jeder Baustein ist eine Entscheidung. Kein Einzelprofil als Beispiel verwenden."],
      ["8 Min.", "Partnerarbeit AB 1", "Partnerarbeit", "AB 1: Die 5 Bausteine meiner digitalen Identität", "Schüler:innen analysieren mit AB 1 ein fiktives Musterprofil (auf dem AB abgedruckt) oder – wenn gewünscht und freiwillig – ein eigenes Profil. Fragen: Was zeigt dieses Profil? Was fehlt? Welchen Eindruck erzeugt es?"],
      ["5 Min.", "Sicherung im Plenum", "Plenum", "Tafel/Board", "Sammlung der Ergebnisse: „Welche Gestaltungsentscheidungen habt ihr entdeckt?“ Kernbotschaft: Jede Entscheidung im Profil ist auch eine psychologische Entscheidung."],
      ["2 Min.", "Überleitung", "Plenum", "–", "„Wir haben gesehen: Profile sind nicht einfach so da. Jetzt schauen wir uns an, was verschiedene Strategien der Selbstdarstellung unterscheidet.“"],
  ]),
  sp()
);

ch.push(
  h3("Differenzierung Sek I / Sek II"),
  h4("Sek I"),
  bullet("Fokus auf konkrete, sichtbare Elemente: Profilbild, Emojis in der Bio, Art der Posts"),
  bullet("Analyse bleibt beschreibend: Was siehst du? Was fällt dir auf?"),
  bullet("Psychologische Bedürfnisse können intuitiv benannt werden: Anerkennung, Dazugehören, Spaß"),
  h4("Sek II"),
  bullet("Zusätzlich: Theorie der Selbstpräsentation – Erving Goffman: Das Leben als Theater (Vorder- und Hinterbühne)"),
  bulletRuns([N("boyd (2014): Networked Publics – digitale Identität ist "), B("persistent, durchsuchbar, replizierbar, skalierbar"), N("; das unterscheidet sie fundamental von analoger Selbstdarstellung")]),
  bulletRuns([N("Marwick & boyd (2011): "), B("Context Collapse"), N(" – online sehen Familie, Freunde und Schulkameraden denselben Post gleichzeitig; das erzeugt Authentizitätskonflikte")]),
  bullet("Psychologische Mechanismen benennen: Bedürfnis nach Anerkennung, Zugehörigkeit, Selbstwirksamkeit"),
  sp()
);

ch.push(
  h3("Didaktischer Kommentar"),
  p([B("Warum die 5-Bausteine-Struktur? "), N("Das Modell stellt analytische Kategorien bereit und hilft Schüler:innen, das intuitiv Bekannte explizit zu machen.")]),
  p([B("Musterprofil vs. eigenes Profil: "), N("Das AB 1 enthält ein fiktives Musterprofil. Die Option, das eigene Profil zu analysieren, sollte freiwillig sein – nie zur Pflicht machen.")]),
  p([B("Fallstricke: "), N("Kein Profil einer realen Person analysieren – immer fiktiv.")]),
  sp()
);

ch.push(
  h3("Erwartete Schüler:innen-Antworten"),
  h4("Zu den Bausteine-Entscheidungen"),
  bullet("„Man wählt das Profilbild aus, auf dem man gut aussieht“"),
  bullet("„Manche nutzen Bilder mit Freunden – zeigt, dass man dazugehört“"),
  bullet("„Manche schreiben in die Bio, was sie sein wollen, nicht was sie sind“"),
  p([I("Welche Bedürfnisse werden erfüllt? (Sek II): ")]),
  bullet("Anerkennung: Likes, Follower-Zahl"),
  bullet("Zugehörigkeit: gleiche Ästhetik wie die peer group"),
  bullet("Selbstwert: positives Feedback von außen"),
  sp()
);

// ── Phase 3 ────────────────────────────────────────────────────────────────────────────────

ch.push(h2("Phase 3: Vertiefung I – Profile analysieren (20 Min.)"));

ch.push(
  h3("Ziel"),
  p("Selbstdarstellungsstrategien und deren psychologische Hintergründe erkennen, verschiedene Strategien vergleichen und einordnen"),
  sp()
);

ch.push(
  h3("Ablauf"),
  ablaufTbl([
      ["1 Min.", "Einführung der drei Profile", "Plenum", "AB 2 (austeilen oder projizieren)", "Lehrkraft erklärt kurz: „Ihr analysiert jetzt drei fiktive Profile. Jede Person hat eine andere Strategie der Selbstdarstellung.“ Namen/Typen kurz vorstellen: „Der Perfekte“ (nur Highlights), „Der Authentische“ (auch Ungeläufiges), „Der Kreative“ (Ästhetik/Stil)."],
      ["12 Min.", "Partnerarbeit AB 2", "Partnerarbeit", "AB 2: Drei Profile im Vergleich", "Schüler:innen analysieren die drei fiktiven Profile: Was zeigt die Person? Was zeigt sie nicht? Welchen Eindruck erzeugt das Profil? Welche Bedürfnisse werden erfüllt?"],
      ["7 Min.", "Auswertung im Plenum", "Plenum", "Tafel/Board", "Ergebnisse werden gesammelt. Kernfragen: „Welches Profil wirkt auf euch am glaubwürdigsten? Warum?“ und „Was sagt das über uns als Betrachter:innen?“ Überleitung: Der Blick auf andere Profile beeinflusst, wie wir uns selbst wahrnehmen."],
  ]),
  sp()
);

ch.push(
  h3("Differenzierung Sek I / Sek II"),
  h4("Sek I"),
  bullet("Analyse bleibt auf der Beschreibungs- und Einordnungsebene: Was sehe ich? Was fällt mir auf?"),
  bullet("Leitfragen sind konkret und lebensnah: Würdest du diesem Profil folgen? Warum?"),
  h4("Sek II"),
  bullet("Psychologische Konzepte benennen und anwenden: Impression Management, Authentizitätsparadox"),
  bullet("Gesellschaftliche Dimension: „Welche Strategie ‘belohnt’ der Algorithmus? Was macht das mit uns?“"),
  bullet("Gegenmodell BeReal: Plattformdesign, das Inszenierung strukturell erschwert"),
  bullet("Bezug zu LH7 (Influencer:innen): Welche dieser drei Strategien nutzen professionelle Influencer:innen?"),
  bullet("Ethische Reflexion: Ist Selbstinszenierung unehrlich? Wo ist die Grenze?"),
  sp()
);

ch.push(
  box(BLUE, "↔ Erweiterung Grundschule (Klasse 3–4)", [
    "Anpassung für 8–10-Jährige:",
    "",
    "Statt AB 2 (Analyse fiktiver Social-Media-Profile) arbeiten die Lernenden mit Primarstufe AB 1 –",
    "einem kindgerechten Analysebogen mit vier gezeichneten Kinder-Avataren.",
    "",
    "Leitfragen im Sitzkreis:",
    "• „Glaubst du, das stimmt wirklich immer?“",
    "• „Warum schreibt das Kind wohl genau das?“",
    "• „Was würdest du über dich schreiben, wenn du dich jemandem vorstellen würdest?“",
    "",
    "Methodische Hinweise:",
    "• Sitzkreis oder Hufeisenformation – nicht am Einzeltisch",
    "• Keine Fachterminologie: statt Selbstinszenierung → so tun als ob, sich von der besten Seite zeigen",
    "• Rückbindung an Phase 1: „Erinnert ihr euch an das Bilderpaar? Das ist dasselbe – wir zeigen immer einen Teil von uns.“",
    "",
    "Zeitumfang: ca. 20 Minuten (identisch mit Sek I/II).",
  ]),
  sp()
);

ch.push(
  h3("Didaktischer Kommentar"),
  p([B("Warum drei Typen? "), N("Die drei Typen sind keine Werturteile, sondern Analysekategorien. Das verhindert eine simplizierende Botschaft à la „authentisch = gut, inszeniert = schlecht“.")]),
  p([B("Das Authentizitätsparadox (Sek II): "), N("Authentizität ist selbst eine Strategie: Das sorgfältig ausgewählte zufällige Selfie, der gezielt ungefilterte Post – die Grenze zwischen Selbstausdruck und Selbstinszenierung ist fließend.")]),
  p([B("Fallstricke: "), N("Nicht werten – es gibt keine beste Selbstdarstellungsstrategie.")]),
  sp()
);

ch.push(
  h3("Erwartete Schüler:innen-Antworten"),
  h4("„Der Perfekte“ (nur Highlights)"),
  bullet("„Immer alles perfekt – wirkt ein bisschen unecht“"),
  bullet("„Ich würde dem vielleicht folgen, aber ich würde mich auch schlechter fühlen“"),
  bullet("„Klassisches Impression Management – zeigt nur die Vorderbühne“"),
  h4("„Der Authentische“"),
  bullet("„Das fühlt sich echter an – aber vielleicht ist das auch ein Trick“"),
  bullet("„Paradox: Je echter das wirkt, desto mehr Likes bekommt man manchmal“"),
  h4("„Der Kreative“"),
  bullet("„Zeigt Persönlichkeit durch Stil – anders als ein Foto-Feed“"),
  bullet("„Bedürfnis: Selbstausdruck, vielleicht weniger Anerkennung“"),
  sp()
);

// ── Phase 4 ────────────────────────────────────────────────────────────────────────────────

ch.push(h2("Phase 4: Vertiefung II – Soziale Vergleiche & Auswirkungen (20 Min.)"));

ch.push(
  h3("Ziel"),
  p("Auswirkungen von Online-Selbstdarstellung auf Selbstbild, Wohlbefinden und mentale Gesundheit erkennen; soziale Vergleiche als psychologischen Mechanismus verstehen"),
  sp()
);

ch.push(
  h3("Ablauf"),
  ablaufTbl([
      ["2 Min.", "Einführung: Sozialer Vergleich", "Plenum", "–", "Lehrkraft erklärt kurz: „Wenn wir uns Online-Profile ansehen, vergleichen wir uns – das ist normal. Aber: Wir vergleichen uns immer mit kuratierten Versionen. Was macht das mit uns?“ Kein langer Input – direkt in die Fallarbeit."],
      ["12 Min.", "Gruppenarbeit Fallbeispiele", "Gruppenarbeit (3–4 Personen)", "AB 3a / 3b / 3c", "Jede Gruppe bekommt ein Fallbeispiel: AB 3a („Immer die perfekten Fotos“ – sozialer Vergleich), AB 3b („Niemand liked meine Beiträge“ – Selbstwert an Metriken), AB 3c („Mein Profil zeigt nicht, wer ich wirklich bin“ – Authentizitätskonflikt). Auftrag: Fallgeschichte lesen, Analysefragen bearbeiten, Kurzpräsentation vorbereiten."],
      ["6 Min.", "Kurzvorstellung der Gruppen", "Plenum", "–", "Jede Gruppe stellt ihr Fallbeispiel in 2 Minuten vor. Lehrkraft fasst zusammen: „In allen drei Fällen sehen wir: Die Art, wie wir uns online präsentieren und wie wir andere wahrnehmen, beeinflusst, wie wir uns selbst fühlen.“"],
  ]),
  sp()
);

ch.push(
  h3("Differenzierung Sek I / Sek II"),
  h4("Sek I"),
  bullet("Fokus auf Erkennen und Benennen von Gefühlen: Wie fühlt sich die Person? Was beschäftigt sie?"),
  bullet("Konkrete Situationen aus der eigenen Lebenswelt: Kennst du das auch?"),
  h4("Sek II"),
  bulletRuns([B("Social Comparison Theory"), N(" (Leon Festinger): Aufwärtsvergleich erzeugt Druck; Abwärtsvergleich kann kurzfristig stabilisieren")]),
  bulletRuns([B("Vogel et al. (2024)"), N(": Digitale Vergleiche sind intensiver und häufiger als analoge; Social-Media-Nutzung ist empirisch mit niedrigerem Selbstwertgefühl verknüpft")]),
  bullet("Selbstwertgefühl und externe Validation: Wenn Selbstwert von Metriken abhängt, wird er fragil"),
  bullet("Authentizitätskonflikt: Diskrepanz zwischen Online-Persona und realem Selbst als Identitätsstress"),
  bullet("Bezug zu LH19 (Körperbilder): Soziale Vergleiche sind nicht neu – Social Media verstärkt sie"),
  sp()
);

ch.push(
  h3("Didaktischer Kommentar"),
  p([B("Warum Fallarbeit? "), N("Die Distanzierung durch fiktive Personen ermöglicht es den Lernenden, über eigene Erfahrungen nachzudenken, ohne sich exponieren zu müssen.")]),
  p([B("Drei Fälle – drei Mechanismen:")]),
  bullet("AB 3a: Sozialer Aufwärtsvergleich (ich vs. die Besseren) → Unzufriedenheit, Neid"),
  bullet("AB 3b: Externe Validation (mein Wert = meine Likes) → Abhängigkeit von Rückmeldung"),
  bullet("AB 3c: Identitätsdiskrepanz (mein Profil ≠ ich) → Erschöpfung, Entfremdung"),
  p([B("Fallstricke: "), N("Nicht dramatisieren. Kein Schuldgefühl wecken. Auf Beratungsangebote hinweisen, falls Gespräche persönlich werden.")]),
  sp()
);

ch.push(
  h3("Erwartete Schüler:innen-Antworten"),
  h4("AB 3a – „Immer die perfekten Fotos“ (Sozialer Vergleich)"),
  bullet("„Sie vergleicht sich immer mit anderen – das macht unglücklich“"),
  bullet("„Klassischer Aufwärtsvergleich nach Festinger – man verliert immer“"),
  h4("AB 3b – „Niemand liked meine Beiträge“"),
  bullet("„Er macht seinen Selbstwert von anderen abhängig“"),
  bullet("„Likes sagen nichts über den echten Wert einer Person aus“"),
  h4("AB 3c – „Mein Profil zeigt nicht, wer ich wirklich bin“"),
  bullet("„Das kenne ich – man fühlt sich irgendwie falsch“"),
  bullet("„Erschöpfend, immer eine Rolle zu spielen“"),
  sp()
);

// ── Phase 5 ────────────────────────────────────────────────────────────────────────────────

ch.push(h2("Phase 5: Transfer (10 Min.)"));

ch.push(
  h3("Ziel"),
  p("Konkrete Handlungsstrategien für eine bewusste, gesunde Online-Präsenz entwickeln; persönliche Haltung festigen"),
  sp()
);

ch.push(
  h3("Ablauf"),
  ablaufTbl([
      ["4 Min.", "Partnerarbeit AB 5", "Partnerarbeit", "AB 5: „5 Fragen vor dem Posten“", "Schüler:innen entwickeln oder diskutieren Fragen, die man sich vor einem Post stellen kann. Sek I arbeitet mit vorformulierten Fragen als Ausgangspunkt; Sek II entwickelt eigene Fragen und begründet die Auswahl."],
      ["4 Min.", "Meinungslinie", "Plenum", "Tafel oder Seilzug im Raum", "Lehrkraft liest die These vor: „Ein authentisches Profil ist wichtiger als ein perfektes.“ Schüler:innen positionieren sich von stimme voll zu bis stimme gar nicht zu. 3–4 Schüler:innen begründen kurz. Keine Auflösung, keine richtige Antwort."],
      ["2 Min.", "Persönlicher Vorsatz", "Einzelarbeit", "Notizzettel", "Schüler:innen schreiben einen persönlichen Vorsatz auf (anonym, für sich behalten, wird nicht eingesammelt)."],
  ]),
  sp()
);

ch.push(
  h3("Differenzierung Sek I / Sek II"),
  h4("Sek I"),
  bullet("AB 5 enthält vorformulierte Fragen als Grundlage: Warum poste ich das? Wie fühle ich mich dabei? Würde ich das auch offline sagen?"),
  bullet("Meinungslinie: einfache Sprache, keine Fachbegriffe; Begründungen können kurz und intuitiv sein"),
  h4("Sek II"),
  bullet("AB 5: Fragen werden selbst entwickelt und begründet; Reflexion: Für wen sind diese Fragen – als Werkzeug oder als Einschränkung?"),
  bullet("Meinungslinie erweitern: Hat jeder das Recht auf ein unechtes Profil? – ethische Diskussion"),
  sp()
);

ch.push(
  h3("Didaktischer Kommentar"),
  p([B("Transfer ≠ Reflexion: "), N("Diese Phase ist bewusst handlungsorientiert. Die Meinungslinie ist kein Test, die 5 Fragen sind keine Regeln.")]),
  p([B("Warum Meinungslinie? "), N("Die körperliche Positionierung im Raum macht abstrakte Meinungen sichtbar und erleichtert die Verbalisierung.")]),
  p([B("Warum persönlicher Vorsatz anonym? "), N("Vorsätze, die öffentlich ausgesprochen werden, lösen Erwartungsdruck aus. Der Notizzettel dient als stilles Commitment zu sich selbst.")]),
  sp()
);

ch.push(
  h3("Erwartete Schüler:innen-Antworten"),
  h4("Meinungslinie – These: „Ein authentisches Profil ist wichtiger als ein perfektes.“"),
  bullet("„Echte Verbindungen entstehen durch Authentizität, nicht durch Perfektion“"),
  bullet("„Perfektion erzeugt Druck – für mich und für andere“"),
  bullet("„Ich habe das Recht, nicht alles zu zeigen – das ist kein Fake“"),
  h4("„5 Fragen vor dem Posten“ – typische Schüler:innen-Fragen"),
  bullet("Warum poste ich das?"),
  bullet("Welches Bedürfnis befriedige ich damit?"),
  bullet("Für wen ist dieser Post – für mich oder für andere?"),
  bullet("Was bleibt davon in 5 Jahren?"),
  sp()
);

// ── Phase 6 ────────────────────────────────────────────────────────────────────────────────

ch.push(h2("Phase 6: Reflexion (5 Min.)"));

ch.push(
  h3("Ziel"),
  p("Rückblick auf den Lernprozess; kein Handlungsdruck, kein Produkt, kein Bewertungsdruck"),
  sp()
);

ch.push(
  h3("Ablauf"),
  ablaufTbl([
      ["4 Min.", "Blitzlicht-Abschlussrunde", "Plenum", "–", "Lehrkraft leitet die Runde an: „Jede:r sagt in einem Satz: Was nehme ich heute mit? Was hat mich überrascht? Was beschäftigt mich noch?“ Keine Auflösung, keine Kommentierung. Wortmeldungen sind freiwillig."],
      ["1 Min.", "Optionaler Hinweis: AB 4", "Einzelarbeit", "AB 4: Selbstreflexionsbogen (optional)", "Lehrkraft erwähnt optional: „Wer möchte, kann diesen Bogen für sich ausfüllen – anonym, wird nicht eingesammelt, muss nicht geteilt werden.“ AB 4 wird ausgeteilt oder liegt aus."],
  ]),
  sp()
);

ch.push(
  h3("Differenzierung"),
  p("Phase 6 ist einheitlich für Sek I und Sek II. Niedertschwellig, offen, ohne Bewertungsdruck."),
  p([B("Grundschule: "), N("Abschlussrunde im Sitzkreis, gleiche Impulsfragen in kindgerechter Sprache: Was hast du heute gelernt? Was hat dich überrascht?")]),
  sp()
);

ch.push(
  h3("Didaktischer Kommentar"),
  p([B("Reflexion ≠ Transfer: "), N("Diese Phase ist bewusst offen gehalten. Offene Fragen dürfen offen bleiben.")]),
  p([B("Warum kein Auflösungsgespräch? "), N("Das Thema digitale Identität hat keine abschließende richtige Antwort. Eine Unterrichtsstunde kann und soll nicht alle Fragen beantworten.")]),
  p([B("Blitzlicht – praktische Hinweise:")]),
  bullet("Lehrkraft macht ggf. den Anfang"),
  bullet("Schweigen ist erlaubt – nicht jede:r muss sprechen"),
  bullet("AB 4 nie als Pflicht einfordern"),
  sp()
);

ch.push(
  h3("Erwartete Schüler:innen-Antworten"),
  p([I("Typische Blitzlicht-Antworten (Sek I): ")]),
  bullet("„Ich hatte nicht gedacht, dass ich mir so viele Gedanken über meine Profile mache“"),
  bullet("„Ich frage mich jetzt, warum ich das eigentlich poste“"),
  p([I("Typische Antworten (Sek II): ")]),
  bullet("„Das Authentizitätsparadox hat mich beschäftigt – ich glaube, das merkt man öfter“"),
  bullet("„Ich weiß noch nicht, ob ich jetzt weniger oder mehr posten will“"),
  p([I("Offene Fragen, die bewusst offen bleiben: ")]),
  bullet("„Kann man wirklich authentisch sein – oder ist alles irgendwie Inszenierung?“"),
  sp()
);

// ── Follow-up ────────────────────────────────────────────────────────────────────────────────

ch.push(h2("Follow-up (Optional, ca. 15 Min. | ca. 2 Wochen nach der Haupteinheit)"));

ch.push(
  h3("Ziel"),
  p("Langzeitwirkung der Lerneinheit überprüfen, persönliche Entwicklung im Umgang mit der eigenen Online-Präsenz reflektieren"),
  sp()
);

ch.push(
  h3("Ablauf"),
  ablaufTbl([
      ["5 Min.", "Rückblick: Persönlicher Vorsatz", "Einzelarbeit", "Notizzettel aus Phase 5 (falls aufbewahrt)", "Schüler:innen rufen sich ihren Vorsatz aus Phase 5 in Erinnerung: „Was hatte ich mir vorgenommen? Hat sich etwas verändert?“ Kein Teilen notwendig."],
      ["7 Min.", "Austausch in Kleingruppen", "Kleingruppen (3–4 Personen)", "–", "Impulsfragen: „Habt ihr etwas an eurem Online-Verhalten bemerkt oder verändert?“ Freiwilliger Austausch, keine Pflicht zur Verhaltensänderung."],
      ["3 Min.", "Kurzes Plenum", "Plenum", "–", "2–3 Wortmeldungen aus den Gruppen – was war spannend? Was hat sich verändert? Was nicht? Kein Fazit-Zwang."],
  ]),
  sp(),
  box(YELLOW, "Hinweis:", [
    "Das Follow-up ist explizit optional. Es sollte nicht als Test oder Evaluation",
    "der Stunde gerahmt werden, sondern als echtes Gespräch über Alltag und Veränderung.",
  ]),
  sp()
);

// ── Materialübersicht ────────────────────────────────────────────────────────────────────────────────

ch.push(
  h2("Materialübersicht"),
  tbl(
    ["Material", "Phase", "Beschreibung"],
    [
      ["Video-Idee: Bildcollage (noch zu produzieren)", "1", "4 Profile derselben Person; alternativ: selbst erstellte Collage"],
      ["Infografik: Die 5 Bausteine der digitalen Identität", "2", "Profilbild, Bio, Posts, Interaktionen, Netzwerk – projizierbar"],
      ["AB 1: Die 5 Bausteine meiner digitalen Identität", "2", "Analyse-Raster mit fiktivem Musterprofil; Gestaltungsentscheidungen und Bedürfnisse"],
      ["AB 2: Drei Profile im Vergleich", "3", "„Der Perfekte“, „Der Authentische“, „Der Kreative“ – fiktive Profile mit Analysefragen"],
      ["AB 3a: Fallbeispiel – „Immer die perfekten Fotos“", "4", "Sozialer Vergleich, Unzufriedenheit; Analysefragen und Handlungsoptionen"],
      ["AB 3b: Fallbeispiel – „Niemand liked meine Beiträge“", "4", "Selbstwert an Metriken geknüpft; Analysefragen und Handlungsoptionen"],
      ["AB 3c: Fallbeispiel – „Mein Profil zeigt nicht, wer ich wirklich bin“", "4", "Authentizitätskonflikt; Analysefragen und Handlungsoptionen"],
      ["AB 4: Selbstreflexionsbogen", "6", "Optional, anonym; Reflexion der eigenen Online-Präsenz"],
      ["AB 5: „5 Fragen vor dem Posten“", "5", "Sek I: vorformulierte Fragen; Sek II: eigene Fragen entwickeln"],
      ["Primarstufe AB 1: Mein Online-Ich", "3 (GS)", "Vier Kinder-Avatare mit Sprechblasen; kindgerechte Analysefragen"],
      ["Bilderpaar (gezeichnet) – GS", "1 (GS)", "Kind beim Matschen vs. Geburtstagsfoto; A4, projizierbar"],
    ],
    [3400, 700, 5260]
  ),
  sp()
);

// ── Kernbotschaften ────────────────────────────────────────────────────────────────────────────────

ch.push(
  h2("Kernbotschaften der Lerneinheit"),
  numbered(1, "Digitale Identität ist gestaltbar – Online-Profile sind konstruiert; niemand zeigt die ganze Wahrheit über sich."),
  numbered(2, "Online-Selbstdarstellung ist nie neutral – Sie dient psychologischen Bedürfnissen (Anerkennung, Zugehörigkeit, Selbstwert)."),
  numbered(3, "Soziale Vergleiche können schaden – Der ständige Vergleich mit kuratierten, idealisierten Profilen belastet Selbstwertgefühl und Wohlbefinden."),
  numbered(4, "Authentizität ist Gesundheitsschutz – Bewusste Reflexion über die eigene Online-Präsenz fördert mentale Gesundheit."),
  sp()
);

// ── Fußzeile + Dokument ──────────────────────────────────────────────────────

ch.push(
  new Paragraph({
    children: [new TextRun({ text: "DURCHBLICKT! \u2013 Digital in eine gesunde Zukunft  |  BARMER / Klett MEX", size: 18, font: "Arial", color: "888888", italics: true })],
    alignment: AlignmentType.CENTER,
    spacing: { before: 240, after: 40 },
  }),
  new Paragraph({
    children: [new TextRun({ text: "LH2 \u2013 \u201EWer bin ich online?\u201C  |  Autor: Michael Kohl  |  April 2026", size: 18, font: "Arial", color: "888888", italics: true })],
    alignment: AlignmentType.CENTER,
    spacing: { before: 0, after: 0 },
  })
);

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

const outPath = path.join(__dirname, "../output/Durchblickt_LH2_fertig.docx");
Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync(outPath, buf);
  console.log("\u2705 DOCX erstellt: " + outPath);
});

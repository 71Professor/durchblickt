# DURCHBLICKT! – Skills & Subagents
*Für Claude Code | BARMER/Klett MEX | Stand: März 2026*

## Installation

1. Diesen Ordner (`durchblickt-skills/`) in dein Projektverzeichnis kopieren
2. Die `CLAUDE.md` aus dem separaten Download ins **Projektstamm-Verzeichnis** legen
3. `DGK_LH1_KI_FS_MK_cleanVersion.docx` als Referenz ins Verzeichnis `referenz/` legen

```
dein-projekt/
├── CLAUDE.md                          ← Projektkonfiguration (separat)
├── durchblickt-skills/                ← dieser Ordner
│   ├── README.md
│   ├── agents/
│   │   ├── orchestrator.md
│   │   └── subagents.md
│   └── skills/
│       ├── leitlinien-check/
│       ├── grobkonzept/
│       ├── ablaufstruktur/
│       ├── grundschul-erweiterung/
│       ├── arbeitsblätter/
│       └── docx-export/
├── referenz/
│   └── DGK_LH1_KI_FS_MK_cleanVersion.docx
├── lh1/                               ← fertige LH1-Materialien
├── lh2/                               ← wird bei Bedarf angelegt
└── output/                            ← finale DOCX für Einreichung
```

## Skills im Überblick

| Skill | Wann aufrufen |
|-------|---------------|
| `leitlinien-check` | Vor jeder Einreichung, nach größeren Überarbeitungen |
| `grobkonzept` | Neue LH anlegen, Entwürfe zusammenführen, Feedback einarbeiten |
| `ablaufstruktur` | Ablauf einer LH ausarbeiten oder vertiefen |
| `grundschul-erweiterung` | Grundschul-Abschnitte in 2 Phasen entwickeln |
| `arbeitsblätter` | Fallszenarien, Analyse- und Reflexionsinstrumente erstellen |
| `docx-export` | Finales DOCX für BARMER / Fabienne erstellen |

## Schnellstart: Neue LH beauftragen

Starte Claude Code im Projektordner und schreib:

```
Starte eine neue LH: [Thema / Arbeitstitel]
Leitfrage: [Leitfrage]
Abgrenzung zu LH1: [Was ist explizit anders/neu?]
```

Der Orchestrator übernimmt die Koordination.

## Wichtige Konventionen

- **Transfer ≠ Reflexion** – immer zwei separate Phasen
- **Grundschul-Erweiterung** – genau 2 Phasen, thematisch je LH neu gewählt
- **Leitlinien-Check** – immer vor Einreichung
- **Änderungs-Log** – immer bei Feedback-Integration

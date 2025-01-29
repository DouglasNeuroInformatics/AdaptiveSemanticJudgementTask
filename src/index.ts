import type { Language } from "/runtime/v1/@opendatacapture/runtime-core";

import { adaptiveSemanticJudgementTask } from "./adaptiveSemanticJudgementTask.ts";
import { experimentSettingsJson } from "./experimentSettings.ts";
import { $ExperimentResults, $ODCExport, $Settings } from "./schemas.ts";
import { translator } from "./translator.ts";
import { z } from "/runtime/v1/zod@3.23.x";
import "/runtime/v1/jspsych@8.x/css/jspsych.css";
const { defineInstrument } = await import(
  "/runtime/v1/@opendatacapture/runtime-core/index.js"
);

export default defineInstrument({
  kind: "INTERACTIVE",
  language: experimentSettingsJson.language as Language,
  internal: {
    edition: 1,
    name: "AdaptiveSemanticJudgementTask",
  },
  tags: ["interactive", "jsPsych", "AdaptiveSemanticJudgementTask"],
  content: {
    async render(done) {
      const settingsParseResult = $Settings.safeParse(experimentSettingsJson);

      // parse settings
      if (!settingsParseResult.success) {
        throw new Error("validation error, check experiment settings", {
          cause: settingsParseResult.error,
        });
      }

      translator.init();
      translator.changeLanguage(settingsParseResult.data.language);
      await adaptiveSemanticJudgementTask(done);
    },
  },
  details: {
    description:
      "Displays and reads aloud two words to the participant. The participant then has to determine if the words are related or unrelated",
    estimatedDuration: 15,
    instructions: ["<PLACEHOLDER>"],
    license: "UNLICENSED",
    title: "Adaptive Semantic Judgement Task",
  },
  measures: {},
  validationSchema: z.object({
    version: z.string(),
    timestamp: z.string(),
    experimentResults: z.array($ODCExport),
  }),
});

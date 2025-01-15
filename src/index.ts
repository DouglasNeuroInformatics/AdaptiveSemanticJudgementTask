import { adaptiveSemanticJudgementTask } from "./adaptiveSemanticJudgementTask.ts";
import { $ExperimentResults } from "./schemas.ts";

import "/runtime/v1/jspsych@8.x/css/jspsych.css";
const { defineInstrument } = await import(
  "/runtime/v1/@opendatacapture/runtime-core/index.js"
);
const { z } = await import("/runtime/v1/zod@3.23.x/index.js");

export default defineInstrument({
  kind: "INTERACTIVE",
  language: "en",
  internal: {
    edition: 1,
    name: "AdaptiveSemanticJudgementTask",
  },
  tags: ["interactive", "jsPsych", "AdaptiveSemanticJudgementTask"],
  content: {
    render(done) {
      adaptiveSemanticJudgementTask(done);
    },
  },
  details: {
    description:
      "Displays and reads aloud two words to the participant. The participant then has to determine if the words are relatd or unrelated",
    estimatedDuration: 5,
    instructions: ["<PLACEHOLDER>"],
    license: "UNLICENSED",
    title: "Adaptive Semantic Judgement Task",
  },
  measures: {},
  validationSchema: $ExperimentResults,
});

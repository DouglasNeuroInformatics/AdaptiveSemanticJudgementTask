import { experimentSettingsJson } from "./experimentSettings.ts";
import { jsPsychExperiment } from "./jsPsychExperiment.ts";
import { $ExperimentResults } from "./schemas.ts";

import type { Language } from "/runtime/v1/@opendatacapture/runtime-core";

import "/runtime/v1/jspsych@8.x/css/jspsych.css";

import { defineInstrument } from "/runtime/v1/@opendatacapture/runtime-core";

export default defineInstrument({
  kind: "INTERACTIVE",
  // if multilingual experimentSettingsJson needs a language field 
  language: experimentSettingsJson.language as Language,
  internal: {
    edition: 1,
    name: "<PLACEHOLDER>",
  },
  tags: ["interactive", "jsPysch", "PLACEHOLDER"],
  content: {
    async render(done) {
      await jsPsychExperiment(done);
    },
  },
  details: {
    description: "A jsPysch experiment developed by the DNP",
    estimatedDuration: 1,
    instructions: ["<PLACEHOLDER>"],
    // make sure license is correct
    license: "Apache-2.0",
    title: "<PLACEHOLDER>",
  },
  measures: {},
  validationSchema: $ExperimentResults,
});

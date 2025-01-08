import { adaptiveSemanticJudgementTask } from "./adaptiveSemanticJudgementTask.ts";
import "/runtime/v1/jspsych@8.x/css/jspsych.css";
const { defineInstrument } = await import('/runtime/v1/@opendatacapture/runtime-core/index.js');
const { z } = await import('/runtime/v1/zod@3.23.x/index.js');







export default defineInstrument({
  kind: 'INTERACTIVE',
  language: 'en',
  internal: {
    edition: 1,
    name: '<PLACEHOLDER>'
  },
  tags: ['<PLACEHOLDER>'],
  content: {
        render() {
          adaptiveSemanticJudgementTask()
      }
  },
  details: {
    description: '<PLACEHOLDER>',
    estimatedDuration: 1,
    instructions: ['<PLACEHOLDER>'],
    license: 'UNLICENSED',
    title: '<PLACEHOLDER>'
  },
  measures: {},
  validationSchema: z.object({
    message: z.string()
  })
});
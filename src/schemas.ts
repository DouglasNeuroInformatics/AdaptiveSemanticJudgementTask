import { z } from "/runtime/v1/zod@3.23.x";

const $Language = z.enum(["en", "fr"]);
const $Related = z.enum(["related", "unrelated"]);

const $ParticipantResponse = z.object({
  notes: z.string(),
  result: z.string(),
});
const $Trial = z.object({
  trialType: z.string(),
});

const $LoggingTrial = $Trial.extend({
  rt: z.coerce.number().positive().int(),
  response: $ParticipantResponse,
  difficultyLevel: z.coerce.number().positive().int(),
  wordPair: z.string(),
});

export const $ExperimentResults = $LoggingTrial
  .omit({ response: true, trialType: true })
  .extend({
    responseNotes: z.string(),
    responseResult: z.string(),
  });

export const $Settings = z.object({
  advancementSchedule: z.coerce.number().positive().int(),
  downloadOnFinish: z.coerce.boolean(),
  initialDifficulty: z.coerce.number().positive().int(),
  language: z.string(),
  numberOfLevels: z.coerce.number().positive().int(),
  regressionSchedule: z.coerce.number().int(),
  seed: z.coerce.number().positive().int(),
});

export const $WordPairStimulus = z.object({
  topStimulus: z.string(),
  bottomStimulus: z.string(),
  difficultyLevel: z.coerce.number().positive().int(),
  language: $Language,
  relation: $Related,
});

export type SupportedLanguage = z.infer<typeof $Language>;
export type ParticipantResponse = z.infer<typeof $ParticipantResponse>;
export type Trial = z.infer<typeof $Trial>;
export type LoggingTrial = z.infer<typeof $LoggingTrial>;
export type ExperimentResults = z.infer<typeof $ExperimentResults>;
export type Settings = z.infer<typeof $Settings>;
export type WordPairStimulus = z.infer<typeof $WordPairStimulus>;

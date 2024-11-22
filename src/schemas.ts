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
const $WordPairTrial = $Trial.extend({
  userChoice: z.enum(['related', 'unrelated']),
  result: z.enum(['correct', 'incorrect']),
  response: z.coerce.number().int(),
  correctResponse: z.enum(['related', 'unrelated']),
})

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
  language: $Language,
  numberOfLevels: z.coerce.number().positive().int(),
  regressionSchedule: z.coerce.number().int(),
  numberOfRoundsPractice1: z.coerce.number().positive().int(),
  numberOfRoundsPractice2: z.coerce.number().positive().int(),
  seed: z.preprocess(
    (val) =>
      val === "" || val === null || val === 0 || val === undefined
        ? undefined
        : val,
    z.coerce.number().positive().int().optional(),
  ),

});

export const $WordPairStimulus = z.object({
  stimulus: z.string(),
  difficultyLevel: z.coerce.number().int(),
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
export type WordPairTrial = z.infer<typeof $WordPairTrial>

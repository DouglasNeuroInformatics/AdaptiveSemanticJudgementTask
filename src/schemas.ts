import { z } from "/runtime/v1/zod@3.23.x";

const $Language = z.enum(["en", "fr"]);
const $Related = z.enum(["related", "unrelated"]);

const $ParticipantResponse = z.object({
  notes: z.string(),
  result: z.string(),
});
const $Trial = z.object({
  trial_type: z.string(),
});

export const $WordPairStimulus = z.object({
  stimulus: z.string(),
  prompt: z.string(),
  difficultyLevel: z.coerce.number().int(),
  language: $Language,
  relation: $Related,
});

const $WordPairTrial = $Trial.extend({
  ...$WordPairStimulus.shape,
  userChoice: z.enum(["related", "unrelated", "timeout"]),
  result: z.enum(["correct", "incorrect"]),
  response: z.coerce.number().int(),
  correctResponse: z.enum(["related", "unrelated"]),
  rt: z.coerce.number().int(),
});

export const $ExperimentResults = $WordPairTrial
  .omit({ trial_type: true })
  .extend({
    responseResult: z.string(),
  });

export const $Settings = z.object({
  advancementSchedule: z.coerce.number().positive().int(),
  downloadOnFinish: z.coerce.boolean(),
  initialDifficulty: z.coerce.number().positive().int(),
  language: $Language,
  numberOfLevels: z.coerce.number().positive().int(),
  regressionSchedule: z.coerce.number().int(),
  seed: z.preprocess(
    (val) =>
      val === "" || val === null || val === 0 || val === undefined
        ? undefined
        : val,
    z.coerce.number().positive().int().optional(),
  ),
});

export type SupportedLanguage = z.infer<typeof $Language>;
export type ParticipantResponse = z.infer<typeof $ParticipantResponse>;
export type Trial = z.infer<typeof $Trial>;
export type ExperimentResults = z.infer<typeof $ExperimentResults>;
export type Settings = z.infer<typeof $Settings>;
export type WordPairStimulus = z.infer<typeof $WordPairStimulus>;
export type WordPairTrial = z.infer<typeof $WordPairTrial>;

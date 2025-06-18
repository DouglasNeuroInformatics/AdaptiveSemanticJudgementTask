import { adaptiveSemanticJudgementTask } from "./adaptiveSemanticJudgementTask";
import { experimentSettingsJson } from "./experimentSettings.ts";
import { $Settings } from "./schemas.ts";
import { translator } from "./translator";

import "/runtime/v1/jspsych@8.x/css/jspsych.css";

const settingsParseResult = $Settings.safeParse(experimentSettingsJson);

// parse settings
if (!settingsParseResult.success) {
  throw new Error("validation error, check experiment settings", {
    cause: settingsParseResult.error,
  });
}

translator.init();
translator.changeLanguage(settingsParseResult.data.language);

await adaptiveSemanticJudgementTask();

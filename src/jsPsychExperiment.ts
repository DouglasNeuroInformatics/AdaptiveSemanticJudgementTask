// a generic jsPsych expieriment

import type { Language } from "@opendatacapture/runtime-v1/@opendatacapture/runtime-core/index.js";

import { transformAndDownload, transformAndExportJson } from "./dataMunger.ts";
import { experimentSettingsJson } from "./experimentSettings.ts";
import i18n from "./i18n.ts";
import {
  $ExperimentImage,
  $Settings,
  type ExperimentImage,
  type LoggingTrial,
  type ParticipantResponse,
} from "./schemas.ts";
import { stimuliPaths } from "./stimuliPaths.ts";

import { HtmlKeyboardResponsePlugin } from "/runtime/v1/@jspsych/plugin-html-keyboard-response@2.x";
import { ImageKeyboardResponsePlugin } from "/runtime/v1/@jspsych/plugin-image-keyboard-response@2.x";
import { PreloadPlugin } from "/runtime/v1/@jspsych/plugin-preload@2.x";
import { SurveyHtmlFormPlugin } from "/runtime/v1/@jspsych/plugin-survey-html-form@2.x";
import { DOMPurify } from "/runtime/v1/dompurify@3.x";
import { initJsPsych } from "/runtime/v1/jspsych@8.x";
import { JsPsych } from "/runtime/v1/jspsych@8.x";
import {
  uniformIntDistribution,
  xoroshiro128plus,
} from "/runtime/v1/pure-rand@6.x";

export async function jsPsychExperiment(onFinish?: (data: any) => void) {
  //****************************
  //****EXPERIMENT_SETTINGS*****
  //****************************
  // variables for controlling advancementSchedule, regressionSchedule, and when the experiment is finished
  //
  // can be read from either the csv files in public/ or via json if using the instrument playground

  let numberOfCorrectAnswers = 0;
  let numberOfTrialsRun = 1;
  let settingsParseResult;
  let imageDBParseResult;

  settingsParseResult = $Settings.safeParse(experimentSettingsJson);
  imageDBParseResult = $ExperimentImage.array().safeParse(stimuliPaths);
  if (!settingsParseResult.success) {
    throw new Error("validation error, check experiment settings", {
      cause: settingsParseResult.error,
    });
  }
  if (!imageDBParseResult.success) {
    throw new Error("validation error, check imageDB", {
      cause: imageDBParseResult.error,
    });
  }
  const imageDB = imageDBParseResult.data;
  const {
    totalNumberOfTrialsToRun,
    advancementSchedule,
    regressionSchedule,
    language,
    numberOfLevels,
    seed,
    downloadOnFinish,
    initialDifficulty,
  } = settingsParseResult.data;

  // small hack to get around i18n issues with wait for changeLanguage
  i18n.changeLanguage(language as Language);
  await new Promise(function (resolve) {
    i18n.onLanguageChange = resolve;
  });

  /*
functions for generating
experimentStimuli
specific to this experiment
*/

  const indiciesSelected = new Set();
  let rng = xoroshiro128plus(seed);

  // closure
  function getRandomElementWithSeed(
    array: ExperimentImage[],
  ): ExperimentImage[] {
    let randomIndex: number;
    let foundUnique = false;

    // if all images have been shown clear the set
    if (indiciesSelected.size === array.length) {
      indiciesSelected.clear();
    }

    do {
      const [newRandomIndex, newRng] = uniformIntDistribution(
        0,
        array.length - 1,
        rng,
      );
      rng = newRng;
      randomIndex = newRandomIndex;

      if (!indiciesSelected.has(randomIndex)) {
        indiciesSelected.add(randomIndex);
        foundUnique = true;
      }
    } while (!foundUnique);

    const result = [array[randomIndex]!];
    return result;
  }

  // draw an image at random from the bank depending on the difficulty_level selected
  // closure
  // specific to this experiment
  function createStimuli(
    difficultyLevel: number,
    language: string,
    clearSet: boolean,
  ): ExperimentImage[] {
    if (clearSet === true) {
      indiciesSelected.clear();
    }
    let imgList: ExperimentImage[] = imageDB.filter(
      (image) =>
        image.difficultyLevel === difficultyLevel &&
        image.language === language,
    );
    let result = getRandomElementWithSeed(imgList);
    return result;
  }

  // to handle clicks on a touchscreen as a keyboard response
  // generically useful
  function simulateKeyPress(jsPsych: JsPsych, key: string) {
    jsPsych.pluginAPI.keyDown(key);
    jsPsych.pluginAPI.keyUp(key);
  }

  //****************************
  //********EXPERIMENT**********
  //****************************
  // a timeline is a set of trials
  // a trial is a single object eg htmlKeyboardResponse etc ...
  const timeline: any[] = [];

  (function () {
    let experimentStimuli = createStimuli(initialDifficulty, language, false);
    let currentDifficultyLevel = initialDifficulty;
    const jsPsych = initJsPsych({
      on_finish: function () {
        const data = jsPsych.data.get();
        if (downloadOnFinish) {
          transformAndDownload(data);
        }
        if (onFinish) {
          onFinish(transformAndExportJson(data));
        }
      },
    });

    const welcome = {
      on_start: function () {
        document.addEventListener(
          "click",
          () => simulateKeyPress(jsPsych, "a"),
          { once: true },
        );
      },
      stimulus: i18n.t("welcome"),
      type: HtmlKeyboardResponsePlugin,
    };

    const preload = {
      auto_preload: true,
      message: `<p>loading stimulus</p>`,
      show_progress_bar: true,
      type: PreloadPlugin,
    };

    const blankPage = {
      on_start: function () {
        document.addEventListener(
          "click",
          () => simulateKeyPress(jsPsych, "a"),
          { once: true },
        );
      },
      stimulus: "",
      type: HtmlKeyboardResponsePlugin,
    };
    const showImg = {
      on_start: function () {
        document.addEventListener(
          "click",
          () => simulateKeyPress(jsPsych, "a"),
          { once: true },
        );
      },
      stimulus: jsPsych.timelineVariable("stimulus"),
      stimulus_height: 600,
      type: ImageKeyboardResponsePlugin,
    };

    const logging = {
      autofocus: "textBox",
      button_label: i18n.t("submit"),
      data: {
        stimulus: jsPsych.timelineVariable("stimulus"),
        correctResponse: jsPsych.timelineVariable("correctResponse"),
        difficultyLevel: jsPsych.timelineVariable("difficultyLevel"),
        language: jsPsych.timelineVariable("language"),
      },
      html: function () {
        const html = `
          <h3>${i18n.t("logResponse")}</h3>
          <input type="button" value="${i18n.t("correct")}" onclick="document.getElementById('result').value='${i18n.t("correct")}';">
          <input type="button" value="${i18n.t("incorrect")}" onclick="document.getElementById('result').value='${i18n.t("incorrect")}';">
          <br>
          <label for="result">${i18n.t("responseWas")}</label>
          <input type="text" id="result" name="result" readonly>
          <hr>
          <input type="text" id="textBox" name="notes" placeholder="${i18n.t("logResponse")}">
          <p>${i18n.t("logResponseToContinue")}</p>`;
        return html;
      },
      on_load: function () {
        const submitButton = document.getElementById(
          "jspsych-survey-html-form-next",
        ) as HTMLButtonElement;
        const resultInput = document.getElementById(
          "result",
        ) as HTMLInputElement;
        submitButton.disabled = true;
        document.querySelectorAll('input[type="button"]').forEach((button) => {
          button.addEventListener("click", () => {
            if (resultInput.value !== "") {
              submitButton.disabled = false;
            }
          });
        });
      },
      preamble: function () {
        const html = `<h3>${i18n.t("correctResponse")}</h3>
                    <p>${jsPsych.evaluateTimelineVariable("correctResponse")}</p>
                    <img src="${jsPsych.evaluateTimelineVariable("stimulus")}" width="300" height="300">`;
        return DOMPurify.sanitize(html);
      },
      type: SurveyHtmlFormPlugin,
    };
    const testProcedure = {
      // to reload the experimentStimuli after one repetition has been completed
      on_timeline_start: function () {
        this.timeline_variables = experimentStimuli;
      },
      timeline: [preload, blankPage, showImg, blankPage, logging],
      timeline_variables: experimentStimuli,
    };
    timeline.push(testProcedure);

    const loop_node = {
      loop_function: function () {
        // tracking number of corret answers
        // need to access logging trial info
        let clearSet = false;

        if (numberOfTrialsRun === totalNumberOfTrialsToRun) {
          return false;
        }
        // getting the most recent logged result
        const loggingResponseArray = jsPsych.data
          .get()
          .filter({ trial_type: "survey-html-form" })
          .values() as LoggingTrial[];
        const lastTrialIndex = loggingResponseArray.length - 1;

        const lastTrialResults: ParticipantResponse =
          loggingResponseArray[lastTrialIndex]!.response;

        if (lastTrialResults.result === "Correct") {
          numberOfCorrectAnswers++;
          clearSet = false;
        } else if (lastTrialResults.result === "Incorrect") {
          numberOfCorrectAnswers = 0;
        }
        // difficulty level logic, <x> correct answers in a row, increase, <y> incorrect answer decrease
        if (numberOfCorrectAnswers === advancementSchedule) {
          if (numberOfCorrectAnswers <= numberOfLevels) {
            currentDifficultyLevel++;
            // need to reset as difficulty has changed
            numberOfCorrectAnswers = 0;
            clearSet = true;
          }
        } else if (numberOfCorrectAnswers === regressionSchedule) {
          if (currentDifficultyLevel > 1) {
            currentDifficultyLevel--;
          }
        }
        experimentStimuli = createStimuli(
          currentDifficultyLevel,
          language,
          clearSet,
        );
        numberOfTrialsRun++;
        return true;
      },
      timeline,
    };
    void jsPsych.run([welcome, loop_node]);
  })();
}

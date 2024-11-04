import HtmlButtonResponsePlugin from "@opendatacapture/runtime-v1/@jspsych/plugin-html-button-response@1.x/index.js";
import type { Language } from "@opendatacapture/runtime-v1/@opendatacapture/runtime-core/index.js";

import { transformAndDownload, transformAndExportJson } from "./dataMunger.ts";
import { experimentSettingsJson } from "./experimentSettings.ts";
import i18n from "./i18n.ts";
import {
  $Settings,
  $WordPairStimulus,
  type LoggingTrial,
  type ParticipantResponse,
  type WordPairStimulus,
} from "./schemas.ts";
import { stimuliList } from "./stimuliList.ts";
import TextToSpeechButtonResponse from "./textToSpeechButtonResponse.ts";
import TextToSpeechKeyboardResponsePlugin from "./textToSpeechKeyboardResponse.ts";

import { HtmlKeyboardResponsePlugin } from "/runtime/v1/@jspsych/plugin-html-keyboard-response@2.x";
// import { ImageKeyboardResponsePlugin } from "/runtime/v1/@jspsych/plugin-image-keyboard-response@2.x";
import { PreloadPlugin } from "/runtime/v1/@jspsych/plugin-preload@2.x";
import { SurveyHtmlFormPlugin } from "/runtime/v1/@jspsych/plugin-survey-html-form@2.x";
import { DOMPurify } from "/runtime/v1/dompurify@3.x";
import { initJsPsych } from "/runtime/v1/jspsych@8.x";
import { JsPsych } from "/runtime/v1/jspsych@8.x";
import {
  uniformIntDistribution,
  xoroshiro128plus,
} from "/runtime/v1/pure-rand@6.x";

export async function adaptiveSemanticJudgementTask(
  onFinish?: (data: any) => void,
) {
  //****************************
  //****EXPERIMENT_SETTINGS*****
  //****************************
  // variables for controlling advancementSchedule, regressionSchedule, and when the experiment is finished
  //
  // can be read from either the csv files in public/ or via json if using the instrument playground

  let numberOfCorrectAnswers = 0;
  let numberOfTrialsRun = 1;
  let settingsParseResult;
  let stimuliListParseResult;
  let practiceRound1Success = false
  let totalNumberOfTrialsToRun = 4
  // languageMap for mapping speech dispatcher language to 
  // experiment language. If more languages are added the 
  // map should be expanded to reflect new choices
  const languageMap = {
    'en': 'en-US',
    'fr': 'fr-FR'
  }


  settingsParseResult = $Settings.safeParse(experimentSettingsJson);

  stimuliListParseResult = $WordPairStimulus.array().safeParse(stimuliList);
  if (!settingsParseResult.success) {
    throw new Error("validation error, check experiment settings", {
      cause: settingsParseResult.error,
    });
  }
  if (!stimuliListParseResult.success) {
    throw new Error("validation error, check stimuli list", {
      cause: stimuliListParseResult.error,
    });
  }
  const wordPairDB = stimuliListParseResult.data;
  const {
    advancementSchedule,
    regressionSchedule,
    language,
    numberOfLevels,
    seed,
    downloadOnFinish,
    initialDifficulty
  } = settingsParseResult.data;

  let numberOfRoundsPractice1 = settingsParseResult.data.numberOfRoundsPractice1;
  let numberOfRoundsPractice2 = settingsParseResult.data.numberOfRoundsPractice2;

  // small hack to get around i18n issues with wait for changeLanguage
  i18n.changeLanguage(language as Language);
  await new Promise(function(resolve) {
    i18n.onLanguageChange = resolve;
  });
  const indiciesSelected = new Set();
  /*
  functions for generating
  experimentStimuli
  specific to this experiment
  */

  let rng = xoroshiro128plus(seed);

  // closure
  function getRandomElementWithSeed(
    array: WordPairStimulus[],
  ): WordPairStimulus[] {
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

  // closure
  function createStimuli(
    difficultyLevel: number,
    language: string,
    clearSet: boolean,
  ): WordPairStimulus[] {
    if (clearSet === true) {
      indiciesSelected.clear();
    }
    let wordPairList: WordPairStimulus[] = wordPairDB.filter(
      (wordPair) =>
        wordPair.difficultyLevel === difficultyLevel &&
        wordPair.language === language,
    );
    let result = getRandomElementWithSeed(wordPairList);
    return result;
  }

  // to handle clicks on a touchscreen as a keyboard response
  function simulateKeyPress(jsPsych: JsPsych, key: string) {
    jsPsych.pluginAPI.keyDown(key);
    jsPsych.pluginAPI.keyUp(key);
  }
  //****************************
  //********EXPERIMENT**********
  //****************************
  // a timeline is a set of trials
  // a trial is a single object eg htmlKeyboardResponse etc ...
  const practiceRound1Timeline: any[] = []
  const practiceRound2Timeline: any[] = []
  const mainTimeline: any[] = [];

  (function() {
    let experimentStimuli = createStimuli(initialDifficulty, language, false);
    let currentDifficultyLevel = initialDifficulty;
    let practiceRound1ExperimentStimuli = createStimuli(-1, language, false);
    let practiceRound2ExperimentStimuli = createStimuli(-2, language, false);
    const jsPsych = initJsPsych({
      on_finish: function() {
        const data = jsPsych.data.get();
        if (downloadOnFinish) {
          transformAndDownload(data);
        }
        if (onFinish) {
          onFinish(transformAndExportJson(data));
        }
      },
    });
    // clickHandler to simulateKeyPress on touchscreen
    const clickHandler = () => simulateKeyPress(jsPsych, 'a')
    /* const textToSpeechKeyboard = {
      type: TextToSpeechKeyboardResponsePlugin,
      stimulus: "This is also a string",
      lang: "en_US",
    };
    const textToSpeech = {
      type: TextToSpeechButtonResponse,
      stimulus: "This is a string",
      lang: "en_US",
      choices: ["related", "unrelated"],
    };
*/
    const welcome = {
      on_start: function() {
        document.addEventListener(
          "click",
          clickHandler, { once: true },
        )
      },
      on_finish: function() {
        document.removeEventListener('click', clickHandler)
      },
      stimulus: i18n.t("welcome"),
      type: HtmlKeyboardResponsePlugin,
    };
    const practiceRound1WelcomePage = {
      on_start: function() {
        document.addEventListener(
          "click",
          clickHandler, { once: true },
        )
      },
      on_finish: function() {
        document.removeEventListener('click', clickHandler)
      },
      stimulus: i18n.t("practiceRound1Welcome"),
      type: HtmlKeyboardResponsePlugin,
    };

    const practiceRound2WelcomePage = {
      on_start: function() {
        document.addEventListener(
          "click",
          clickHandler, { once: true },
        )
      },
      on_finish: function() {
        document.removeEventListener('click', clickHandler)
      },
      stimulus: i18n.t("practiceRound2Welcome"),
      type: HtmlKeyboardResponsePlugin,
    };
    const preload = {
      auto_preload: true,
      message: `<p>loading stimulus</p>`,
      show_progress_bar: true,
      type: PreloadPlugin,
    };
    const blankPage = {
      on_start: function() {
        document.addEventListener(
          "click",
          clickHandler, { once: true },
        )
      },
      on_finish: function() {
        document.removeEventListener('click', clickHandler)
      },
      stimulus: "",
      type: HtmlKeyboardResponsePlugin,
    };

    const showWordPair = {
      type: TextToSpeechButtonResponse,
      on_finish: function(data) {
        data.userChoice = data.response === 0 ? 'related' : 'unrelated';  // using data.response instead
        data.feedback = data.userChoice === data.correctResponse ? 'correct' : 'incorrect';
      },
      lang: languageMap[language],
      stimulus: jsPsych.timelineVariable("stimulus"),
      choices: ['related', 'unrelated'],
      data: {
        correctResponse: jsPsych.timelineVariable('relation'),
      }
    };

    const showResults = {
      type: HtmlKeyboardResponsePlugin,
      stimulus: function() {
        // Get data from the last trial
        const lastTrial = jsPsych.data.get().last(1).values()[0];

        return `
      <div class="results-display">
        <h2>Results from previous trial:</h2>
        <p>Your response: ${lastTrial.response}</p>
        <p>Was correct: ${lastTrial.feedback}</p>
        <br>
        <p>Press any key to continue</p>
      </div>
    `;
      },
      data: {
        task: 'feedback'
      }
    };
    const logging = {
      autofocus: "textBox",
      button_label: i18n.t("submit"),
      data: {
        stimulus: jsPsych.timelineVariable("stimulus"),
        difficultyLevel: jsPsych.timelineVariable("difficultyLevel"),
        language: jsPsych.timelineVariable("language"),
      },
      html: function() {
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
      on_load: function() {
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
      preamble: function() {
        const html = `<h3>${i18n.t("correctResponse")}</h3>
                    <p>${jsPsych.evaluateTimelineVariable("correctResponse")}</p>
                    <img src="${jsPsych.evaluateTimelineVariable("stimulus")}" width="300" height="300">`;
        return DOMPurify.sanitize(html);
      },
      type: SurveyHtmlFormPlugin,
    };

    const practiceRound1 = {

      on_timeline_start: function() {
        this.timeline_variables = practiceRound1ExperimentStimuli;
      },
      timeline: [preload, blankPage, showWordPair, showResults, blankPage,],

      timeline_variables: practiceRound1ExperimentStimuli,

    }
    practiceRound1Timeline.push(practiceRound1)

    const practiceRound2 = {

      on_timeline_start: function() {
        this.timeline_variables = practiceRound2ExperimentStimuli;
      },
      timeline: [preload, blankPage, showWordPair, blankPage,],

      timeline_variables: practiceRound2ExperimentStimuli,

    }

    practiceRound2Timeline.push(practiceRound2)

    const mainTimelineTestProcedure = {
      // to reload the experimentStimuli after one repetition has been completed
      on_timeline_start: function() {
        this.timeline_variables = experimentStimuli;
      },
      timeline: [preload, blankPage, showWordPair, blankPage, logging],
      timeline_variables: experimentStimuli,
    };

    mainTimeline.push(mainTimelineTestProcedure);
    let currentPractice1Round = 1
    const practiceRound1Loop = {
      timeline: practiceRound1Timeline,
      loop_function: function() {
        if (currentPractice1Round === numberOfRoundsPractice1) {
          return false
        }
        currentPractice1Round++
        return true
      }
    }

    const loopNode = {
      timeline: mainTimeline,
      loop_function: function() {
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
    };
    //void jsPsych.run([welcome, loopNode]);
    void jsPsych.run([practiceRound1WelcomePage, practiceRound1Loop, practiceRound2WelcomePage, practiceRound2, welcome, loopNode]);
  })();
}

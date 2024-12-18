import type { Language } from "@opendatacapture/runtime-v1/@opendatacapture/runtime-core/index.js";

import { consoleLogData, transformAndExportJson } from "./dataMunger.ts";
import { experimentSettingsJson } from "./experimentSettings.ts";
import i18n from "./i18n.ts";
import {
  $Settings,
  $WordPairStimulus,
  type WordPairStimulus,
  type WordPairTrial,
} from "./schemas.ts";
import { stimuliList } from "./stimuliList.ts";
import { stimuliListPractice1 } from "./stimuliListPractice1.ts";
import { stimuliListPractice2 } from "./stimuliListPractice2.ts";
import TextToSpeechButtonResponse from "./textToSpeechButtonResponse.ts";
// import TextToSpeechKeyboardResponsePlugin from "./textToSpeechKeyboardResponse.ts";

import InstructionsPlugin from "@opendatacapture/runtime-v1/@jspsych/plugin-instructions@2.x/index.js";

import "./styles/instuctions.css";
import "./styles/resultBoxes.css";
import "./styles/wordPair.css"

import { HtmlButtonResponsePlugin } from "/runtime/v1/@jspsych/plugin-html-button-response@2.x";
import { HtmlKeyboardResponsePlugin } from "/runtime/v1/@jspsych/plugin-html-keyboard-response@2.x";
// import { ImageKeyboardResponsePlugin } from "/runtime/v1/@jspsych/plugin-image-keyboard-response@2.x";
import { PreloadPlugin } from "/runtime/v1/@jspsych/plugin-preload@2.x";
import { initJsPsych } from "/runtime/v1/jspsych@8.x";
import { JsPsych } from "/runtime/v1/jspsych@8.x";
import PureRand, {
  uniformIntDistribution,
  xoroshiro128plus,
} from "/runtime/v1/pure-rand@6.x";

export async function adaptiveSemanticJudgementTask() {
  //****************************
  //****EXPERIMENT_SETTINGS*****
  //****************************

  let numberOfCorrectAnswers = 0;
  let numberOfTrialsRun = 1;
  let settingsParseResult;
  let totalNumberOfTrialsToRun = 8;
  let relationResults: string[] = []

  // languageMap for mapping speech dispatcher language to
  // experiment language. If more languages are added the
  // map should be expanded to reflect new choices
  const languageMap = {
    en: "en-US",
    fr: "fr-FR",
  };
  // parse settings
  settingsParseResult = $Settings.safeParse(experimentSettingsJson);

  if (!settingsParseResult.success) {
    throw new Error("validation error, check experiment settings", {
      cause: settingsParseResult.error,
    });
  }

  // parse stimuli lists
  function validateStimuliList(
    data: WordPairStimulus[],
    name: string,
  ): WordPairStimulus[] {
    const result = $WordPairStimulus.array().safeParse(data);
    if (!result.success) {
      throw new Error(`validation error, check ${name} stimuli list`, {
        cause: result.error,
      });
    }
    if (result.data.length === 0) {
      throw new Error(`${name} stimuli list cannot be empty`);
    }
    return result.data;
  }

  const wordPairDB = validateStimuliList(stimuliList, "main");
  const wordPairDBPractice1 = validateStimuliList(
    stimuliListPractice1,
    "practice1",
  );
  const wordPairDBPractice2 = validateStimuliList(
    stimuliListPractice2,
    "practice2",
  );

  const {
    advancementSchedule,
    regressionSchedule,
    language,
    numberOfLevels,
    initialDifficulty,
  } = settingsParseResult.data;

  let seed: number | undefined;
  if (typeof settingsParseResult.data.seed === "number") {
    seed = settingsParseResult.data.seed;
  }

  // small hack to get around i18n issues with wait for changeLanguage
  i18n.changeLanguage(language as Language);
  await new Promise(function(resolve) {
    i18n.onLanguageChange = resolve;
  });

  /*
  functions for generating
  experimentStimuli
  specific to this experiment
  */
  let rng: PureRand.RandomGenerator;
  if (seed) {
    rng = xoroshiro128plus(seed);
  } else {
    seed = Date.now() ^ (Math.random() * 0x100000000);
    rng = xoroshiro128plus(seed);
  }

  // closure
  const indiciesSelected = new Set();
  function getRandomElementWithSeed(
    array: WordPairStimulus[],
  ): WordPairStimulus[] {
    let randomIndex: number;
    let foundUnique = false;

    // if all stimuli at a given difficultyLevel have been shown clear the set
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
    random: boolean,
    wordPairDB: WordPairStimulus[],
    relation?: 'related' | 'unrelated',
  ): WordPairStimulus[] {

    if (clearSet === true) {
      indiciesSelected.clear();
    }
    let wordPairList: WordPairStimulus[] = [];

    if (relation) {
      wordPairList = wordPairDB.filter((wordPair) => {
        return wordPair.difficultyLevel === difficultyLevel &&
          wordPair.language === language &&
          wordPair.relation === relation;
      });
    } else {
      wordPairList = wordPairDB.filter((wordPair) => {
        return wordPair.difficultyLevel === difficultyLevel &&
          wordPair.language === language;
      });
    }

    // if array is empty clear the set and try again
    if (wordPairList.length === 0) {
      indiciesSelected.clear();

      if (relation) {
        wordPairList = wordPairDB.filter((wordPair) => {
          return wordPair.difficultyLevel === difficultyLevel &&
            wordPair.language === language &&
            wordPair.relation === relation;
        });
      } else {
        wordPairList = wordPairDB.filter((wordPair) => {
          return wordPair.difficultyLevel === difficultyLevel &&
            wordPair.language === language;
        });
      }
    }

    let result;
    if (random) {
      result = getRandomElementWithSeed(wordPairList);
    } else {
      // this will suppply the whole list instead of one element
      // this is because the practice rounds always show the same
      // elements in the same order
      result = wordPairList;
    }
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

  const mainTimeline: any[] = [];

  (function() {
    let experimentStimuli = createStimuli(
      initialDifficulty,
      language,
      false,
      true,
      wordPairDB,
    );
    let currentDifficultyLevel = initialDifficulty;
    let practiceRound1ExperimentStimuli = createStimuli(
      1,
      language,
      false,
      false,
      wordPairDBPractice1,
    );
    let practiceRound2ExperimentStimuli = createStimuli(
      1,
      language,
      false,
      false,
      wordPairDBPractice2,
    );
    const jsPsych = initJsPsych({
      on_finish: function() {
        const data = jsPsych.data.get();
        transformAndExportJson(data);
        consoleLogData(data, "text-to-speech-button-response");
      },
    });
    // clickHandler to simulateKeyPress on touchscreen
    const clickHandler = () => simulateKeyPress(jsPsych, "a");
    const welcome = {
      on_start: function() {
        document.addEventListener("click", clickHandler, { once: true });
      },
      on_finish: function() {
        document.removeEventListener("click", clickHandler);
      },
      stimulus: i18n.t("welcome"),
      type: HtmlKeyboardResponsePlugin,
    };
    const instructionsUser = {
      type: InstructionsPlugin,
      pages: [
        i18n.t("setup1"),
        i18n.t("setup2"),
        i18n.t("setup3"),
        i18n.t("instructions1"),
        i18n.t("instructions2"),
        i18n.t("instructions3"),
        i18n.t("instructions4"),
        i18n.t("instructions5"),
      ],
      show_clickable_nav: true,
    };
    // const instructions = {
    //   stimulus: function () {
    //     const html = `
    //       <div class="instructions-container">
    //        <div class="instructions-content">
    //         <h1>${i18n.t("task.title")}</h1>
    //
    //          <div class="instructions-intro">
    //           <p>${i18n.t("task.intro")}</p>
    //          </div>
    //
    //         <ul class="instructions-steps">
    //           <li class="instructions-step">${i18n.t("task.step1")}</li>
    //           <li class="instructions-step">${i18n.t("task.step2")}</li>
    //           <li class="instructions-step">${i18n.t("task.step3")}</li>
    //           <li class="instructions-step">${i18n.t("task.step4")}</li>
    //           <li class="instructions-step">${i18n.t("task.step5")}</li>
    //           <li class="instructions-step">${i18n.t("task.step6")}</li>
    //           <li class="instructions-step">${i18n.t("task.step7")}</li>
    //         </ul>
    //
    //         <div class="instructions-completion">
    //           <p>${i18n.t("task.completion")}</p>
    //         </div>
    //       </div>
    //     </div>
    //     `;
    //     return html;
    //   },
    //   choices: [i18n.t("continue")],
    //   type: HtmlButtonResponsePlugin,
    // };
    const practiceRound1WelcomePage = {
      on_start: function() {
        document.addEventListener("click", clickHandler, { once: true });
      },
      on_finish: function() {
        document.removeEventListener("click", clickHandler);
      },
      stimulus: i18n.t("practiceRound1Welcome"),
      choices: [i18n.t("continue")],
      type: HtmlButtonResponsePlugin,
    };

    const practiceRound2WelcomePage = {
      on_start: function() {
        document.addEventListener("click", clickHandler, { once: true });
      },
      on_finish: function() {
        document.removeEventListener("click", clickHandler);
      },
      stimulus: i18n.t("practiceRound2Welcome"),
      choices: [i18n.t("continue")],
      type: HtmlButtonResponsePlugin,
    };

    const experimentWelcomePage = {
      on_start: function() {
        document.addEventListener("click", clickHandler, { once: true });
      },
      on_finish: function() {
        document.removeEventListener("click", clickHandler);
      },
      stimulus: i18n.t("taskBegin"),
      choices: [i18n.t("continue")],
      type: HtmlButtonResponsePlugin,
    };

    const preload = {
      auto_preload: true,
      message: `<p>loading stimulus</p>`,
      show_progress_bar: true,
      type: PreloadPlugin,
    };

    const blankPage = {
      on_start: function() {
        document.addEventListener("click", clickHandler, { once: true });
      },
      on_finish: function() {
        document.removeEventListener("click", clickHandler);
      },
      stimulus: "",
      choices: [i18n.t("continue")],
      type: HtmlButtonResponsePlugin,
    };

    const showWordPairOneWord = {
      type: TextToSpeechButtonResponse,
      on_finish: function(data: WordPairTrial) {
        data.userChoice = data.response === 0 ? "related" : "unrelated";
        data.result =
          data.userChoice === data.correctResponse ? "correct" : "incorrect";
      },
      on_load: function() {
        document.querySelectorAll(".jspsych-btn").forEach((btn) => {
          (btn as HTMLElement).style.setProperty("opacity", "0", "important");
        });
        const element = document.querySelector(
          "#jspsych-text-to-speech-button-response-prompt",
        )!;
        if (element instanceof HTMLElement) {
          element.style.setProperty("opacity", "0", "important");
        }
      },
      lang: languageMap[language],
      stimulus: jsPsych.timelineVariable("stimulus"),
      prompt: ".",
      choices: [".", "."],
      trial_duration_after_utterence: 300,
      enable_button_after: 400,

      data: {
        correctResponse: jsPsych.timelineVariable("relation"),
        difficultyLevel: jsPsych.timelineVariable("difficultyLevel"),
      },
    };
    const showWordPairTwoWord = {
      type: TextToSpeechButtonResponse,
      on_finish: function(data: WordPairTrial) {
        data.userChoice = data.response === 0 ? "related" : "unrelated";
        data.result =
          data.userChoice === data.correctResponse ? "correct" : "incorrect";
      },
      hide_buttons_while_speaking: true,
      read_stimulus: false,
      read_prompt: true,
      prompt: jsPsych.timelineVariable("prompt"),
      lang: languageMap[language],
      stimulus: jsPsych.timelineVariable("stimulus"),
      trial_duration_after_utterence: 7000,
      choices: ["related", "unrelated"],
      data: {
        correctResponse: jsPsych.timelineVariable("relation"),
        difficultyLevel: jsPsych.timelineVariable("difficultyLevel"),
      },
    };

    const showResults = {
      type: HtmlKeyboardResponsePlugin,
      stimulus: function() {
        // Get data from the last trial
        const lastTrial = jsPsych.data
          .get()
          .last(1)
          .values()[0] as WordPairTrial;
        if (lastTrial.result === "correct") {
          return `
            <div class="results-display correct-box">
            <h2> Correct!</h2>
            </div>`;
        } else {
          return `
            <div class="results-display incorrect-box">
            <h2> Incorrect!</h2>
            </div>`;
        }
      },
      trial_duration: 1000,
      data: {
        task: "feedback",
      },
    };

    const practiceRound1 = {
      on_timeline_start: function() {
        this.timeline_variables = practiceRound1ExperimentStimuli;
      },
      timeline: [
        preload,
        blankPage,
        showWordPairOneWord,
        showWordPairTwoWord,
        showResults,
      ],
      timeline_variables: practiceRound1ExperimentStimuli,
    };
    //practiceRound1Timeline.push(practiceRound1);

    const practiceRound2 = {
      on_timeline_start: function() {
        this.timeline_variables = practiceRound2ExperimentStimuli;
      },
      timeline: [
        preload,
        blankPage,
        showWordPairOneWord,
        showWordPairTwoWord,
      ],

      timeline_variables: practiceRound2ExperimentStimuli,
    };

    const mainTimelineTestProcedure = {
      // to reload the experimentStimuli after one repetition has been completed
      on_timeline_start: function() {
        this.timeline_variables = experimentStimuli;
      },
      timeline: [
        preload,
        blankPage,
        showWordPairOneWord,
        showWordPairTwoWord,
      ],
      timeline_variables: experimentStimuli,
    };

    mainTimeline.push(mainTimelineTestProcedure);

    // start at 2 as it runs one to begin with
    let practice1Trials = 2;
    const practice1LoopNode = {
      timeline: [practiceRound1],
      loop_function: function() {
        practiceRound1ExperimentStimuli = createStimuli(
          practice1Trials,
          language,
          false,
          false,
          wordPairDBPractice1,
        );
        // let the target number here equal n+1 where n is how many trials you want to run
        // ie for 5 trials practice1Trials === 6
        if (practice1Trials === 6) {
          return false;
        } else {
          practice1Trials++;
          return true;
        }
      },
    };

    // start at 2 as it runs one to begin with
    let practice2Trials = 2;
    const practice2LoopNode = {
      timeline: [practiceRound2],
      loop_function: function() {
        practiceRound2ExperimentStimuli = createStimuli(
          practice2Trials,
          language,
          false,
          false,
          wordPairDBPractice2,
        );
        // let the target number here equal n+1 where n is how many trials you want to run
        // ie for 5 trials practice1Trials === 6
        if (practice2Trials === 6) {
          return false;
        } else {
          practice2Trials++;
          return true;
        }
      },
    };

    const loopNode = {
      timeline: mainTimeline,
      loop_function: function() {
        // tracking number of corret answers
        // need to access logging trial info
        let clearSet = false;
        if (numberOfTrialsRun === totalNumberOfTrialsToRun) {
          return false;
        }

        // getting the most recent result
        const resultArray = jsPsych.data
          .get()
          .filter({ trial_type: "text-to-speech-button-response" })
          .values() as WordPairTrial[];
        const lastTrialIndex = resultArray.length - 1;
        const lastTrialResults: WordPairTrial = resultArray[lastTrialIndex]!;



        if (lastTrialResults.result === "correct") {
          numberOfCorrectAnswers++;
          clearSet = false;
        } else if (lastTrialResults.result === "incorrect") {
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
        // don't want 3 of the same answer in a row
        if (relationResults.length < 2 || relationResults[relationResults.length - 1] !== relationResults[relationResults.length - 2]) {
          relationResults.push(lastTrialResults.relation)
          experimentStimuli = createStimuli(
            currentDifficultyLevel,
            language,
            clearSet,
            true,
            wordPairDB,
          );
        } else {
          relationResults.push(lastTrialResults.relation)
          const relation = relationResults[relationResults.length - 1] === 'related' ? 'unrelated' : 'related'
          experimentStimuli = createStimuli(
            currentDifficultyLevel,
            language,
            clearSet,
            true,
            wordPairDB,
            relation,
          );

        }
        numberOfTrialsRun++;
        return true;
      },
    };

    void jsPsych.run([
      welcome,
      instructionsUser,
      practiceRound1WelcomePage,
      practice1LoopNode,
      practiceRound2WelcomePage,
      practice2LoopNode,
      experimentWelcomePage,
      loopNode,
    ]);
  })();
}

import PureRand, {
  uniformIntDistribution,
  xoroshiro128plus,
} from "/runtime/v1/pure-rand@6.x";

import { transformAndExportJson } from "./dataMunger.ts";
import { experimentSettingsJson } from "./experimentSettings.ts";
import {
  $Settings,
  $WordPairStimulus,
  type WordPairStimulus,
  type WordPairTrial,
} from "./schemas.ts";
import { stimuliList } from "./stimuliList.ts";
import { stimuliListPractice1 } from "./stimuliListPractice1.ts";
import { stimuliListPractice2 } from "./stimuliListPractice2.ts";
import pluginCreator from "./textToSpeechButtonResponse.ts";
import { translator } from "./translator.ts";

import "./instuctions.css";
import "./resultBoxes.css";
import "./wordPair.css";

export async function adaptiveSemanticJudgementTask(
  onFinish?: (data: any) => void,
) {
  // need to do dynamic imports to satisfy ODC instrument bundler
  const { HtmlButtonResponsePlugin } = await import(
    "/runtime/v1/@jspsych/plugin-html-button-response@2.x/index.js"
  );
  const { default: InstructionsPlugin } = await import(
    "/runtime/v1/@jspsych/plugin-instructions@2.x/index.js"
  );
  const { HtmlKeyboardResponsePlugin } = await import(
    "/runtime/v1/@jspsych/plugin-html-keyboard-response@2.x/index.js"
  );
  const { PreloadPlugin } = await import(
    "/runtime/v1/@jspsych/plugin-preload@2.x/index.js"
  );
  const { initJsPsych } = await import("/runtime/v1/jspsych@8.x/index.js");
  type JsPsych = import("/runtime/v1/jspsych@8.x/index.js").JsPsych;
  const TextToSpeechButtonResponse = await pluginCreator();

  //****************************
  //****EXPERIMENT_SETTINGS*****
  //****************************

  let numberOfCorrectAnswers = 0;
  let numberOfIncorrectAnswers = 0;
  let numberOfTrialsRun = 1;
  const totalNumberOfTrialsToRun = 8;
  const relationResults: string[] = [];
  const settingsParseResult = $Settings.safeParse(experimentSettingsJson);

  // languageMap for mapping speech dispatcher language to
  // experiment language. If more languages are added the
  // map should be expanded to reflect new choices
  const languageMap = {
    en: "en-US",
    fr: "fr-FR",
  };

  // parse settings
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
    relation?: "related" | "unrelated",
  ): WordPairStimulus[] {
    if (clearSet === true) {
      indiciesSelected.clear();
    }
    let wordPairList: WordPairStimulus[] = [];

    if (relation) {
      wordPairList = wordPairDB.filter((wordPair) => {
        return (
          wordPair.difficultyLevel === difficultyLevel &&
          wordPair.language === language &&
          wordPair.relation === relation
        );
      });
    } else {
      wordPairList = wordPairDB.filter((wordPair) => {
        return (
          wordPair.difficultyLevel === difficultyLevel &&
          wordPair.language === language
        );
      });
    }

    // if array is empty clear the set and try again
    if (wordPairList.length === 0) {
      indiciesSelected.clear();

      if (relation) {
        wordPairList = wordPairDB.filter((wordPair) => {
          return (
            wordPair.difficultyLevel === difficultyLevel &&
            wordPair.language === language &&
            wordPair.relation === relation
          );
        });
      } else {
        wordPairList = wordPairDB.filter((wordPair) => {
          return (
            wordPair.difficultyLevel === difficultyLevel &&
            wordPair.language === language
          );
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

  (function () {
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
      on_finish: function () {
        const data = jsPsych.data.get();
        if (onFinish) {
          onFinish(transformAndExportJson(data, numberOfTrialsRun));
        }
      },
    });
    // clickHandler to simulateKeyPress on touchscreen
    const clickHandler = () => simulateKeyPress(jsPsych, "a");
    const welcome = {
      on_start: function () {
        document.addEventListener("click", clickHandler, { once: true });
      },
      on_finish: function () {
        document.removeEventListener("click", clickHandler);
      },
      stimulus: translator.t("welcome"),
      type: HtmlKeyboardResponsePlugin,
    };
    const instructionsUser = {
      type: InstructionsPlugin,
      pages: [
        translator.t("setup1"),
        translator.t("setup2"),
        translator.t("setup3"),
        translator.t("instructions1"),
        translator.t("instructions2"),
        translator.t("instructions3"),
        translator.t("instructions4"),
        translator.t("instructions5"),
      ],
      show_clickable_nav: true,
    };
    const practiceRound1WelcomePage = {
      on_start: function () {
        document.addEventListener("click", clickHandler, { once: true });
      },
      on_finish: function () {
        document.removeEventListener("click", clickHandler);
      },
      stimulus: translator.t("practiceRound1Welcome"),
      choices: [translator.t("continue")],
      type: HtmlButtonResponsePlugin,
    };

    const practiceRound2WelcomePage = {
      on_start: function () {
        document.addEventListener("click", clickHandler, { once: true });
      },
      on_finish: function () {
        document.removeEventListener("click", clickHandler);
      },
      stimulus: translator.t("practiceRound2Welcome"),
      choices: [translator.t("continue")],
      type: HtmlButtonResponsePlugin,
    };

    const experimentWelcomePage = {
      on_start: function () {
        document.addEventListener("click", clickHandler, { once: true });
      },
      on_finish: function () {
        document.removeEventListener("click", clickHandler);
      },
      stimulus: translator.t("taskBegin"),
      choices: [translator.t("continue")],
      type: HtmlButtonResponsePlugin,
    };

    const preload = {
      auto_preload: true,
      message: `<p>loading stimulus</p>`,
      show_progress_bar: true,
      type: PreloadPlugin,
    };

    const blankPage = {
      on_start: function () {
        document.addEventListener("click", clickHandler, { once: true });
      },
      on_finish: function () {
        document.removeEventListener("click", clickHandler);
      },
      stimulus: "",
      choices: [translator.t("continue")],
      type: HtmlButtonResponsePlugin,
    };

    const showWordPairOneWord = {
      type: TextToSpeechButtonResponse,
      on_load: function () {
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
      trial_duration_after_utterance: 300,
      enable_button_after: 400,
      data: {
        correctResponse: jsPsych.timelineVariable("relation"),
        difficultyLevel: jsPsych.timelineVariable("difficultyLevel"),
      },
    };
    const showWordPairTwoWord = {
      type: TextToSpeechButtonResponse,
      on_finish: function (data: WordPairTrial) {
        if (data.response != null) {
          data.userChoice = data.response === 0 ? "related" : "unrelated";
          data.result =
            data.userChoice === data.correctResponse ? "correct" : "incorrect";
        } else {
          data.userChoice = "timeout";
          data.result = "incorrect";
        }
      },
      hide_buttons_while_speaking: true,
      read_stimulus: false,
      read_prompt: true,
      prompt: jsPsych.timelineVariable("prompt"),
      lang: languageMap[language],
      stimulus: jsPsych.timelineVariable("stimulus"),
      trial_duration_after_utterance: 7000,
      choices: ["related", "unrelated"],
      data: {
        language: language,
        prompt: jsPsych.timelineVariable("prompt"),
        correctResponse: jsPsych.timelineVariable("relation"),
        difficultyLevel: jsPsych.timelineVariable("difficultyLevel"),
      },
    };

    const showResults = {
      type: HtmlKeyboardResponsePlugin,
      stimulus: function () {
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
      on_timeline_start: function () {
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
      on_timeline_start: function () {
        this.timeline_variables = practiceRound2ExperimentStimuli;
      },
      timeline: [preload, blankPage, showWordPairOneWord, showWordPairTwoWord],

      timeline_variables: practiceRound2ExperimentStimuli,
    };

    const mainTimelineTestProcedure = {
      // to reload the experimentStimuli after one repetition has been completed
      on_timeline_start: function () {
        this.timeline_variables = experimentStimuli;
      },
      timeline: [preload, blankPage, showWordPairOneWord, showWordPairTwoWord],
      timeline_variables: experimentStimuli,
    };

    mainTimeline.push(mainTimelineTestProcedure);

    // start at 2 as it runs one to begin with
    let practice1Trials = 2;
    const practice1LoopNode = {
      timeline: [practiceRound1],
      loop_function: function () {
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
      loop_function: function () {
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
      loop_function: function () {
        // tracking number of corret answers
        // need to access logging trial info
        let clearSet = false;

        // exit out of loop if number of correct number of trials has been run
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
          numberOfIncorrectAnswers = 0;
          clearSet = false;
        } else if (lastTrialResults.result === "incorrect") {
          numberOfIncorrectAnswers++;
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
        } else if (numberOfIncorrectAnswers === regressionSchedule) {
          if (currentDifficultyLevel > 1) {
            currentDifficultyLevel--;
          }
        }
        // don't want 3 of the same answer in a row
        // so check that the last two are not the same
        if (
          relationResults.length < 2 ||
          !(
            relationResults[relationResults.length - 1] ===
              relationResults[relationResults.length - 2] &&
            relationResults[relationResults.length - 1] ===
              lastTrialResults.correctResponse
          )
        ) {
          relationResults.push(lastTrialResults.correctResponse);
          experimentStimuli = createStimuli(
            currentDifficultyLevel,
            language,
            clearSet,
            true,
            wordPairDB,
          );
        } else {
          relationResults.push(lastTrialResults.correctResponse);
          const relation =
            relationResults[relationResults.length - 1] === "related"
              ? "unrelated"
              : "related";
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
        // keep looping
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

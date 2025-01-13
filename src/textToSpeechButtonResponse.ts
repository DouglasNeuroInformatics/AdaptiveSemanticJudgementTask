// import { version } from "../package.json";

import type {
  JsPsychPlugin,
  PluginInfo,
  TrialType,
} from "/runtime/v1/jspsych@8.x";

import { JsPsych, ParameterType } from "/runtime/v1/jspsych@8.x";

const version = "1.0";
const info = {
  name: "text-to-speech-button-response",
  version: version,
  parameters: {
    /** The text to be displayed and converted into speech. */
    stimulus: {
      type: ParameterType.STRING,
      default: undefined,
    },
    /** Labels for the buttons. Each different string in the array will generate a different button. */
    choices: {
      type: ParameterType.STRING,
      default: undefined,
      array: true,
    },
    /**
     * This is for set the languge of voice of the speechSynthesis API
     * Fallback to 'en-US'
     * These depend on the voices avaiable to the system.
     * Some browsers come with local languges, e.g. Google Chrome comes with a number of languages like 'en-US', 'en-GB', 'fr-FR', 'de-DE' ... etc.
     * Firefox comes with none and depends on the system to have voices for speechSynthesis
     */
    lang: {
      type: ParameterType.STRING,
      default: "en-US",
    },
    /**
     * A function that generates the HTML for each button in the `choices` array. The function gets the string of the item in the `choices` array and should return valid HTML. If you want to use different markup for each button, you can do that by using a conditional on either parameter. The default parameter returns a button element with the text label of the choice.
     */
    button_html: {
      type: ParameterType.FUNCTION,
      default: function (choice: string) {
        return `<button class="jspsych-btn">${choice}</button>`;
      },
    },
    /** This string can contain HTML markup. Any content here will be displayed below the stimulus. The intention is that it can be used to provide a reminder about the action the participant is supposed to take (e.g., which key to press). */
    prompt: {
      type: ParameterType.HTML_STRING,
      default: null,
    },
    read_stimulus: {
      type: ParameterType.BOOL,
      default: true,
    },
    read_prompt: {
      type: ParameterType.BOOL,
      default: false,
    },
    hide_buttons_while_speaking: {
      type: ParameterType.BOOL,
      default: false,
    },
    /** How long to display the stimulus in milliseconds. The visibility CSS property of the stimulus will be set to `hidden` after this time has elapsed. If this is null, then the stimulus will remain visible until the trial ends. */
    stimulus_duration: {
      type: ParameterType.INT,
      default: null,
    },
    /** How long to wait for the participant to make a response before ending the trial in milliseconds. If the participant fails to make a response before this timer is reached, the participant's response will be recorded as null for the trial and the trial will end. If the value of this parameter is null, the trial will wait for a response indefinitely.  */
    trial_duration: {
      type: ParameterType.INT,
      default: null,
    },
    /** How long to wait for the participant to make a response before ending the trial after utternce is finished in milliseconds. If the participant fails to make a response before this timer is reached, the participant's response will be recorded as null for the trial and the trial will end. If the value of this parameter is null, the trial will wait for a response indefinitely.  */
    trial_duration_after_utterence: {
      type: ParameterType.INT,
      default: null,
    },
    /** Setting to `'grid'` will make the container element have the CSS property `display: grid` and enable the use of `grid_rows` and `grid_columns`. Setting to `'flex'` will make the container element have the CSS property `display: flex`. You can customize how the buttons are laid out by adding inline CSS in the `button_html` parameter. */ button_layout:
      {
        type: ParameterType.STRING,
        default: "grid",
      },
    /**
     * The number of rows in the button grid. Only applicable when `button_layout` is set to `'grid'`. If null, the number of rows will be determined automatically based on the number of buttons and the number of columns.
     */
    grid_rows: {
      type: ParameterType.INT,
      default: 1,
    },
    /**
     * The number of columns in the button grid. Only applicable when `button_layout` is set to `'grid'`. If null, the number of columns will be determined automatically based on the number of buttons and the number of rows.
     */
    grid_columns: {
      type: ParameterType.INT,
      default: null,
    },
    /** If true, then the trial will end whenever the participant makes a response (assuming they make their response before the cutoff specified by the `trial_duration` parameter). If false, then the trial will continue until the value for `trial_duration` is reached. You can set this parameter to `false` to force the participant to view a stimulus for a fixed amount of time, even if they respond before the time is complete. */
    response_ends_trial: {
      type: ParameterType.BOOL,
      default: true,
    },
    /** How long the button will delay enabling in milliseconds. */
    enable_button_after: {
      type: ParameterType.INT,
      default: 0,
    },
  },
  data: {
    /** The response time in milliseconds for the participant to make a response. The time is measured from when the stimulus first appears on the screen until the participant's response. */
    rt: {
      type: ParameterType.INT,
    },
    /** Indicates which button the participant pressed. The first button in the `choices` array is 0, the second is 1, and so on. */
    response: {
      type: ParameterType.INT,
    },
    /** The HTML content that was displayed on the screen. */
    stimulus: {
      type: ParameterType.HTML_STRING,
    },
  },
} satisfies PluginInfo;

type Info = typeof info;
/**
 * **text-to-speech-button**
 *
 * Displays text, reads to participant using SpeechSynthesis, has buttons for responses.
 *
 * @author Cian Monnin
 * @see {@link https://github.com/jspsych/jspsych-contrib/packages/plugin-text-to-speech-button/README.md}}
 */
class TextToSpeechButtonResponse implements JsPsychPlugin<Info> {
  static info = info;

  constructor(private jsPsych: JsPsych) {
    this.jsPsych = jsPsych;
  }

  trial(display_element: HTMLElement, trial: TrialType<Info>) {
    // Display stimulus
    const stimulusElement = document.createElement("div");
    stimulusElement.id = "jspsych-text-to-speech-button-response-stimulus";
    stimulusElement.innerHTML = trial.stimulus;
    display_element.appendChild(stimulusElement);

    // Show prompt if there is one
    if (trial.prompt) {
      const promptElement = document.createElement("div");
      promptElement.id = "prompt";
      promptElement.id = "jspsych-text-to-speech-button-response-prompt";
      promptElement.innerHTML = trial.prompt;
      display_element.appendChild(promptElement);
    }
    // Display buttons
    const buttonGroupElement = document.createElement("div");
    buttonGroupElement.id = "jspsych-text-to-speech-btngroup";
    if (trial.button_layout === "grid") {
      buttonGroupElement.classList.add("jspsych-btn-group-grid");
      if (trial.grid_rows === null && trial.grid_columns === null) {
        throw new Error(
          "You cannot set `grid_rows` to `null` without providing a value for `grid_columns`.",
        );
      }
      const n_cols =
        trial.grid_columns === null
          ? Math.ceil(trial.choices.length / trial.grid_rows)
          : trial.grid_columns;

      const n_rows =
        trial.grid_rows === null
          ? Math.ceil(trial.choices.length / trial.grid_columns)
          : trial.grid_rows;
      buttonGroupElement.style.gridTemplateColumns = `repeat(${n_cols}, 1fr)`;
      document.querySelectorAll(".jspsych-btn").forEach((btn) => {
        (btn as HTMLElement).style.display = "none";
      });
      buttonGroupElement.style.gridTemplateRows = `repeat(${n_rows}, 1fr)`;
    } else if (trial.button_layout === "flex") {
      buttonGroupElement.classList.add("jspsych-btn-group-flex");
    }

    for (let index = 0; index < trial.choices.length; index++) {
      const choice = trial.choices[index]!

      buttonGroupElement.insertAdjacentHTML(
        "beforeend",
        trial.button_html!(choice, index),
      );
    }
    
    for (const [choiceIndex, choice] of trial.choices.entries()) {
      buttonGroupElement.insertAdjacentHTML(
        "beforeend",
        trial.button_html!(choice, choiceIndex),
      );
      const buttonElement = buttonGroupElement.lastChild as HTMLElement;
      buttonElement.dataset.choice = choiceIndex.toString();
      buttonElement.addEventListener("click", () => {
        after_response(choiceIndex);
      });
    }

    display_element.appendChild(buttonGroupElement);

    if (trial.hide_buttons_while_speaking === true) {
      const buttons = buttonGroupElement.querySelectorAll("button");
      buttons.forEach((btn) => {
        // make buttons invisible so that text doesn't move around
        btn.style.setProperty("opacity", "0", "important");
        // prevents clicking while invisible
        btn.style.setProperty("pointer-events", "none", "important");
      });
    }

    // start time
    const start_time = performance.now();

    // store response
    const response = {
      rt: null,
      button: null,
    };

    const end_trial = () => {
      const trial_data = {
        rt: response.rt,
        stimulus: trial.stimulus,
        response: response.button,
      };
      // move on to the next trial
      this.jsPsych.finishTrial(trial_data);
    };

    // function to handle responses by the subject
    function after_response(choice) {
      // measure rt
      const end_time = performance.now();
      const rt = Math.round(end_time - start_time);
      response.button = parseInt(choice);
      response.rt = rt;

      // after a valid response, the stimulus will have the CSS class 'responded'
      // which can be used to provide visual feedback that a response was recorded
      stimulusElement.classList.add("responded");

      // disable all the buttons after a response
      for (const button of buttonGroupElement.children) {
        button.setAttribute("disabled", "disabled");
      }

      if (trial.response_ends_trial) {
        end_trial();
      }
    }

    // hide image if timing is set
    if (trial.stimulus_duration !== null) {
      this.jsPsych.pluginAPI.setTimeout(() => {
        stimulusElement.style.visibility = "hidden";
      }, trial.stimulus_duration);
    }

    // disable all the buttons and set a timeout that enables them after a specified delay if timing is set
    if (trial.enable_button_after > 0) {
      var btns = document.querySelectorAll(
        ".jspsych-text-to-speech-button-response-button button",
      );
      for (var i = 0; i < btns.length; i++) {
        btns[i].setAttribute("disabled", "disabled");
      }
      this.jsPsych.pluginAPI.setTimeout(() => {
        var btns = document.querySelectorAll(
          ".jspsych-text-to-speech-button-response-button button",
        );
        for (var i = 0; i < btns.length; i++) {
          btns[i].removeAttribute("disabled");
        }
      }, trial.enable_button_after);
    }

    // Set up SpeechSytnthesis
    let words: string[] = [];
    if (trial.read_stimulus === true) {
      words.push(trial.stimulus.split(" "));
    }
    if (trial.read_prompt) {
      words.push(trial.prompt.split(" "));
    }

    function speakNextWord(jspsych) {
      const utterance = new SpeechSynthesisUtterance(words);
      utterance.lang = trial.lang;

      speechSynthesis.speak(utterance);
      utterance.onend = () => {
        if (trial.hide_buttons_while_speaking) {
          document.querySelectorAll("button").forEach((btn) => {
            btn.style.setProperty("opacity", "1", "important");
            btn.style.setProperty("pointer-events", "auto", "important");
          });
        }

        if (trial.trial_duration_after_utterence !== null) {
          jspsych.pluginAPI.setTimeout(
            end_trial,
            trial.trial_duration_after_utterence,
          );
        }
      };
    }
    speakNextWord(this.jsPsych);

    // end trial if time limit is set
    if (trial.trial_duration !== null) {
      this.jsPsych.pluginAPI.setTimeout(end_trial, trial.trial_duration);
    }
  }
}

export default TextToSpeechButtonResponse;

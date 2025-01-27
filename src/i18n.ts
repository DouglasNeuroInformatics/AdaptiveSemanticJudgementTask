import { createI18Next } from "/runtime/v1/@opendatacapture/runtime-core";
export default function i18nSetUp() {
  const i18n = createI18Next({
    translations: {
      welcome: {
        en: "Welcome. Press any key to begin",
        fr: "Bienvenue. Appuyez sur n'importe quelle touche pour commencer",
      },
      practiceRound1Welcome: {
        en: "Practice Round 1",
        fr: "Séance d'entraînement 1",
      },
      practiceRound2Welcome: {
        en: "Practice Round 2",
        fr: "Séance d'entraînement 2",
      },
      taskBegin: {
        en: "Press continue to start the task",
        fr: "Appuyez sur Continuer pour démarrer la tâche",
      },
      correctResponse: {
        en: "Correct response:",
        fr: "La réponse correcte est:",
      },
      loadingStimulus: {
        en: "Loading stimulus",
        fr: "Stimulus de chargement",
      },
      logResponse: {
        en: "Log the response",
        fr: "Enregistrer la réponse",
      },
      correct: {
        en: "Correct",
        fr: "Correct",
      },
      incorrect: {
        en: "Incorrect",
        fr: "Incorrect",
      },
      responseWas: {
        en: "The response was:",
        fr: "La réponse a été donnée:",
      },
      logNotes: {
        en: "Log any other notes here",
        fr: "Inscrivez ici toute autre note",
      },
      logResponseToContinue: {
        en: "Log response and press submit to continue",
        fr: "Enregistrez la réponse et appuyez sur 'soumettre' pour continuer",
      },
      submit: {
        en: "Submit",
        fr: "Soumettre",
      },
      continue: {
        en: "Continue",
        fr: "Continuer",
      },

      setup1: {
        en: "Before we start, let's get you set up. For the following task, you will need to be able to hear audio on your device.",
        fr: "Avant de commencer, préparons-nous. Pour cette tâche, vous devrez pouvoir entendre l'audio sur votre appareil",
      },
      setup2: {
        en: "Please find a quiet place, free from any background noises. Set your phone to 'Do not disturb mode'",
        fr: "Veuillez trouver un endroit calme, sans bruits de fond. Mettez votre téléphone en 'mode Ne pas déranger'",
      },
      setup3: {
        en: "Make sure your sound is on and adjust your audio to a comfortable level",
        fr: "Assurez-vous que le son est activé et réglez votre audio à un niveau confortable",
      },
      instructions1: {
        en: "In this task you will see two words. You must decide whether the two words are RELATED or UNRELATED",
        fr: "Dans cette tâche, vous verrez deux mots. Vous devez décider si les deux mots sont LIÉS ou NON LIÉS",
      },
      instructions2: {
        en: "You can respond by pressing the buttons on your screen. Please respond as soon as you know the answer",
        fr: "Vous pouvez répondre en appuyant sur les boutons à l'écran. Veuillez répondre dès que vous connaissez la réponse",
      },
      instructions3: {
        en: "Here are some examples of RELATED words: BLUE RED",
        fr: "Voici des exemples de mots LIÉS : BLEU ROUGE",
      },
      instructions4: {
        en: "Here are some examples of UNRELATED words: BLUE LIKE. These words are not related",
        fr: "Voici des exemples de mots NON LIÉS : BLEU AIMER. Ces mots ne sont pas liés",
      },
      instructions5: {
        en: "Let's try some practice rounds. Remember to respond as soon as you know the answer",
        fr: "Essayons quelques tours de pratique. N'oubliez pas de répondre dès que vous connaissez la réponse",
      },
      task: {
        title: {
          en: "Task Administrator Instructions",
          fr: "Instructions de l'administrateur des tâches",
        },
        intro: {
          en: "This task requires a task administrator. They are responsible for accurate data collection.",
          fr: "Cette tâche nécessite un administrateur. Il est responsable de la collecte précise des données.",
        },
        step1: {
          en: "A page will be shown before the image. When ready click 'continue'",
          fr: "Une page sera affichée avant l'image. Lorsque vous êtes prêt, cliquez sur 'continuer'",
        },
        step2: {
          en: "There will be 500 ms pause then the image will be displayed and a time will start in the background",
          fr: "Il y aura une pause de 500 ms, puis l'image sera affichée et un chronomètre démarrera en arrière-plan",
        },
        step3: {
          en: "When the participant has given their response a key-press or mouse-click will stop the timer and the image will disappear",
          fr: "Lorsque le participant aura donné sa réponse, une pression sur une touche ou un clic de souris arrêtera le chronomètre et l'image disparaîtra",
        },
        step4: {
          en: "A new screen will be shown asking that the machine be given back to the task administrator",
          fr: "Un nouvel écran s'affichera demandant que la machine soit rendue à l'administrateur de la tâche",
        },
        step5: {
          en: "If the image was skipped by accident it can be repeated via this screen.",
          fr: "Si l'image a été ignorée par accident, elle peut être répétée via cet écran.",
        },
        step6: {
          en: "The next screen will be for logging the response and any extra notes that are to be recorded",
          fr: "L'écran suivant servira à enregistrer la réponse et toutes les notes supplémentaires à consigner",
        },
        step7: {
          en: "After the results have been recorded a new page will be displayed and the steps are repeated",
          fr: "Après l'enregistrement des résultats, une nouvelle page s'affichera et les étapes seront répétées",
        },
        completion: {
          en: "Once all images have been displayed and all results have been recorded the data will be sent to Open Data Capture (if being used) and/or downloaded as .csv if parameters of the experiment have been set as such",
          fr: "Une fois que toutes les images ont été affichées et que tous les résultats ont été enregistrés, les données seront envoyées à Open Data Capture (si utilisé) et/ou téléchargées au format .csv si les paramètres de l'expérience ont été définis comme tels",
        },
      },
      yes: {
        en: "Yes",
        fr: "Oui",
      },
      no: {
        en: "No",
        fr: "Non",
      },
    },
  });
  return i18n;
}

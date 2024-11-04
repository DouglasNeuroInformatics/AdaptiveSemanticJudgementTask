import { createI18Next } from "/runtime/v1/@opendatacapture/runtime-core";

document.documentElement.setAttribute("lang", "en");
const languageMap = {
  'en': 'en-US',
  'fr': 'fr-FR'
}
const i18n = createI18Next({
  translations: {
    welcome: {
      en: "Welcome. Press any key to begin",
      fr: "Bienvenue. Appuyez sur n'importe quelle touche pour commencer",
    },
    practiceRound1Welcome: {
      en: 'Practice Round 1',
      fr: "Séance d'entraînement 1",
    },
    practiceRound2Welcome: {
      en: 'Practice Round 1',
      fr: "Séance d'entraînement 1",
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
  },
});
// the whole i18n implementation needs to be changed
document.addEventListener("changeLanguage", function(event) {
  // @ts-expect-error the event does have a detail
  document.documentElement.setAttribute("lang", event.detail as string);
});
export default i18n;

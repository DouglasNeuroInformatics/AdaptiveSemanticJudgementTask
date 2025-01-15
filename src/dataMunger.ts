import { $ExperimentResults } from "./schemas.ts";

import type { ExperimentResults, WordPairTrial } from "./schemas.ts";
import type { DataCollection } from "/runtime/v1/jspsych@8.x";

function dataMunger(data: DataCollection, numberOfTrialsToRun: number) {
  const trials = data
    .filterCustom((trial: WordPairTrial) => {
      return (
        trial.trial_type === "text-to-speech-button-response" &&
        (trial.result === "correct" || trial.result === "incorrect")
      );
    })
    .values() as WordPairTrial[];
  const experimentResults: ExperimentResults[] = [];
  for (let trial of trials) {
    const result = $ExperimentResults.parse({
      language: trial.language,
      // not required for further processing
      relation: trial.correctResponse,
      // not required for further processing
      responseResult: trial.result,
      prompt: trial.prompt,
      stimulus: trial.stimulus,
      correctResponse: trial.correctResponse,
      response: trial.response,
      difficultyLevel: trial.difficultyLevel,
      rt: trial.rt,
      userChoice: trial.userChoice,
      result: trial.result,
    });
    experimentResults.push(result);
  }
  const arrayLength = experimentResults.length;
  const indexToSlice = arrayLength - numberOfTrialsToRun;
  return experimentResults.slice(indexToSlice);
}

// not used
function arrayToCSV(array: ExperimentResults[]) {
  const header = Object.keys(array[0]!).join(",");
  const trials = array
    .map((trial) => Object.values(trial).join(","))
    .join("\n");
  return `${header}\n${trials}`;
}

// not used
function downloadCSV(dataForCSV: string, filename: string) {
  const blob = new Blob([dataForCSV], { type: "text/csv;charset=utf8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function getLocalTime() {
  const localTime = new Date();

  const year = localTime.getFullYear();
  // months start at 0 so add 1
  const month = String(localTime.getMonth() + 1).padStart(2, "0");
  const day = String(localTime.getDate()).padStart(2, "0");
  const hours = String(localTime.getHours()).padStart(2, "0");
  const minutes = String(localTime.getMinutes()).padStart(2, "0");
  const seconds = String(localTime.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;
}

// for ODC
function exportToJsonSerializable(data: ExperimentResults[]): {
  [key: string]: unknown;
} {
  return {
    version: "1.0",
    timestamp: getLocalTime(),
    experimentResults: data.map((result) => ({
      word_pair: result.stimulus + result.prompt,
      correctResponse: result.correctResponse,
      response: result.response,
      userChoice: result.userChoice,
      difficultyLevel: result.difficultyLevel,
      language: result.language,
      rt: result.rt,
    })),
  };
}

export function transformAndDownload(
  data: DataCollection,
  numberOfTrialsToRun: number,
) {
  const mungedData = dataMunger(data, numberOfTrialsToRun);
  const dataForCSV = arrayToCSV(mungedData);
  const currentDate = getLocalTime();
  downloadCSV(dataForCSV, `${currentDate}.csv`);
}
export function transformAndExportJson(
  data: DataCollection,
  numberOfTrialsToRun: number,
): any {
  const mungedData = dataMunger(data, numberOfTrialsToRun);
  const jsonSerializableData = exportToJsonSerializable(mungedData);
  return JSON.parse(JSON.stringify(jsonSerializableData));
}

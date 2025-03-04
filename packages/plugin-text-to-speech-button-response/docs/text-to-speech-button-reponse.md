# text-to-speech-button-response

Displays text, reasd to participant using SpeechSynthesis, has buttons for responses

## Parameters

In addition to the [parameters available in all plugins](https://jspsych.org/latest/overview/plugins.md#parameters-available-in-all-plugins), this plugin accepts the following parameters. Parameters with a default value of undefined must be specified. Other parameters can be left unspecified if the default value is acceptable.

| Parameter | Type | Default Value | Description |
| --------- | ---- | ------------- | ----------- |
|           |      |               |             |

## Data Generated

In addition to the [default data collected by all plugins](https://jspsych.org/latest/overview/plugins.md#data-collected-by-all-plugins), this plugin collects the following data for each trial.

| Name | Type | Value |
| ---- | ---- | ----- |
|      |      |       |

## Install

Using the CDN-hosted JavaScript file:

```js
<script src="https://unpkg.com/@jspsych-contrib/plugin-text-to-speech-button-response"></script>
```

Using the JavaScript file downloaded from a GitHub release dist archive:

```js
<script src="jspsych/plugin-text-to-speech-button-response.js"></script>
```

Using NPM:

```
npm install @jspsych-contrib/plugin-text-to-speech-button-response
```

```js
import TextToSpeechButtonResponse from "@jspsych-contrib/plugin-text-to-speech-button-response";
```

## Examples

### Title of Example

```javascript
var trial = {
  type: jsPsychTextToSpeechButtonResponse,
};
```

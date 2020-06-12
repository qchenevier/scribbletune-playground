import * as scribble from "scribbletune";

const session = new scribble.Session();

const synthParams = Tone.PolySynth.defaults;

const polySynth = new Tone.PolySynth(5, Tone.Synth, synthParams);

const synthChannel = session.createChannel({
  instrument: polySynth,
  clips: [
    {
      notes: scribble.getChordsByProgression("C3 major", "V V V V I I I I"),
      pattern: "[x---][x---][x---][x---]xxxx",
    },
    {
      notes: scribble.getChordsByProgression("C4 major", "I II V I I"),
      pattern: "[x---]".repeat(4) + "x__-",
    },
  ],
});

session.startRow(0);

Tone.Transport.bpm.value = 120;

import React from "react";
import ReactDOM from "react-dom";

import "bootstrap/dist/css/bootstrap.min.css";

import Form from "@rjsf/core";

import toJsonSchema from "to-json-schema";
import { Container, Col, Button } from "react-bootstrap";

const toJsonOptions = {
  postProcessFnc: function forceIntegersToBeNumbers(
    type,
    schema,
    value,
    defaultFunc
  ) {
    if (type === "integer" || type === "number") {
      schema.type = "number";
      return { ...schema, multipleOf: 0.005 };
    } else {
      return defaultFunc(type, schema, value);
    }
  },
};
const schema = toJsonSchema(synthParams.voice.defaults, toJsonOptions);

const PlayPause = () => {
  var [isPlaying, setIsplaying] = React.useState(false);
  React.useEffect(() => {
    isPlaying ? Tone.Transport.start() : Tone.Transport.stop();
  });

  return (
    <Button variant="primary" onClick={() => setIsplaying(!isPlaying)}>
      ▶️ Play
    </Button>
  );
};

const App = () => {
  var [formData, setFormData] = React.useState(synthParams.voice.defaults);
  React.useEffect(() => {
    polySynth.set(formData);
  });

  var bpmSchema = { type: "integer", minimum: 0, maximum: 250 };
  var [bpm, setBpm] = React.useState(Tone.Transport.bpm.value);
  React.useEffect(() => {
    Tone.Transport.bpm.value = bpm;
  });

  return (
    <Container fluid="sm">
      <div>Schema</div>
      <PlayPause />
      <Form
        schema={bpmSchema}
        formData={bpm}
        onSubmit={(e) => setBpm(e.formData)}
      />
      <Form
        schema={schema}
        formData={formData}
        onSubmit={(e) => setFormData(e.formData)}
      />
    </Container>
  );
};

ReactDOM.render(<App />, document.querySelector("#root"));

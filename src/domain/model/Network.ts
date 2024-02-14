type NeuralNetwork = {
  levels: Level[];
};

const createNetwork = (neuronCounts: number[]) => {
  const levels = [];
  for (let i = 0; i < neuronCounts.length - 1; i++) {
    levels.push(createLevel(neuronCounts[i], neuronCounts[i + 1]));
  }

  return {
    levels,
  };
};

const feedForwardNetwork = (givenInputs: Level['inputs'], network: NeuralNetwork) => {
  let outputs = feedForwardLevel(givenInputs, network.levels[0]);

  for (let i = 1; i < network.levels.length; i++) {
    outputs = feedForwardLevel(outputs, network.levels[i]);
    network.levels[i].outputs = outputs;
  }
  return {outputs, network};
};

type Level = {
  inputs: any[];
  outputs: any[];
  biases: any[];
  weights: any[];
};

const createLevel = (inputCount: number, outputCount: number): Level => {
  const weights = [];

  for (let i = 0; i < inputCount; i++) {
    weights[i] = new Array(outputCount);
  }

  const level = {
    inputs: new Array(inputCount),
    outputs: new Array(outputCount),
    biases: new Array(outputCount),
    weights: Array.from({length: inputCount}).map(() => Array.from({length: outputCount})),
  };

  return randomize(level);
};

const randomize = (level: Level) => {
  for (let i = 0; i < level.inputs.length; i++) {
    for (let j = 0; j < level.outputs.length; j++) {
      level.weights[i][j] = Math.random() * 2 - 1;
    }
  }

  for (let i = 0; i < level.biases.length; i++) {
    level.biases[i] = Math.random() * 2 - 1;
  }
  return level;
};

const feedForwardLevel = (givenInputs: Level['inputs'], level: Level): Level['outputs'] => {
  const outputs: Level['outputs'] = [];
  for (let i = 0; i < level.inputs.length; i++) {
    level.inputs[i] = givenInputs[i];
  }

  for (let i = 0; i < level.outputs.length; i++) {
    let sum = 0;
    for (let j = 0; j < level.inputs.length; j++) {
      sum += level.inputs[j] * level.weights[j][i];
    }
    if (sum > level.biases[i]) {
      outputs[i] = 1;
    } else {
      outputs[i] = 0;
    }
  }
  return outputs;
};

export {createNetwork, feedForwardNetwork, randomize};
export type {NeuralNetwork, Level};

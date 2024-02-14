import {NeuralNetwork, feedForwardNetwork} from '@/domain/model/Network';
import {useCallback, useRef} from 'react';

const useNetwork = (network: NeuralNetwork) => {
  const networkRef = useRef(network);

  const updateNetwork = useCallback((offsets: number[]) => {
    const {outputs, network} = feedForwardNetwork(offsets, networkRef.current);
    networkRef.current = network;

    return outputs;
  }, []);

  return {networkRef, updateNetwork};
};

export {useNetwork};

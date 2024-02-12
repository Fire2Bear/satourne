import Canvas from '@/components/Canvas';
import styled from 'styled-components';

const Background = styled.div`
  margin: 0;
  width: 100vw;
  background-color: darkgray;
  overflow: hidden;
  text-align: center;
`;

export default function Index() {
  return (
    <Background>
      <Canvas />
    </Background>
  );
}

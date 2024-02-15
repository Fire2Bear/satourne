import Canvas from '@/components/Canvas';
import styled from 'styled-components';

const Background = styled.div`
  margin: 0;
  width: 100vw;
  background-color: darkgray;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default function Index() {
  return (
    <Background>
      <Canvas />
    </Background>
  );
}

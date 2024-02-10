
import styled from 'styled-components';
import Canvas from './Canvas';

const Body = styled.div`
    margin: 0;
    background: darkgray;
    overflow: hidden;
    text-align: center;

`



const App = () => {

  return (
    <Body className="App">
      <Canvas />
    </Body>
  );
}

export default App;

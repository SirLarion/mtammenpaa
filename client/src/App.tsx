import React from "react";
import styled from "styled-components";
import { Routes, Route } from "react-router-dom";

const StyledApp = styled.div`
  min-height: 100vh;
  max-width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow-x: hidden;
`;

const App = () => {
  return (
    <StyledApp>
      <Routes>
        <Route path="/" element={<div>Hello world!</div>} />
      </Routes>
    </StyledApp>
  );
};

export default App;

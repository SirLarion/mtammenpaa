import styled from 'styled-components';

const View = styled.div`
  @media (max-width: 499px) {
    width: 100vw;
    padding: 1.5rem;
  }
  @media (min-width: 500px) {
    width: 72vw;
    padding: 3rem;
  }
  min-height: 110vh;
  border-radius: 1rem;
  background-color: ${p => p.theme.background.primary};
`;

export const Layout = { View };

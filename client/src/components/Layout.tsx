import styled from 'styled-components';

import { SMALL_SCREEN_PX } from '../constants';
import { LARGE, REGULAR } from '../styles/theme';

const View = styled.div`
  @media (max-width: ${SMALL_SCREEN_PX}px) {
    width: 98vw;
    padding: ${LARGE};
  }
  width: 72vw;
  padding: 3rem;
  min-height: 110vh;
  border-radius: ${REGULAR};
  background-color: ${p => p.theme.background.mono};
`;

export const Layout = { View };

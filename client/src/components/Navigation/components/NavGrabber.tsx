import React, { FC, MutableRefObject, TouchEventHandler } from 'react';
import styled from 'styled-components';
import { SMALL, TINY } from '../../../styles/theme';

export interface INavGrabberProps {
  ref: MutableRefObject<HTMLDivElement | null>;
  onTouchStart: TouchEventHandler<HTMLDivElement>;
  onTouchMove: TouchEventHandler<HTMLDivElement>;
  onTouchEnd: TouchEventHandler<HTMLDivElement>;
}

const StyledGrabber = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 2px;
  padding: ${TINY} 0;
  align-items: center;
  width: 100%;

  border-radius: ${SMALL} ${SMALL} 0 0;

  background-color: ${p => p.theme.background.rainbow};
`;

const Line = styled.div`
  height: 3px;
  width: 6rem;
  border-radius: ${TINY};
  background-color: ${p => p.theme.background.monoStrong};
`;

export const NavGrabber: FC<INavGrabberProps> = props => {
  return (
    <StyledGrabber {...props}>
      <Line />
      <Line />
      <Line />
    </StyledGrabber>
  );
};

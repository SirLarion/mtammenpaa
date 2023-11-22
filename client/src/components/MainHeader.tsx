import React, { FC, forwardRef } from 'react';
import styled from 'styled-components';
import useMeasure from 'react-use-measure';

import { useIsSmallScreen } from '../hooks/useIsSmallScreen';

import { Heading1 } from '../styles/typography';
import { REGULAR } from '../styles/theme';

import avatar from '../assets/profile.jpg';
import { SMALL_SCREEN_PX } from '../constants';

const Header = styled.header<{ $small: boolean }>`
  display: flex;
  align-items: center;
  position: relative;
  width: 100%;
  padding: ${REGULAR};
  img {
    width: 6rem;
    height: 6rem;
  }

  h1 {
    margin: 0.8rem 0 0 2rem;
    color: ${p => p.theme.accent.rainbow};
  }

  @media (max-width: ${SMALL_SCREEN_PX}px) {
    img {
      width: 3rem;
      height: 3rem;
    }
    h1 {
      word-spacing: -4px;
      font-size: 8.5vw;
      margin: 0rem 0 0 1rem;
    }
  }

  text-anchor: center;
`;

const AvatarImg = styled.img`
  border-radius: 100%;
`;

export const MainHeader = forwardRef<HTMLElement>(function MainHeader(_, ref) {
  const isSmallScreen = useIsSmallScreen();

  return (
    <Header $small={isSmallScreen} ref={ref}>
      <AvatarImg
        src={avatar}
        alt="Small Miska Tammenpää with a beanie on his eyes stopping the evil photons from disturbing his slumber."
      />
      <Heading1>Miska Tammenpää</Heading1>
    </Header>
  );
});

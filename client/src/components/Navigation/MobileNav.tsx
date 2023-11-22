import React, { FC, useState } from 'react';
import styled, { useTheme } from 'styled-components';
import { useSpring, animated, config } from '@react-spring/web';

import { HUGE, REGULAR, SMALL, TINY, TTheme } from '../../styles/theme';
import { INavCommonProps, BaseMenuItem } from './common';
import { NavGrabber } from './components/NavGrabber';
import { FakeBorder } from '../FakeBorder';
import { useTap } from '../../hooks/useTap';
import { useGrab } from './hooks/useGrab';

const StyledMenuItem = styled(animated(BaseMenuItem))`
  padding: ${SMALL} ${REGULAR};
  font-size: ${REGULAR};
`;

const MenuItemList = styled.ul`
  display: flex;
  justify-content: center;
  align-items: center;
  list-style-type: none;
  height: 3.5rem;
  width: 100%;
  padding: ${TINY} ${REGULAR};
  background-color: ${p => p.theme.background.rainbow};
`;

const Padding = styled.div`
  padding-bottom: 1rem;
  background-color: ${p => p.theme.background.rainbow};
`;

const StyledMobileNav = styled(animated.nav)`
  position: fixed;
  bottom: calc(env(safe-area-inset-bottom) - 1rem);
  left: 0;
  right: 0;
`;

const MenuItem: FC<INavCommonProps['items'][number]> = ({
  icon,
  label,
  path,
}) => {
  const theme = useTheme() as TTheme;
  const { tapped, tapHandler } = useTap();

  const tapSpring = useSpring({
    background: tapped ? theme.accent.rainbowLight : theme.background.rainbow,
    config: config.stiff,
  });

  return (
    <StyledMenuItem style={tapSpring} onClick={tapHandler} to={path}>
      {icon && icon}
      {label}
    </StyledMenuItem>
  );
};

export interface IMobileNavProps extends INavCommonProps {
  show: boolean;
}

export const MobileNav: FC<IMobileNavProps> = ({ items, show }) => {
  // const grabProps = useGrab();
  const spring = useSpring({
    transform: show ? 'translateY(0rem)' : 'translateY(3.25rem)',
    config: config.stiff,
  });
  return (
    <StyledMobileNav style={spring}>
      <FakeBorder.Bottom />
      <MenuItemList>
        {items.map((item, i) => (
          <MenuItem key={`${i}${item.path}`} {...item} />
        ))}
      </MenuItemList>
      <Padding />
    </StyledMobileNav>
  );
};

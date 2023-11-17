import React, { FC, ReactNode } from 'react';
import styled from 'styled-components';

import { REGULAR, TINY } from '../../styles/theme';
import { BaseMenuItem, INavCommonProps } from './common';

const StyledMainNavigation = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: space-between;
`;

const MenuItem = styled(BaseMenuItem)`
  border-bottom: ${TINY} solid ${p => p.theme.accent.rainbowLight};
  padding: ${REGULAR};
`;

const LeftMenu = styled.nav`
  flex: 1;
`;

const RightMenu = styled(LeftMenu)``;

const MenuHeader = styled.header`
  min-height: 10rem;
`;

const MenuItemList = styled.ul`
  list-style-type: none;
  width: 100%;
  padding: 0 1rem;

  a:not(a:last-of-type) {
    margin-bottom: 0.5rem;
  }
`;

export interface IDesktopNavProps extends INavCommonProps {
  children: ReactNode;
}

export const DesktopNav: FC<IDesktopNavProps> = ({ items, children }) => {
  return (
    <StyledMainNavigation>
      <LeftMenu>
        <MenuHeader />
        <MenuItemList>
          {items.map(({ label, path, icon }, i) => (
            <MenuItem key={`${i}${path}`} to={path}>
              {icon && icon}
              {label}
            </MenuItem>
          ))}
        </MenuItemList>
      </LeftMenu>
      <div>{children}</div>
      <RightMenu></RightMenu>
    </StyledMainNavigation>
  );
};

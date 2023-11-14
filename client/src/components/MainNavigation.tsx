import React, { FC, ReactNode } from 'react';
import styled from 'styled-components';

import { noSelect } from '../styles/common';
import { Link } from '../styles/typography';

interface INavItem {
  label: ReactNode;
  path: string;
}

export interface IMainNavigationProps {
  items: INavItem[];
  children: ReactNode;
}

const StyledMainNavigation = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: space-between;
`;

const MenuItem = styled(Link)`
  display: block;
  font-size: 1.25rem;
  font-weight: 800;
  color: ${p => p.theme.accent.rainbow} !important;
  text-decoration: none;
  background-color: ${p => p.theme.background.rainbow};
  padding: 1rem;
  border-radius: 0.25rem;
  border-bottom: 0.25rem solid ${p => p.theme.accent.rainbowLight};
  cursor: pointer;
  transition: background-color 100ms ease-in-out;
  ${noSelect}

  &:hover {
    background-color: ${p => p.theme.accent.rainbowLight};
  }
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

export const MainNavigation: FC<IMainNavigationProps> = ({
  items,
  children,
}) => {
  return (
    <StyledMainNavigation>
      <LeftMenu>
        <MenuHeader />
        <MenuItemList>
          {items.map((navItem, i) => (
            <MenuItem key={`${i}${navItem.path}`} to={navItem.path}>
              {navItem.label}
            </MenuItem>
          ))}
        </MenuItemList>
      </LeftMenu>
      <div>{children}</div>
      <RightMenu></RightMenu>
    </StyledMainNavigation>
  );
};

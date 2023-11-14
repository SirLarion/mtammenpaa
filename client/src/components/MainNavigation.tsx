import React, { FC, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

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

const LeftMenu = styled.nav`
  width: 16rem;
`;

const RightMenu = styled(LeftMenu)``;

const MenuHeader = styled.header`
  min-height: 5rem;
`;

const MenuItem = styled.li``;

export const MainNavigation: FC<IMainNavigationProps> = ({
  items,
  children,
}) => {
  return (
    <StyledMainNavigation>
      <LeftMenu>
        <MenuHeader />
        <ul>
          {items.map((navItem, i) => (
            <MenuItem key={`${i}${navItem.path}`}>
              <Link to={navItem.path}>{navItem.label}</Link>
            </MenuItem>
          ))}
        </ul>
      </LeftMenu>
      <div>{children}</div>
      <RightMenu></RightMenu>
    </StyledMainNavigation>
  );
};

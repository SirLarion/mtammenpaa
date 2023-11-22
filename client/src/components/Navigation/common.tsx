import { ReactNode } from 'react';
import styled from 'styled-components';
import { noSelect } from '../../styles/common';
import { TINY } from '../../styles/theme';

import { Link } from '../../styles/typography';

interface INavItem {
  label: ReactNode;
  path: string;
  icon?: ReactNode;
}

export interface INavCommonProps {
  items: INavItem[];
}

export const BaseMenuItem = styled(Link)`
  display: flex;
  align-items: center;
  font-size: 1.25rem;
  font-weight: 800;
  border-radius: ${TINY};
  color: ${p => p.theme.accent.rainbow} !important;
  text-decoration: none;
  background-color: ${p => p.theme.background.rainbow};
  cursor: pointer;
  transition: background-color 100ms ease-in-out;
  ${noSelect}

  svg {
    margin: 0 0.5rem 0.25rem 0;
  }

  &:hover {
    background-color: ${p => p.theme.accent.rainbowLight};
  }
`;

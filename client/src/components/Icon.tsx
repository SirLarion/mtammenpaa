import React, { FC } from 'react';
import styled from 'styled-components';
import { HomeSimpleDoor } from 'iconoir-react';

import { theme } from '../styles/theme';

const StyledIcon = styled.svg``;

interface IIconProps {
  color?: string;
}

const Home: FC<IIconProps> = ({
  color = theme.light.foreground.primary,
  ...rest
}) => <HomeSimpleDoor width={24} height={24} color={color} {...rest} />;

const Heart: FC<IIconProps> = ({
  color = theme.light.foreground.primary,
  ...rest
}) => (
  <StyledIcon
    width="24"
    height="24"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    {...rest}
  >
    <path
      fill="none"
      stroke={color}
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2.5"
      d="M19.5 12.572L12 20l-7.5-7.428A5 5 0 1 1 12 6.006a5 5 0 1 1 7.5 6.572"
    />
  </StyledIcon>
);

const Bulb: FC<IIconProps> = ({
  color = theme.light.foreground.primary,
  ...rest
}) => (
  <StyledIcon
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...rest}
  >
    <path
      d="M9 18H15"
      stroke={color}
      stroke-width="2.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    ></path>
    <path
      d="M10 21H14"
      stroke={color}
      stroke-width="2.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    ></path>
    <path
      d="M9.00082 15C9.00098 13 8.50098 12.5 7.50082 11.5C6.50067 10.5 6.02422 9.48689 6.00082 8C5.95284 4.95029 8.00067 3 12.0008 3C16.001 3 18.0488 4.95029 18.0008 8C17.9774 9.48689 17.5007 10.5 16.5008 11.5C15.501 12.5 15.001 13 15.0008 15"
      stroke={color}
      stroke-width="2.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    ></path>
  </StyledIcon>
);

const Coffee: FC<IIconProps> = ({
  color = theme.light.foreground.primary,
  ...rest
}) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...rest}
  >
    <path
      d="M17 11.6V15C17 18.3137 14.3137 21 11 21H9C5.68629 21 3 18.3137 3 15V11.6C3 11.2686 3.26863 11 3.6 11H16.4C16.7314 11 17 11.2686 17 11.6Z"
      stroke={color}
      stroke-width="2.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    ></path>
    <path
      d="M12 9C12 8 12.7143 7 14.1429 7V7C15.7208 7 17 5.72081 17 4.14286V3.5"
      stroke={color}
      stroke-width="2.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    ></path>
    <path
      d="M8 9V8.5C8 6.84315 9.34315 5.5 11 5.5V5.5C12.1046 5.5 13 4.60457 13 3.5V3"
      stroke={color}
      stroke-width="2.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    ></path>
    <path
      d="M16 11H18.5C19.8807 11 21 12.1193 21 13.5C21 14.8807 19.8807 16 18.5 16H17"
      stroke={color}
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    ></path>
  </svg>
);

export const Icon = {
  Bulb,
  Coffee,
  Heart,
  Home,
};

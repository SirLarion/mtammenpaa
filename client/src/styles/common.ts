import { css } from "styled-components";

export const hideScrollbar = css`
  scrollbar-width: none;
  ::-webkit-scrollbar {
    display: none;
  }
`;

export const noSelect = css`
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
`;

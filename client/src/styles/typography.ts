import styled, { css } from "styled-components";
import { theme } from "./theme";

export const textBase = css`
  font-family: "Montserrat";
  color: ${theme.dark.foreground.primary};
`;

export const Heading1 = styled.h1`
  ${textBase}
  font-size: 4.5rem;
`;

export const Heading2 = styled.h2`
  ${textBase}
  font-size: 3rem;
`;

export const Heading3 = styled.h3`
  ${textBase}
  font-size: 1.5rem;
`;

export const Heading4 = styled.h4`
  ${textBase}
  font-size: 1.1rem;
`;

export const Text = styled.p`
  ${textBase}
  font-size: 1rem;
`;

export const TextStrong = styled(Text)`
  font-weight: 900;
`;

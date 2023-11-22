import React, { FC } from 'react';
import styled from 'styled-components';
import { REGULAR, TINY } from '../styles/theme';

const FakeBorderContainer = styled.div`
  display: flex;
  padding: 0 ${TINY};
`;

const TopBorderContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
`;

const TopPadding = styled.div`
  height: ${TINY};
  background-color: ${p => p.theme.background.rainbow};
`;

const BgSquare = styled.div`
  background-color: ${p => p.theme.background.rainbow};
`;

const Square = styled.div<{ isTop: boolean }>`
  width: ${REGULAR};
  height: ${REGULAR};
  background-color: ${p => p.theme.background.mono};
`;

const BorderLeft = styled(Square)`
  border-radius: ${p => (p.isTop ? `${REGULAR} 0 0 0` : `0 0 0 ${REGULAR}`)};
`;
const BorderRight = styled(Square)`
  border-radius: ${p => (p.isTop ? `0 ${REGULAR} 0 0` : `0 0 ${REGULAR} 0`)};
`;

const Middle = styled.div`
  flex: 1;
`;

const Top = () => {
  return (
    <TopBorderContainer>
      <TopPadding />
      <FakeBorderContainer>
        <BgSquare>
          <BorderLeft isTop={true} />
        </BgSquare>
        <Middle />
        <BgSquare>
          <BorderRight isTop={true} />
        </BgSquare>
      </FakeBorderContainer>
    </TopBorderContainer>
  );
};

const Bottom = () => (
  <FakeBorderContainer>
    <BgSquare>
      <BorderLeft isTop={false} />
    </BgSquare>
    <Middle />
    <BgSquare>
      <BorderRight isTop={false} />
    </BgSquare>
  </FakeBorderContainer>
);

export const FakeBorder = {
  Top,
  Bottom,
};

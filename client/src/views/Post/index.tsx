import React, { FC } from 'react';
import styled from 'styled-components';

import { textBase } from '../../styles/typography';
import { Layout } from '../../components/Layout';
import { useGetPostContent } from './hooks/useGetPostContent';

export interface IPostProps {
  postId: string;
}

const StyledPost = styled(Layout.View)`
  ${textBase}

  h2 {
    font-size: 3rem;
  }

  p:not(p:last-of-type) {
    margin-bottom: 2rem;
  }
`;

export const Post: FC<IPostProps> = ({ postId }) => {
  const { html } = useGetPostContent(postId);
  return <StyledPost dangerouslySetInnerHTML={html} />;
};

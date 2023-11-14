import React, { FC, ReactNode } from 'react';

import { Heading2, Heading4 } from '../styles/typography';

export interface IPageTitleProps {
  title: ReactNode;
  subTitle?: ReactNode;
}

export const PageTitle: FC<IPageTitleProps> = ({ title, subTitle }) => {
  return (
    <div>
      <Heading2>{title}</Heading2>
      {subTitle && <Heading4>{subTitle}</Heading4>}
    </div>
  );
};

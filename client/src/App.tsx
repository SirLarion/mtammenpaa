import React from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { Routes, Route } from 'react-router-dom';
import useMeasure from 'react-use-measure';
import { ResizeObserver } from '@juggle/resize-observer';

import { Intro } from './views/Intro';
import { Blog } from './views/Blog';
import { Post } from './views/Post';
import {
  DesktopNav,
  MobileNav,
  INavCommonProps,
} from './components/Navigation';
import { Icon } from './components/Icon';
import { Portfolio } from './views/Portfolio';
import { MainHeader } from './components/MainHeader';
import { SMALL_SCREEN_PX } from './constants';
import { FakeBorder } from './components/FakeBorder';

import { useGetAllBlogPosts } from './hooks/useGetAllBlogPosts';
import { useThemeControl } from './hooks/useThemeControl';
import { useIsSmallScreen } from './hooks/useIsSmallScreen';
import { useScrollHandler } from './hooks/useScrollHandler';

const StyledApp = styled.div`
  max-width: 100vw;
  background-color: ${p => p.theme.background.rainbow};
`;

const Body = styled.section`
  width: 100%;

  @media (max-width: ${SMALL_SCREEN_PX}px) {
    display: flex;
    justify-content: center;
  }
`;

const Footer = styled.footer`
  min-height: 5rem;
  width: 100%;
`;

const App = () => {
  const { theme, toggleTheme } = useThemeControl();
  const { scrollPos, scrollDir } = useScrollHandler();
  const { posts } = useGetAllBlogPosts();
  const [ref, { height }] = useMeasure();
  const isSmallScreen = useIsSmallScreen();
  const navItems: INavCommonProps['items'] = [
    {
      label: 'Hello',
      path: '/',
      icon: <Icon.Heart color={theme.accent.rainbow} />,
    },
    {
      label: 'Stuff',
      path: '/stuff',
      icon: <Icon.Bulb color={theme.accent.rainbow} />,
    },
    {
      label: 'Blog',
      path: '/blog',
      icon: <Icon.Coffee color={theme.accent.rainbow} />,
    },
    // ...posts.map(post => ({
    //   label: post.title,
    //   path: `/blog/${post.id}`,
    // })),
  ];

  return (
    <ThemeProvider theme={theme}>
      <StyledApp>
        {isSmallScreen ? (
          <>
            <MainHeader ref={ref} />
            {scrollPos > height - 2 && <FakeBorder.Top />}
            <Body>
              <Routes>
                <Route path="/" element={<Intro />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/stuff" element={<Portfolio />} />
                {posts.map(post => (
                  <Route
                    key={post.id}
                    path={`/blog/${post.id}`}
                    element={<Post postId={post.id} />}
                  />
                ))}
              </Routes>
            </Body>
            <MobileNav items={navItems} show={scrollDir !== 1} />
          </>
        ) : (
          <DesktopNav items={navItems}>
            <MainHeader ref={ref} />
            <Body>
              <Routes>
                <Route path="/" element={<Intro />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/stuff" element={<Portfolio />} />
                {posts.map(post => (
                  <Route
                    key={post.id}
                    path={`/blog/${post.id}`}
                    element={<Post postId={post.id} />}
                  />
                ))}
              </Routes>
            </Body>
            <Footer />
          </DesktopNav>
        )}
      </StyledApp>
    </ThemeProvider>
  );
};

export default App;

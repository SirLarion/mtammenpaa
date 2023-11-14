import React from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { Routes, Route } from 'react-router-dom';
import { useThemeControl } from './hooks/useThemeControl';

import { Intro } from './views/Intro';
import { Blog } from './views/Blog';
import { useGetAllBlogPosts } from './hooks/useGetAllBlogPosts';
import { Post } from './views/Post';
import { MainNavigation } from './components/MainNavigation';
import { Heading1 } from './styles/typography';

import avatar from './assets/profile.jpg';

const StyledApp = styled.div`
  max-height: 100vh;
  max-width: 100vw;
  overflow: hidden;
  background-color: ${p => p.theme.background.rainbow};
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  min-height: 10rem;
  width: 100%;

  h1 {
    margin: 0.8rem 0 0 2rem;
    color: ${p => p.theme.accent.rainbow};
    text-anchor: center;
  }
`;

const AvatarImg = styled.img`
  border-radius: 100%;
  width: 6rem;
  height: 6rem;
`;

const Body = styled.body`
  width: 100%;
`;

const Footer = styled.footer`
  min-height: 5rem;
  width: 100%;
`;

const App = () => {
  const { theme, toggleTheme } = useThemeControl();
  const { posts } = useGetAllBlogPosts();
  return (
    <ThemeProvider theme={theme}>
      <StyledApp>
        <MainNavigation
          items={[
            { label: 'Introduction', path: '/' },
            { label: 'Blog', path: '/blog' },
            ...posts.map(post => ({
              label: post.title,
              path: `/blog/${post.id}`,
            })),
          ]}
        >
          <Header>
            <AvatarImg src={avatar} />
            <Heading1>Miska Tammenpää</Heading1>
          </Header>
          <Body>
            <Routes>
              <Route path="/" element={<Intro />} />
              <Route path="/blog" element={<Blog />} />
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
        </MainNavigation>
      </StyledApp>
    </ThemeProvider>
  );
};

export default App;

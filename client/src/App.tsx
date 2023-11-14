import React from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { Routes, Route } from 'react-router-dom';
import { useThemeControl } from './hooks/useThemeControl';

import { Intro } from './views/Intro';
import { Blog } from './views/Blog';
import { useGetAllBlogPosts } from './hooks/useGetAllBlogPosts';
import { Post } from './views/Post';
import { MainNavigation } from './components/MainNavigation';

const StyledApp = styled.div`
  max-height: 100vh;
  max-width: 100vw;
  overflow: hidden;
  background-color: ${p => p.theme.background.secondary};
`;

const Header = styled.header`
  min-height: 5rem;
  width: 100%;
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
          <Header />
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

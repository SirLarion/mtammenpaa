import { useMemo } from 'react';

import { useAxiosGet } from './useAxiosGet';

type TRawPostData = {
  id: string;
  title: string;
  tags: string;
  updatedAt: string;
  publishedAt?: string;
};

export type TPostData = {
  id: string;
  title: string;
  tags: string[];
  updatedAt: Date;
  publishedAt?: Date;
};

export const useGetAllBlogPosts = () => {
  const { data, loading, error } = useAxiosGet<TRawPostData[]>('/posts/all');

  const posts: TPostData[] = useMemo(
    () =>
      (data || []).map(post => ({
        ...post,
        tags: post.tags.split(','),
        updatedAt: new Date(post.updatedAt),
        publishedAt:
          post.publishedAt !== undefined
            ? new Date(post.publishedAt)
            : undefined,
      })),
    [data]
  );

  return {
    posts,
    loading,
    error,
  };
};

import { useAxiosGet } from '../../../hooks/useAxiosGet';

export const useGetPostContent = (postId: string) => {
  const {
    data = '<div />',
    loading,
    error,
  } = useAxiosGet<string>(`/posts/${postId}`);
  return { html: { __html: data }, loading, error };
};

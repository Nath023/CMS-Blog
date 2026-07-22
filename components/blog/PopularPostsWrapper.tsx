import { PopularPosts } from './PopularPosts';

export default function PopularPostsWrapper(): JSX.Element {
  const Component = PopularPosts as any;
  return <Component />;
}

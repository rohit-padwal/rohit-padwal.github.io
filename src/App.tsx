import { Route, Routes } from 'react-router';
import { Layout } from './components/Layout';
import { Metadata } from './components/Metadata';
import { Home } from './pages/Home';
import { Blog, BlogPostPage, ProjectDetail, NotFound } from './pages/Details';
export function App() {
  return <><Metadata /><Routes><Route element={<Layout />}><Route index element={<Home />} /><Route path="projects/:slug" element={<ProjectDetail />} /><Route path="blog" element={<Blog />} /><Route path="blog/:slug" element={<BlogPostPage />} /><Route path="*" element={<NotFound />} /></Route></Routes></>;
}

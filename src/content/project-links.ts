import type { Project } from './types';
export function getProjectLinks(project: Project) {
  return [
    ...(project.githubUrl ? [{ label: 'GitHub', url: project.githubUrl }] : []),
    ...(project.liveDemoUrl ? [{ label: 'Live Demo', url: project.liveDemoUrl }] : []),
  ];
}

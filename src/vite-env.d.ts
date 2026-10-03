/// <reference types="vite/client" />
declare module 'virtual:blog' {
  const posts: import('./content/types').BlogPost[];
  export default posts;
}

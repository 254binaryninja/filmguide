import '../app/globals.css';
import { tmdbService } from '../lib/api/tmdb';
import React from 'react';
import { ThemeProvider } from 'next-themes';

tmdbService.getPosterURLProxy = (path, size = 'w342') =>
  path ? `https://image.tmdb.org/t/p/${size}${path}` : null;
tmdbService.getBackdropURLProxy = (path, size = 'w1280') =>
  path ? `https://image.tmdb.org/t/p/${size}${path}` : null;

export const decorators = [
  (Story) => (
    <ThemeProvider
      attribute="data-theme"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      <Story />
    </ThemeProvider>
  ),
];

export const parameters = {
  nextjs: { appDirectory: true },
  theme: {
    default: 'light',
    list: [
      { id: 'light', title: 'Light', color: '#fff' },
      {
        id: 'dark',
        title: 'Dark',
        color: '#333',
        selector: 'html',
        attribute: 'data-theme',
      },
    ],
  },
};
export default { parameters };

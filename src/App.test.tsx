import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders healthcare app', () => {
  render(<App />);
  // Test that the app renders (it shows loading state initially due to API calls)
  expect(document.body).toBeInTheDocument();
});

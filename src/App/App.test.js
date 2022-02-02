/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import ReactGA from 'react-ga';

import App from './App';

describe('<App/> component tests', () => {
  beforeEach(() => {
    ReactGA.testModeAPI.resetCalls();
  });

  it('should render with a <main> tag', () => {
    const { container } = render(<App/>, { wrapper: MemoryRouter });
    const element = container.querySelector('main');
    expect(element).toBeInTheDocument();
  });
});

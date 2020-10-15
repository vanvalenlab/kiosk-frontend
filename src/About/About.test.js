import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import About from './About';

describe('<About/> component tests', () => {
  it('<About/> renders with buttons', () => {
    const { getByText } = render(<About/>);
    const element = getByText(/deepcell-tf/i);
    expect(element).toBeInTheDocument();
  });
});

import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import NotFound from './NotFound';

describe('<NotFound/> component tests', () => {
  it('<NotFound/> renders with buttons', () => {
    const { getByText } = render(<NotFound/>);
    const element = getByText(/404/i);
    expect(element).toBeInTheDocument();
  });
});

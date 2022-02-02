import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import Landing from './Landing';

describe('<Landing/> component tests', () => {
  it('<Landing/> renders with buttons', () => {
    const { getByText } = render(<Landing/>);
    const element = getByText(/DeepCell/i);
    expect(element).toBeInTheDocument();
  });
});

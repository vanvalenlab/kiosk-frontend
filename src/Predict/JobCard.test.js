import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import JobCard from './JobCard';

describe('<JobCard/> component tests', () => {
  it('<JobCard/> renders with default values', () => {
    const expectedName = 'ModelName';
    const { getByText } = render(<JobCard name={'ModelName'} />);
    const element = getByText(expectedName);
    expect(element).toBeInTheDocument();
  });
});

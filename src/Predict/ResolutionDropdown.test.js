/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ResolutionDropdown from './ResolutionDropdown';

describe('<ResolutionDropdown/> component tests', () => {

  it('<ResolutionDropdown/> renders with default values.', () => {
    const { getByLabelText } = render(<ResolutionDropdown modelMpp={0.5} scale={1} />);
    const element = getByLabelText(/20x/i);
    expect(element).toBeInTheDocument();
  });

  it('<ResolutionDropdown/> renders with overridden values.', () => {
    const { getByText } = render(<ResolutionDropdown modelMpp={0.25} scale={1} />);
    const element = getByText(/40x/i);
    expect(element).toBeInTheDocument();
  });

});

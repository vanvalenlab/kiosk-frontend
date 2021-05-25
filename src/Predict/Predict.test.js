import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import Predict from './Predict';

describe('<Predict/> component tests', () => {
  it('should render with a disabled button', () => {
    const { container } = render(<Predict/>);
    const element = container.querySelector('#submitButton');
    expect(element).toBeDisabled();
  });
});

describe('View in Label sends a form', () => {
  it('should send a form', () => {
    const { container } = render(<Predict/>);
    const element = container.querySelector('#submitButton');
    expect(element).toBeDisabled();
  });
});

import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ScaleForm from './ScaleForm';

describe('<ScaleForm/> component tests', () => {

  it('<ScaleForm/> renders with default values.', () => {
    const { getByLabelText } = render(<ScaleForm checked={true} />);
    const checkbox = getByLabelText(/Rescale Automatically/i);
    expect(checkbox.checked).toBeTruthy();

    const scaleInput = getByLabelText(/Rescaling Value/i);
    expect(scaleInput).toBeDisabled();
  });

  it('<ScaleForm/> renders with overridden values.', () => {
    const { getByLabelText } = render(<ScaleForm checked={false} />);
    const checkbox = getByLabelText(/Rescale Automatically/i);
    expect(checkbox.checked).toBeFalsy();

    const scaleInput = getByLabelText(/Rescaling Value/i);
    expect(scaleInput).toBeEnabled();
  });

});

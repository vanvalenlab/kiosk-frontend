import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import Data from './Data';

describe('<Data/> component tests', () => {
  it('<Data/> renders with header', () => {
    const { getByText } = render(<Data/>);
    const element = getByText('Example Image Data');
    expect(element).toBeInTheDocument();
  });
});

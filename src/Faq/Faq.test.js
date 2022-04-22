import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import Faq from './Faq';

describe('<Faq/> component tests', () => {
  it('<Faq/> renders with header', () => {
    const { getByText } = render(<Faq />);
    const element = getByText('Frequently Asked Questions');
    expect(element).toBeInTheDocument();
  });
});

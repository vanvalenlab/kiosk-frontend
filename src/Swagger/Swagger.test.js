import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import Swagger from './Swagger';

describe('<Swagger/> component tests', () => {
  it('<Swagger/> renders with header', () => {
    const { container } = render(<Swagger />);
    expect(container.firstChild).toHaveClass('swagger-ui');
  });
});

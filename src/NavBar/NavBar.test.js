/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import NavBar from './NavBar';

describe('<NavBar/> component tests', () => {
  it('<NavBar/> renders with copyright info', () => {
    const { getAllByRole } = render(<NavBar/>);
    const element = getAllByRole('button');
    expect(element).toHaveLength(1);
  });
});

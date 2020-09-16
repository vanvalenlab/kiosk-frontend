import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import FileUpload from './FileUpload';

describe('<FileUpload/> component tests', () => {
  it('<FileUpload/> renders with Dropzone component', () => {
    const { getByText } = render(<FileUpload/>);
    const element = getByText(/Drag and Drop/i);
    expect(element).toBeInTheDocument();
  });
});

import React from 'react';
import {
  act,
  render,
  fireEvent,
  screen,
  waitFor,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import FileUpload from './FileUpload';

describe('<FileUpload/> component tests', () => {
  function mockData(files) {
    return {
      dataTransfer: {
        files,
        items: files.map((file) => ({
          kind: 'file',
          type: file.type,
          getAsFile: () => file,
        })),
        types: ['Files'],
      },
    };
  }

  it('<FileUpload/> renders with Dropzone component', () => {
    const infoText = 'expected text';
    const { getByText } = render(<FileUpload infoText={infoText} />);
    const element = getByText(/Drag and drop/i);
    expect(element).toBeInTheDocument();
    const infoTextElement = getByText(infoText);
    expect(infoTextElement).toBeInTheDocument();
  });

  it('<FileUpload /> only supports single file upload', async () => {
    const files = [
      new Blob(['file contents'], { type: 'image/png' }),
      new Blob(['another file contents'], { type: 'image/jpeg' }),
    ];

    const { container } = render(<FileUpload />);
    const inputEl = container.querySelector('input');
    const event = new Event('dragenter', { bubbles: true });
    Object.assign(event, mockData(files));
    act(() => {
      fireEvent.drop(inputEl, event);
    });
    await waitFor(() => {
      expect(
        screen.getByText(/Only single file uploads are supported/i)
      ).toBeInTheDocument();
    });
  });
});

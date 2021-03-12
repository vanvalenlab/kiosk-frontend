import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ChannelForm from './ChannelForm';

describe('<ChannelForm/> component tests', () => {

  it('<ChannelForm/> renders with targets as labels.', () => {
    // const { targetChannels, channels, onChange } = props;
    const target1 = 'channelLabel';
    const target2 = 'channelLabel2';
    const { getByText } = render(
      <ChannelForm
        targetChannels={{ [target1]: 'R', [target2]: 'G' }}
        channels={['B', 'R', 'G', 'B']}
      />
    );
    const element1 = getByText(`${target1} channel`);
    expect(element1).toBeInTheDocument();

    const element2 = getByText(`${target2} channel`);
    expect(element2).toBeInTheDocument();
  });

});

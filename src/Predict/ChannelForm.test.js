import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import ChannelForm from './ChannelForm';

describe('<ChannelForm/> component tests', () => {

  it('<ChannelForm/> renders with targets as labels.', () => {
    // const { targetChannels, channels, onChange } = props;
    const target1 = 'channelLabel';
    const target2 = 'channelLabel2';
    const { getByText } = render(
      <ChannelForm
        requiredChannels={[target1, target2]}
        selectedChannels={[0, 1]}
      />
    );
    const element1 = getByText(`${target1} channel`);
    expect(element1).toBeInTheDocument();

    const element2 = getByText(`${target2} channel`);
    expect(element2).toBeInTheDocument();
  });

});

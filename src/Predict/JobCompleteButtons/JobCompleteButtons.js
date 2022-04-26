import DownloadButton from './DownloadButton';
import SubmitNewButton from './SubmitNewImageButton';
import VisualizeButton from './VisualizeButton';
import React from 'react';
import PropTypes from 'prop-types';

const JobCompleteButtons = ({ jobData, imageUrl, labelsUrl }) => {
  return (
    <div>
      <DownloadButton downloadUrl={downloadUrl} />
      {jobData.visualizer && labelsUrl.split('.').pop() !== 'zip' && (
        <VisualizeButton
          visualizer={jobData.visualizer}
          imageUrl={imageUrl}
          labelsUrl={labelsUrl}
        />
      )}
      <SubmitNewButton />
    </div>
  );
};

JobCompleteButtons.propTypes = {
  jobData: PropTypes.object.isRequired,
  imageUrl: PropTypes.string.isRequired,
  labelsUrl: PropTypes.string.isRequired,
};

export default JobCompleteButtons;

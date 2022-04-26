import DownloadButton from './DownloadButton';
import SubmitNewButton from './SubmitNewImageButton';
import VisualizeButton from './VisualizeButton';
import React from 'react';
import PropTypes from 'prop-types';

const JobCompleteButtons = ({ jobData, imageUrl, downloadUrl }) => {
  return (
    <div>
      <DownloadButton downloadUrl={downloadUrl} />
      {jobData.visualizer && imageUrl.split('.').pop() !== 'zip' && (
        <VisualizeButton
          visualizer={jobData.visualizer}
          imageUrl={imageUrl}
          downloadUrl={downloadUrl}
        />
      )}
      <SubmitNewButton />
    </div>
  );
};

JobCompleteButtons.propTypes = {
  jobData: PropTypes.object.isRequired,
  imageUrl: PropTypes.string.isRequired,
  downloadUrl: PropTypes.string.isRequired,
};

export default JobCompleteButtons;

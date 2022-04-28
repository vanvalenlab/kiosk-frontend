import DownloadButton from './DownloadButton';
import SubmitNewButton from './SubmitNewImageButton';
import VisualizeButton from './VisualizeButton';
import React from 'react';
import PropTypes from 'prop-types';

const JobCompleteButtons = ({
  jobData,
  imageUrl,
  dimensionOrder,
  labelsUrl,
}) => {
  return (
    <div>
      <DownloadButton labelsUrl={labelsUrl} />
      {/* loading images from zips is not supported */}
      {jobData.visualizer && imageUrl.split('.').pop() !== 'zip' && (
        <VisualizeButton
          jobData={jobData}
          url={jobData.visualizer}
          imagesUrl={imageUrl}
          dimensionOrder={dimensionOrder}
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
  dimensionOrder: PropTypes.string.isRequired,
  labelsUrl: PropTypes.string.isRequired,
};

export default JobCompleteButtons;

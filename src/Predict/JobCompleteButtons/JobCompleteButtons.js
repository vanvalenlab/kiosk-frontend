import DownloadButton from './DownloadButton';
import SubmitNewButton from './SubmitNewImageButton';
import VisualizeButton from './VisualizeButton';

const JobCompleteButtons = ({
  jobData,
  imageUrl,
  downloadUrl,
  dimensionOrder,
}) => {
  return (
    <div>
      <DownloadButton downloadUrl={downloadUrl} />
      {jobData.visualizer && imageUrl.split('.').pop() !== 'zip' && (
        <VisualizeButton
          visualizer={jobData.visualizer}
          imageUrl={imageUrl}
          downloadUrl={downloadUrl}
          dimensionOrder={dimensionOrder}
        />
      )}
      <SubmitNewButton />
    </div>
  );
};

JobCompleteButtons.propTypes = {
  visualizer: PropTypes.bool.isRequired,
  imageUrl: PropTypes.string.isRequired,
  downloadUrl: PropTypes.string.isRequired,
  dimensionOrder: PropTypes.string.isRequired,
};

export default JobCompleteButtons;

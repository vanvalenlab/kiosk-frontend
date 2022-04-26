import PropTypes from 'prop-types';
import React from 'react';
import ModelDropdown from './ModelDropdown';
import MesmerForm from './MesmerForm';
import PolarisForm from './PolarisForm';
import SegmentationForm from './SegmentationForm';
import CalibanForm from './CalibanForm';

function JobForm({ jobTypes, jobType, setJobType, setJobForm }) {
  const jobDropdown = (
    <ModelDropdown options={jobTypes} value={jobType} onChange={setJobType} />
  );

  switch (jobType) {
    case 'mesmer':
      return <MesmerForm jobDropdown={jobDropdown} setJobForm={setJobForm} />;
    case 'polaris':
      return <PolarisForm jobDropdown={jobDropdown} setJobForm={setJobForm} />;
    case 'segmentation':
      return (
        <SegmentationForm jobDropdown={jobDropdown} setJobForm={setJobForm} />
      );
    case 'caliban':
      return <CalibanForm jobDropdown={jobDropdown} setJobForm={setJobForm} />;
    default:
      return <div>Invalid job type</div>;
  }
}

JobForm.propTypes = {
  jobTypes: PropTypes.array.isRequired,
  jobType: PropTypes.string.isRequired,
  setJobType: PropTypes.function.isRequired,
  setJobForm: PropTypes.function.isRequired,
};

export default JobForm;

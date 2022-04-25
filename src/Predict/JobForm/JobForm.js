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

export default JobForm;

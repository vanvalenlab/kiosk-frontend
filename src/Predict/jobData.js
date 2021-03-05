
const jobCards = {
  segmentation: {
    file: 'nuclei/examples/HeLa_nuclear.png',
    name: 'Nuclear Segmentation',
    model: 'The nuclear model performs nuclear segmentation of cell culture data.',
    inputs: 'A nuclear channel image.',
    thumbnail: 'thumbnails/HeLa_nuclear_color.png',
  },
  multiplex: {
    file: 'tiff_stack_examples/vectra_breast_cancer.tif',
    name: 'Mesmer',
    model: 'Mesmer performs whole-cell segmentation of multiplex tissue data.',
    inputs: 'A two-channel TIFF where the first channel is a nuclear marker and the second channel is a membrane marker.',
    thumbnail: 'thumbnails/breast_vectra.png',
  },
  tracking: {
    file: 'tiff_stack_examples/3T3_nuc_example_256.tif',
    name: 'Cell Tracking',
    model: 'The cell tracking model segments and tracks objects over time and creates a lineage file for division information.',
    inputs: 'A single-channel image stack (3D TIFF).',
    thumbnail: 'thumbnails/3T3_nuc_example_256.png',
  },
  // TODO: this is a stop gap to support both multiplex and mesmer names
  mesmer: {
    file: 'tiff_stack_examples/vectra_breast_cancer.tif',
    name: 'Mesmer',
    model: 'Mesmer performs whole-cell segmentation of multiplex tissue data.',
    inputs: 'A two-channel TIFF where the first channel is a nuclear marker and the second channel is a membrane marker.',
    thumbnail: 'thumbnails/breast_vectra.png',
  },
};

export default jobCards;

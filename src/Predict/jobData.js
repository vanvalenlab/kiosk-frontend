
const jobCards = {
  segmentation: {
    file: 'nuclei/examples/HeLa_nuclear.png',
    name: 'Nuclear Segmentation',
    description: 'The nuclear model performs nuclear segmentation of cell culture data. The inputs are a nuclear channel.',
    thumbnail: 'thumbnails/HeLa_nuclear_color.png',
  },
  multiplex: {
    file: 'tiff_stack_examples/vectra_breast_cancer.tif',
    name: 'Mesmer',
    description: 'Mesmer performs whole-cell segmentation of multiplex tissue data. The input is a two-channel TIFF where the first channel is a nuclear marker and the second channel is a membrane marker.',
    thumbnail: 'thumbnails/breast_vectra.png',
  },
  tracking: {
    file: 'tiff_stack_examples/3T3_nuc_example_256.tif',
    name: 'Cell Tracking',
    description: 'The cell tracking model segments and tracks objects over time and creates a lineage file for division information. The input is an single-channel image stack (3D TIFF).',
    thumbnail: 'thumbnails/3T3_nuc_example_256.png',
  },
  // TODO: this is a stop gap to support both multiplex and mesmer names
  mesmer: {
    file: 'tiff_stack_examples/vectra_breast_cancer.tif',
    name: 'Mesmer',
    description: 'Mesmer performs whole-cell segmentation of multiplex tissue data. The input is a two-channel TIFF where the first channel is a nuclear marker and the second channel is a membrane marker.',
    thumbnail: 'thumbnails/breast_vectra.png',
  },
};

export default jobCards;
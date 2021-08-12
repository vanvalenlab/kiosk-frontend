
const jobCards = {
  segmentation: {
    file: 'nuclei/examples/HeLa_nuclear.png',
    name: 'Nuclear Segmentation',
    model: 'The nuclear model performs nuclear segmentation of cell culture data.',
    inputs: 'A nuclear channel image.',
    resolution: 'Nuclear Segmentation expects data that is approximately 20X (0.65 μm/pixel)',
    thumbnail: 'thumbnails/HeLa_nuclear_color.png',
    scaleEnabled: true,
    requiredChannels: ['nuclei'],
    modelResolution: 0.5,
  },
  tracking: {
    file: 'tiff_stack_examples/3T3_nuc_example_256.tif',
    name: 'Cell Tracking',
    model: 'The cell tracking model segments and tracks objects over time and creates a lineage file for division information.',
    inputs: 'A single-channel image stack (3D TIFF).',
    resolution: 'Cell Tracking expects data that is approximately 20X (0.65 μm/pixel)',
    thumbnail: 'thumbnails/3T3_nuc_example_256.png',
    scaleEnabled: true,
    requiredChannels: ['nuclei'],
    modelResolution: 0.5,
  },
  mesmer: {
    file: 'tiff_stack_examples/vectra_breast_cancer.tif',
    name: 'Mesmer',
    model: 'Mesmer performs whole-cell segmentation of multiplex tissue data.',
    inputs: 'An image containing both a nuclear marker and a membrane/cytoplasm marker.',
    resolution: 'Mesmer expects data that is approximately 20X (0.5 μm/pixel)',
    thumbnail: 'thumbnails/breast_vectra.png',
    scaleEnabled: true,
    requiredChannels: ['nuclei', 'cytoplasm'],
    modelResolution: 0.5,
  },
};

// TODO: this is a stop gap to support both multiplex and mesmer names
jobCards.multilplex = jobCards.mesmer;

export default jobCards;

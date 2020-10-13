## deepcell-tf
This is the core deepcell library. Deepcell-tf contains the necessary functions to train new deep learning models. The library has been constructed in a modular
fashion to make it easy to mix and match different model architectures, prediction tasks, and post-processing functions. The [readme](https://github.com/vanvalenlab/deepcell-tf/blob/master/README.md)
has instructions for getting started. For more information, check out the [documentation](https://deepcell.readthedocs.io/en/master/)

## deepcell.org
The deepcell.org websites provides a web interface to access trained deep learning models. With an easy drag-and-drop interface, it has the lowest barrier to entry
for getting high-quality predictions back from a variety of deep learning models. All predictions are made using our cloud-based deployment, meaning no local
installation is required. Image data can be uploaded [here](https://deepcell.org/predict)

(Should we put this section somewhere else? Perhaps on the actual predict page? Or as a dropdown depending on which model is selected?)
Currently, there are three distinct model types. 
1. Segmentation: This is our nuclear prediction model for cell culture. The input to this model is a single nuclear image. The output of this model 
is a mask with the nuclear segmentation of each cell in the image
2. Tracking: This our live-cell tracking model. The input to this model is a time-lapse movie of a single nuclear channel. The output of this model
is a segmentation mask for each frame in the time-lapse movie, with the cell ids linked across images such that the same cell always has the same label.
3. Multiplex. This is our multiplex imaging model. The input to this model is a 2-channel image consisting of a nuclear channel and a membrane 
or cytoplasm channel. The output of this model is a mask with the cell-segmentation of each cell in the image

## deepcell-applications
The applications repository contains a variety of trained deep learning models. This repository allows you to run trained deep learning models. It does
not provide a cloud-based environment to run these models. Instead, there are jupyter notebooks and docker images for users who want more fine-grained control
over the parameters of the model, or who need a local deployment. The [Readme](https://github.com/vanvalenlab/deepcell-applications/blob/master/README.md)
has more instructions for how to get started.

## kiosk-console
The kiosk console allows users to spin up their own cloud-based deployment of pretrained models. It automatically handles resource management and scaling to 
quickly generate high-quality deep learning predictions. The [Readme](https://github.com/vanvalenlab/kiosk-console/blob/master/README.md) has more instructions
for how to get started

## caliban
Caliban is our tool curating training data. It provides an inutitive GUI for users to create annotations from scratch, or to correct model predictions, 
to faciliate the creation of large, high-quality datasets. Caliban can be deployed locally, or to the cloud. The [Readme](https://github.com/vanvalenlab/caliban/blob/master/README.md)
has more instructions for how to get started

## ark-analysis
The ark repository is our integrated multiplex image analysis pipeline. The input is multiplexed image data from any platform. It runs the data through deepcell, extracts the counts of each marker in each cell, normalizes the data, and then creates a summary table with morphological information and marker intensity for every cell in each image. It also provides an easy way to run some standard spatial analysis functions on your data. 

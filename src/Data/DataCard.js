import React, { useState, useEffect } from 'react';
import { PropTypes } from 'prop-types';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/system';

const Div = styled('div')``;

const allCards = [
  {
    file: 'nuclei/examples/HeLa_nuclear.png',
    name: 'Fluorescent Nuclei',
    description:
      'Static images of fluorescent nuclei from HeLa S3 cells. Imaged with a Nikon Ti2 microscope.',
    thumbnail: 'thumbnails/HeLa_nuclear.png',
    datatype: 'prediction',
  },
  {
    file: 'tiff_stack_examples/multiplex_mibi.tif',
    name: 'Esophagus',
    description:
      'Nuclear and membrane stain of esophageal tissue. Imaged with MIBI.',
    thumbnail: 'thumbnails/multiplex_mibi.png',
    datatype: 'prediction',
  },
  {
    file: 'tiff_stack_examples/multiplex_vectra.tif',
    name: "Hodgkin's Lymphoma",
    description:
      "Nuclear and membrane stain of Hodgkin's lymphoma. Imaged with Vectra.",
    thumbnail: 'thumbnails/multiplex_vectra.png',
    datatype: 'prediction',
  },
  // {
  //   file: 'nuclei/examples/mousebrain.tif',
  //   name: 'Mouse Brain Nuclei',
  //   description: 'Mouse embryo nuclei Z-stack',
  // thumbnail: 'thumbnails/HeLa_nuclear.png',
  //   datatype: 'prediction'
  // },
  // {
  //   file: 'tracked/tracking_HeLa_S3.zip',
  //   name: 'HeLa S3 Raw + Segmentation',
  //   description: 'Raw tracked example data and segmentations to submit for tracking',
  //   thumbnail: 'thumbnails/HeLa_nuclear.png',
  //   datatype: 'prediction'
  // },
  {
    file: 'tiff_stack_examples/3T3_nuc_example_256.tif',
    name: 'Fluorescent Nuclei',
    description:
      'Dynamic movie of fluorescent nuclei from 3T3 cells. Imaged with a Nikon Ti2 microscope.',
    thumbnail: 'thumbnails/3T3_nuc_example_256.png',
    datatype: 'prediction',
  },
  // {
  //   file: 'tiff_stack_examples/3T3_cyto_example_256.tif',
  //   name: '3T3 Cytoplasm Movie (Fluorescence)',
  //   description: 'Sample 3T3 flourescent cytoplasm movie for automated segmentation and tracking.',
  //   thumbnail: 'thumbnails/3T3_cyto_example_256.png',
  //   datatype: 'prediction'
  // },
  // {
  //   file: 'tiff_stack_examples/3T3_phase_example_256.tif',
  //   name: '3T3 Ctyoplasm Movie (Phase)',
  //   description: 'Sample 3T3 brightfield movie for automated segmentation and tracking.',
  //   thumbnail: 'thumbnails/3T3_phase_example_256.png',
  //   datatype: 'prediction'
  // },
  {
    file: 'tracked/HeLa_S3.zip',
    name: 'Tracked Training Data - HeLa S3 Nuclei',
    description: 'Tracked training data for the HeLa S3 nuclei',
    thumbnail: 'thumbnails/HeLa_nuclear.png',
    datatype: 'training',
  },
  {
    file: 'tracked/3T3_NIH.zip',
    name: 'Tracked Training Data - NIH 3T3 Nuclei',
    description: 'Tracked training data for the NIH 3T3 nuclei',
    thumbnail: 'thumbnails/3T3_nuc_example_256.png',
    datatype: 'training',
  },
  {
    file: 'tracked/HEK293.zip',
    name: 'Tracked Training Data - HEK 293 Nuclei',
    description: 'Tracked training data for the HEK 293 nuclei',
    thumbnail: 'thumbnails/HEK293.png',
    datatype: 'training',
  },
  {
    file: 'tracked/RAW264.7.zip',
    name: 'Tracked Training Data - RAW 264.7 Nuclei',
    description: 'Tracked training data for the RAW 264.7 nuclei',
    thumbnail: 'thumbnails/RAW264.7.png',
    datatype: 'training',
  },
];

export default function DataCard(props) {
  const { cardType } = props;
  const [cardsInUse, setCardsInUse] = useState([]);

  const baseUrl = 'https://s3-us-west-1.amazonaws.com/deepcell-data';

  const trainingData = 'training';
  const predictionData = 'prediction';

  const organizeCardTypes = () => {
    const cards = allCards;
    const trainingCards = [];
    const predictionCards = [];

    //iterating through each entry in the cards array.
    for (let i = 0; i < cards.length; ++i) {
      // iterating through each object in each cards entry.
      for (let key in cards[i]) {
        if (key === 'datatype' && cards[i][key] === trainingData) {
          trainingCards.push(cards[i]);
        } else if (key === 'datatype' && cards[i][key] === predictionData) {
          predictionCards.push(cards[i]);
        }
      }
    }
    if (cardType === predictionData) {
      setCardsInUse(predictionCards);
    }
    if (cardType === trainingData) {
      setCardsInUse(trainingCards);
    }
  };

  useEffect(() => {
    organizeCardTypes();
  }, [baseUrl]);

  return (
    <Div
      sx={(theme) => ({
        p: `${theme.spacing(8)} 0`,
        width: 'auto',
        mx: theme.spacing(3),
        [theme.breakpoints.up(1100 + theme.spacing(3) * 2)]: {
          width: 1100,
          mx: 'auto',
        },
      })}
    >
      <Grid container spacing={4}>
        {cardsInUse.map((card) => (
          <Grid item key={allCards.indexOf(card)} xs={12} sm={6} md={3}>
            <Card
              sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
            >
              <CardMedia
                sx={{ pt: '56.25%' }} // 16:9
                image={`${baseUrl}/${card.thumbnail}`}
                title={`${card.name}`}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant='h5'>
                  {card.name}
                </Typography>
                <Typography variant='subtitle1'>{card.description}</Typography>
              </CardContent>
              <CardActions>
                <Button
                  size='small'
                  color='primary'
                  target='_blank'
                  href={`${baseUrl}/${card.file}`}
                >
                  Download
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Div>
  );
}

DataCard.propTypes = {
  cardType: PropTypes.string,
};

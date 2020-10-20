import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

import ButtonBase from '@material-ui/core/ButtonBase';
import { CheckBoxOutlineBlank } from '@material-ui/icons';

import GroupTag from './GroupTag'
//taken to modify from material-ui.com/components/grid/

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    margin: 'auto',
    maxWidth: '100%',
  },
  image: {
    width: 128,
    height: 128,
  },
  img: {
    margin: 'auto',
    display: 'block',
    maxWidth: '100%',
    maxHeight: '100%',
  },
}));

export default function AssetCard() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <Grid container spacing={2}
        direction ='row'
        alignItems ='center'
        justify = 'flex-start'

        >
          <Grid item xs={0}>
            <ButtonBase>
              <CheckBoxOutlineBlank />
            </ButtonBase>
          </Grid>

          <Grid item xs={1}> 
            1
          </Grid>

          <Grid item xs={2}>
            Asset
          </Grid>

          <Grid item xs={1}>
            Oil Can
          </Grid>

            <Grid
            display = 'column'
            container
            justify = 'center'
            xs={3}>
              <Grid item xs={12}>
                Yes
              </Grid>
              <Grid item>
                <span
                style = {{fontSize: '10px'}}>
                  Sample Company</span>
              </Grid>
            </Grid>

            <Grid item xs={0}>
              Warehouse 3
            </Grid> 

            <Grid item xs={3}>
             Evolution-Canada
            </Grid>

            <Grid item xs={0}>
             <GroupTag groupType= {'important'} />
            </Grid>
      </Grid>

      </Paper>
    </div>
  );
}
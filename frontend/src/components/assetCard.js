import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import ButtonBase from '@material-ui/core/ButtonBase';
import { CheckBoxOutlineBlank } from '@material-ui/icons';
import { Button } from '@material-ui/core';
import GroupTag from './GroupTag'
//taken to modify from material-ui.com/components/grid/

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    margin: 'auto',
    maxWidth: 1200,
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
        justify = 'space-evenly'

        >
          <Grid item>
            <ButtonBase>
              <CheckBoxOutlineBlank />
            </ButtonBase>
          </Grid>

          <Grid item> 
            1
          </Grid>

          <Grid item>
            Asset
          </Grid>

          <Grid item>
            Oil Can
          </Grid>

            <Grid
            display = 'column'>
              <Grid item>
                yes
              </Grid>
              <Grid item>
                <h6>Sample Company</h6>
              </Grid>
            </Grid>

            <Grid item>
              Warehouse 3
            </Grid> 

            <Grid item>
             Evolution-Canada
            </Grid>

            <Grid item >
             <GroupTag groupType= {'important'} />
            </Grid>
      </Grid>

      </Paper>
    </div>
  );
}
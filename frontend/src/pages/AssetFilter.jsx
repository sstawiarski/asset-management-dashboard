import React from 'react';

import { makeStyles } from '@material-ui/core/styles'
import { Typography, Paper, Grid, Divider, RadioGroup } from '@material-ui/core';
import FormLabel from '@material-ui/core/FormLabel';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';

import Header from '../components/Header'

const useStyles = makeStyles((theme) => ({
    paper: {
        width: "85vw",
    },
    item: {
        padding: "10px"
    },
    center: {
        display: "block",
        marginLeft: "auto",
        marginRight: "auto",
        width: "50%"
    },
    break: {
        flexGrow: 1,
        fontWeight: "bold"
    }
}))

const AssetFilter = () => {

    return(
        <div>
            <Grid container>
                <Grid item xs={12}>
                    <Header heading = "Filter Assets" />
                </Grid>
                
            </Grid>
            <Grid container>
                <Grid item xs={4}>
                    Status
                    <RadioGroup
                        name = "Status"
                        column>
                            {["Show All", "Active", "Retired"].map((value) => (
                                <FormControlLabel 
                                key={value}
                                value={value.toString()}
                                control={<Radio />}
                                label={value.toString()}
                                />
                            ))}
                    </RadioGroup>
                </Grid>
                <Grid item xs={4}>
                    Assignment
                    <RadioGroup
                        name = "Assignment"
                        column>
                            {["Show All", "Owned", "Rented"].map((value) => (
                                <FormControlLabel 
                                key={value}
                                value={value.toString()}
                                control={<Radio />}
                                label={value.toString()}
                                />
                            ))}
                    </RadioGroup>
                </Grid>
                <Grid item xs={4}>
                    Product Types
                    <RadioGroup
                        name = "Status"
                        column>
                            {["Show All", "Asset", "Assembly"].map((value) => (
                                <FormControlLabel 
                                key={value}
                                value={value.toString()}
                                control={<Radio />}
                                label={value.toString()}
                                />
                            ))}
                    </RadioGroup>
                </Grid>

            </Grid>
            <Grid container>
                <Grid item xs={6}>
                    Date Created
                </Grid>
                <Grid item xs={6}>
                    Date Updated
                </Grid>

            </Grid>
            <Grid container>
                <Grid item xs={12}>
                    Group Tag
                </Grid>
            </Grid>
        </div>
    )
}

export default AssetFilter;
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

import { dateOptions } from '../../../utils/constants.utils';

const useStyles = makeStyles(theme => ({
    root: {
        paddingLeft: theme.spacing(3),
        paddingRight: theme.spacing(3),
        paddingBottom: theme.spacing(5)
    },
    title: {
        margin: 0,
        padding: theme.spacing(2),
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
    break: {
        flexGrow: 1,
        fontWeight: "bold"
    },
    item: {
        padding: "10px"
    },
}));

const QuickAssetView = (props) => {
    const classes = useStyles();
    const [asset, setAsset] = useState({});

    const {
        identifier,
        isOpen,
        setOpen
    } = props;

    const onClose = () => {
        setOpen(false);
    }

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}/assets/${identifier}`)
            .then(response => {
                if (response.status < 300) {
                    return response.json();
                } else {
                    return {};
                }
            })
            .then(json => {
                setAsset(json);
            });
    }, [identifier])

    return (
        <Dialog onClose={onClose} open={isOpen}>
            <DialogTitle disableTypography className={classes.title}>
                <Typography variant="h6">Quick Look</Typography>
                <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent className={classes.root}>

                <Grid container>
                    <Grid item xs={3} className={classes.item}>
                        <Typography variant="subtitle1" className={classes.break}>Name</Typography>
                        <Typography variant="body1">{asset.assetName}</Typography>
                    </Grid>
                    <Grid item xs={4} className={classes.item}>
                        <Typography variant="subtitle1" className={classes.break}>Serial Number</Typography>
                        <Typography variant="body1">{asset.serial}</Typography>
                    </Grid>
                    <Grid item xs={2} className={classes.item}>
                        <Typography variant="subtitle1" className={classes.break}>Status</Typography>
                        <Typography variant="body1">{asset.retired ? "Retired" : "Active"}</Typography>
                    </Grid>
                    <Grid item xs={3} className={classes.item}>
                        <Typography variant="subtitle1" className={classes.break}>Checked Out</Typography>
                        <Typography variant="body1">{asset.checkedOut ? "Yes" : "No"}</Typography>
                    </Grid>
                    <Grid item xs={3} className={classes.item}>
                        <Typography variant="subtitle1" className={classes.break}>Assignee</Typography>
                        <Typography variant="body1">{asset.assignee ? asset.assignee : "N/A"}</Typography>
                    </Grid>
                    <Grid item xs={4} className={classes.item}>
                        <Typography variant="subtitle1" className={classes.break}>Created On</Typography>
                        <Typography variant="body1">{asset.dateCreated ? new Date(asset.dateCreated).toLocaleDateString('en-US', dateOptions) : null}</Typography>
                    </Grid>
                    <Grid item xs={2} className={classes.item}>
                        <Typography variant="subtitle1" className={classes.break}>Type</Typography>
                        <Typography variant="body1">{asset.assetType}</Typography>
                    </Grid>
                    <Grid item xs={3} className={classes.item}>
                        <Typography variant="subtitle1" className={classes.break}>Location</Typography>
                        <Typography variant="body1">{asset.deployedLocation && typeof asset.deployedLocation === "object" ? asset.deployedLocation["locationName"] : "N/A"}</Typography>
                    </Grid>
                    <Grid item xs={3} className={classes.item}>
                        <Typography variant="subtitle1" className={classes.break}>Owner</Typography>
                        <Typography variant="body1">{asset.owner}</Typography>
                    </Grid>
                    {
                        asset.dateUpdated ?
                            <Grid item xs={3} className={classes.item}>
                                <Typography variant="subtitle1" className={classes.break}>Last Updated</Typography>
                                <Typography variant="body1">{asset.dateUpdated ? new Date(asset.dateUpdated).toLocaleDateString('en-US', dateOptions) : "Never"}</Typography>
                            </Grid>
                            : null
                    }
                </Grid>


            </DialogContent>
        </Dialog>
    );

};

QuickAssetView.propTypes = {
    identifier: PropTypes.string,
    isOpen: PropTypes.bool,
    setOpen: PropTypes.func
};

export default QuickAssetView;
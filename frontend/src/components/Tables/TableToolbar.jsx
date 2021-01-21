import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { lighten, makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { Button, Container, TextField } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search'
import { useState } from 'react';

const useToolbarStyles = makeStyles((theme) => ({
    root: {
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(1),
    },
    highlight:
        theme.palette.type === 'light'
            ? {
                color: theme.palette.secondary.main,
                backgroundColor: lighten(theme.palette.secondary.light, 0.85),
            }
            : {
                color: theme.palette.text.primary,
                backgroundColor: theme.palette.secondary.dark,
            },
    title: {
        flex: '1 1 100%',
    },
    searchBar: {
        display: 'inline',
    },
}));


/**
 * Runs the toolbar which displays selected count and changes menubar based on whether any rows are selected
 * 
 * Props:
 *      title (String)                          The table title to display 
 *      selected (Array)                        The array of selected table rows
 *      children                                The components in between TableToolbar in the parent page, used for rendering additional toolbar icons/menus
 */
const EnhancedTableToolbar = (props) => {
    const classes = useToolbarStyles();



    //working code for filtering, need to figure out how to link to the table values.
    const [filter, setFilter] =useState ("");
    const handleSearchChange = (e) => {
        setFilter(e.target.value);
    }

    const {
        title,
        selected,
        children
    } = props;

    const numSelected = selected.length;

    return (
        <Toolbar
            className={clsx(classes.root, {
                [classes.highlight]: numSelected > 0,
            })}
        >
            <Container className='searchBar' align='left'>
                    <Button onClick={() => {
                        //nothing yet
                    }}>
                        <SearchIcon className= 'searchIcon' />
                    </Button>
                <TextField className='searchText' onChange={handleSearchChange} />
                
            </Container>
            {numSelected > 0 ? (
                <Typography className={classes.title} color="inherit" variant="subtitle1" component="div" align='left'>
                    {numSelected} selected
                </Typography>
            ) : (
                    <Typography className={classes.title} variant="h6" id="tableTitle" component="div" align='left'>
                        {title}
                    </Typography>
                )}

            {children}


        </Toolbar>
    );
};

EnhancedTableToolbar.propTypes = {
    title: PropTypes.string,
    selected: PropTypes.array.isRequired,
    children: PropTypes.any
};

export default EnhancedTableToolbar;
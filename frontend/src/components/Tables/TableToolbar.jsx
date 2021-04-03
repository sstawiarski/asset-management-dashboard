import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { lighten, makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

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
 * Toolbar which displays selected count and changes menubar based on whether any rows are selected
 */
const EnhancedTableToolbar = (props) => {
    const classes = useToolbarStyles();

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

            {numSelected > 0 ? (
                <Typography className={classes.title} color="inherit" variant="subtitle1" component="div" align='right'>
                    {numSelected} selected
                </Typography>
            ) : (
                <>
                    {children.props.children[0]}
                    {
                        title && (
                            <Typography className={classes.title} variant="h6" id="tableTitle" component="div" align='right'>
                                {title}
                            </Typography>
                        )
                    }
                </>
            )}

            { numSelected > 0 ? children : children.props.children.length > 1 ? children.props.children.slice(1) : children.props.children}


        </Toolbar>
    );
};

EnhancedTableToolbar.propTypes = {
    title: PropTypes.string,
    selected: PropTypes.array.isRequired,
    children: PropTypes.any
};

export default EnhancedTableToolbar;
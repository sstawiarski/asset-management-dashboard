/**
 * Styled popper component for use in tables throughout the application to display the values 
 * of an assembly's missingItems array over top of the table
 */
import React, { useState } from 'react';

import { makeStyles } from '@material-ui/core/styles';

import Popper from '@material-ui/core/Popper';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Fade from '@material-ui/core/Fade';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles({
    incomplete: {
        borderRadius: "16px",
        backgroundColor: "#fdb6c1",
        color: "#482626",
        border: "none",
        textAlign: "center",
        display: "inline-block",
        padding: "0px 6px 0px 6px",
        marginLeft: "-8px",
        cursor: "pointer"
    },
    noAction: {
        pointerEvents: "none"
    },
    popper: {
        pointerEvents: 'auto',
        backgroundColor: "white",
        boxShadow: "0.5px 1.5px 4px #000000",
        borderRadius: "3px",
    }
});

const IncompletePopper = ({ assembly }) => {
    const classes = useStyles();
    const [anchor, setAnchor] = useState(null);

    return (
        <div>
            {/* Button on table waiting for clicks to show the popper and closing it on click out */}

            <div onClick={(event) => {
                event.stopPropagation();
                setAnchor(event.currentTarget)
            }}
                className={classes.incomplete}>
                <Typography variant="body2">Incomplete</Typography>
            </div>



            {/* Actual popper, only appears when the "Incomplete" button is clicked */}
            <Popper
                id="incomplete-assembly"
                open={Boolean(anchor)}
                anchorEl={anchor}
                onClick={(event) => event.stopPropagation()}
                className={classes.popper}
                placement="bottom"
                transition>
                {({ TransitionProps }) => (
                    <ClickAwayListener onClickAway={() => setAnchor(null)}>
                        <Fade {...TransitionProps} timeout={150}>
                            <div style={{ margin: "10px" }}>
                                <Typography variant="subtitle1"><b>Items missing:</b></Typography>
                                {assembly["missingItems"] ? assembly["missingItems"].map(missing => {
                                    return (<Typography variant="body1" key={missing}>{missing}<br /></Typography>);
                                })
                                    : null}
                            </div>
                        </Fade>
                    </ClickAwayListener>
                )}
            </Popper>
        </div>);

};

export default IncompletePopper;
import React, { useEffect, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';

import Chip from '@material-ui/core/Chip';

const useStyles = makeStyles({
    chip: {
        margin: "4px"
    }
});

const ChipBar = (props) => {
    const classes = useStyles();
    const {
        setActiveFilters,
        activeFilters,
        setFilters
    } = props;

    let origFilters = activeFilters;

    const activeKeys = Object.keys(activeFilters);
    const prevOrig = useRef(activeFilters);

    //send dialog based filters to the parent page when they change
    useEffect(() => {
        if (prevOrig.current !== activeFilters) {
            const newFilters = Object.keys(activeFilters)
                .reduce((p, c) => {
                    //convert the Date objects send from the filter dialog into numbers for use in the URL
                    if (c === "dateCreated" || c === "dateUpdated" || c === "eventTime") {
                        p[c] = activeFilters[c].getTime();
                    } else {
                        p[c] = activeFilters[c];
                    }
                    return p;
                }, {})

            setFilters({
                ...origFilters,
                ...newFilters
            });
        }
    }, [activeFilters, origFilters, setFilters]);

    return (
        <div>
            {
                //split labels based on camelCase and convert to proper case
                activeKeys.length ?
                    activeKeys.map((label, idx) => {
                        const capitalized = label.replace(/([A-Z])/g, ' $1').replace(/^./, function (str) {
                            return str.toUpperCase();
                        })

                        //complicated parsing of the individual filters into human-readable results for the chip label
                        const value = typeof activeFilters[label] === "string" ?
                            activeFilters[label].replace(/^./, function (str) { return str.toUpperCase(); })
                            : activeFilters[label] instanceof Date ?
                                activeFilters[label].toLocaleDateString('en-US')
                                : typeof activeFilters[label] === "boolean" ?
                                    activeFilters[label] ? "Yes"
                                        : "No"
                                    : null;


                        //generate alternating colors for the chips
                        const iter = idx + 1;
                        const color = (iter % 2 === 0) ? "secondary" : (iter % 3 === 0) ? "" : "primary";

                        return <Chip
                            key={idx}
                            className={classes.chip}
                            label={`${capitalized}: ${value}`}
                            onDelete={() => {
                                setActiveFilters(s => {
                                    let newFilters = { ...s };
                                    delete newFilters[label];
                                    delete origFilters[label];
                                    return newFilters;
                                });

                            }}
                            color={color} />

                    })
                    : null
            }
        </div>
    );
};

export default ChipBar;
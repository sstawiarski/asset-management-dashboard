import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

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

    const activeKeys = Object.keys(activeFilters);
    const prevOrig = useRef(activeFilters);

    //send dialog based filters to the parent page when they change
    useEffect(() => {
        if (prevOrig.current !== activeFilters) {
            const newFilters = Object.keys(activeFilters)
                .reduce((p, c) => {
                    //convert the Date objects send from the filter dialog into numbers for use in the URL
                    if (c === "dateCreated" || c === "dateUpdated" || c === "eventTime" || c === "created" || c === "updated" || c === "completed") {
                        p[c] = activeFilters[c].getTime();
                    } else if ((c === "shipFrom" || c === "shipTo") && typeof activeFilters[c] === "object") {
                        p[c] = activeFilters[c].id;
                    } else {
                        p[c] = activeFilters[c];
                    }
                    return p;
                }, {})

            setFilters(s => ({
                ...s,
                ...newFilters
            }));
        }
    }, [activeFilters, setFilters]);

    return (
        <div>
            {
                //split labels based on camelCase and convert to proper case
                activeKeys.length ?
                    activeKeys.map((label, idx) => {
                        const capitalized = label.replace(/([A-Z])/g, ' $1').replace(/^./, function (str) {
                            return str.toUpperCase();
                        })

                        //generate alternating colors for the chips
                        const iter = idx + 1;
                        const color = (iter % 2 === 0) ? "secondary" : (iter % 3 === 0) ? "" : "primary";

                        if (label === "exclude") {
                            const excludeArr = JSON.parse(decodeURI(activeFilters[label]));
                            return (
                                <React.Fragment key={idx}>
                                    { excludeArr.map((exclude, index) => (
                                        <Chip
                                            key={exclude}
                                            className={classes.chip}
                                            label={`${capitalized}: ${exclude}`}
                                            color={((index + 1) % 2 === 0) ? "secondary" : (iter % 3 === 0) ? "" : "primary"}
                                            onDelete={() => {
                                                setActiveFilters(s => {
                                                    let newFilters = { ...s };
                                                    const filters = JSON.parse(decodeURI(s[label]));
                                                    const withoutExclude = filters.filter(item => item !== exclude);
                                                    delete newFilters[label];
                                                    newFilters[label] = encodeURI(JSON.stringify(withoutExclude));
                                                    setFilters(f => {
                                                        delete f[label];
                                                        f[label] = encodeURI(JSON.stringify(withoutExclude));
                                                        return f;
                                                    });
                                                    return newFilters;
                                                });
                                            }}
                                        />
                                    ))}
                                </React.Fragment>
                            );
                        }

                        //complicated parsing of the individual filters into human-readable results for the chip label
                        const value = typeof activeFilters[label] === "string" ?
                            activeFilters[label].replace(/^./, function (str) { return str.toUpperCase(); })
                            : activeFilters[label] instanceof Date ?
                                activeFilters[label].toLocaleDateString('en-US')
                                : typeof activeFilters[label] === "boolean" ?
                                    activeFilters[label] ? "Yes"
                                        : "No"
                                    : typeof activeFilters[label] === "object" ?
                                        activeFilters[label].name
                                        : null;



                        return <Chip
                            key={idx}
                            className={classes.chip}
                            label={`${capitalized}: ${value}`}
                            onDelete={() => {
                                setActiveFilters(s => {
                                    let newFilters = { ...s };
                                    delete newFilters[label];
                                    setFilters(f => {
                                        delete f[label];
                                        return f;
                                    });
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

ChipBar.propTypes = {
    setActiveFilters: PropTypes.func,
    activeFilters: PropTypes.object,
    setFilters: PropTypes.func
}

export default ChipBar;
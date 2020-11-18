/**
 * A generic and reusable table for lists of either assets or shipments
 * 
 * Accepted props:
 * 
 * data (required)              Array     
 *    The array of objects to display in the table.
 * 
 * filters (required)           Object
 *    State object from the parent component representing active filters for the API call
 * 
 * setFilters (required)        Function
 *    Function from the parent component that allows the table to communicate the new filters
 * 
 * count (required)             Number
 *    The length of the array of ALL objects returned from the API call, see "count" array in API results
 * 
 * variant (required)           String, either "asset" or "shipment"
 *    Determines which URL to link to when someone clicks on a table item
 * 
 * selected (required)          Array
 *    The array of selected items from the parent page
 * 
 * setSelected (required)       Function
 *    Function to allow table to update selections in the parent page
 * 
 * activeFilters (required)     Object
 *    The active filters, meaning specifically the ones set by the filter dialog and used to make Chips
 *    This is different than filters in that it does not include "page", "limit", "order", etc
 * 
 * setActiveFilters (required)  Function
 *    Function to allow table to update the filters in the parent page
 * 
 * selectedFields (required)  Array
 *    The fields from the objects you expect to receive that you want displayed as columns.
 *    NOTES:
 *       1) Fields in this array must be written in the column order you want.
 *       2) Fields in this array must be written exactly the same as the fields appear in the database.
 * 
 */

import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import Chip from '@material-ui/core/Chip';
import TableHead from './TableHead';
import IncompletePopper from '../IncompletePopper';
import Tooltip from '@material-ui/core/Tooltip';
import CheckIcon from '@material-ui/icons/Check';

const types = {
    asset: "/assets/",
    shipment: "/shipment/"
};

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
    },
    paper: {
        width: '98%',
        marginBottom: theme.spacing(3),
    },
    table: {
        minWidth: 750,
    },
    visuallyHidden: {
        border: 0,
        clip: 'rect(0 0 0 0)',
        height: 1,
        margin: -1,
        overflow: 'hidden',
        padding: 0,
        position: 'absolute',
        top: 20,
        width: 1,
    },
    chip: {
        margin: "4px"
    },
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
    },
    check: {
        color: "#46c240",
        marginLeft: "8px"
    }
}));

const NewTable = (props) => {
    const classes = useStyles();
    const history = useHistory();

    const {
        data,
        count,
        variant,
        selectedFields,
        selected,
        setSelected,
        filters,
        setFilters,
        activeFilters,
        setActiveFilters,
        compare
    } = props;
    const url = types[variant];
    let origFilters = filters;

    const rowsPerPage = filters.limit ? filters.limit : 5;
    const page = filters.page ? filters.page : 0;
    const order = filters.order ? filters.order : 'asc';
    const orderBy = filters.sort_by ? filters.sort_by : 'serial';
    const checkboxes = props.checkboxes || false;
    const moreInfo = props.moreInfo || null;
    const setMoreInfo = moreInfo ? props.setMoreInfo : null;
    const lookup = moreInfo ? props.lookup : null;

    //for generating Chips from filters from a dialog
    const activeKeys = Object.keys(activeFilters);

    //changes sorting selections
    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const setOrderBy = (ordering) => {
        setFilters(s => ({
            ...s,
            sort_by: ordering
        })
        )
    };

    const setOrder = (order) => {
        setFilters(s => ({
            ...s,
            order: order
        })
        )
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const onlyGood = data.filter((n) => {
                const isInCart = compare ? compare.includes(n[selectedFields[0]]) : false;
                return !isInCart;
            });
            const newSelecteds = onlyGood.map(row => row[selectedFields[0]]);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    //checkbox click handler
    const handleClick = (event, name, additional = null) => {
        const selectedIndex = selected.indexOf(name);
        let newSelected = [];
        let newAdditional = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, name);
            if (moreInfo && additional) newAdditional = newAdditional.concat(moreInfo, additional);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
            if (moreInfo && additional) newAdditional = newAdditional.concat(moreInfo.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
            if (moreInfo && additional) newAdditional = newAdditional.concat(moreInfo.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
            if (moreInfo && additional) {
                newAdditional = newAdditional.concat(moreInfo.slice(0, selectedIndex), moreInfo.slice(selectedIndex + 1));
            }
        }
        setSelected(newSelected);
        if (moreInfo && additional) setMoreInfo(newAdditional);
    };

    const handleChangePage = (event, newPage) => {
        setFilters(s => ({
            ...s,
            page: newPage
        }))
    };

    const handleChangeRowsPerPage = (event) => {
        setFilters(s => ({
            ...s,
            limit: parseInt(event.target.value, 10),
            page: 0
        }));
    };

    const isSelected = (name) => selected.indexOf(name) !== -1;

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, count - page * rowsPerPage);

    //send dialog based filters to the parent page when they change
    useEffect(() => {
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
    }, [activeFilters]);

    return (
        <div className={classes.root}>
            <Paper className={classes.paper}>

                {/* TableToolbar should be child */}
                {props.children}

                {/* Chip generation based on applied filters */}
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

                <TableContainer>
                    <Table
                        className={classes.table}
                        aria-labelledby={`${variant} table`}
                        size={'medium'}
                        aria-label={`${variant} table`}
                    >
                        <TableHead
                            classes={classes}
                            numSelected={selected.length}
                            order={order}
                            orderBy={orderBy}
                            onSelectAllClick={handleSelectAllClick}
                            onRequestSort={handleRequestSort}
                            rowCount={count}
                            selectedFields={selectedFields}
                            checkboxes={checkboxes}
                        />
                        <TableBody>
                            {
                                data.map((item, index) => {
                                    const isItemSelected = isSelected(item[selectedFields[0]]);
                                    const isItemCompared = compare ? compare.includes(item[selectedFields[0]]) : false;
                                    const labelId = `enhanced-table-checkbox-${index}`;

                                    return (
                                        <TableRow
                                            hover
                                            onClick={(event) => {
                                                event.stopPropagation();
                                                history.push(`${url}${item[selectedFields[0]]}`)
                                            }}
                                            role="checkbox"
                                            aria-checked={isItemSelected}
                                            tabIndex={-1}
                                            key={item[selectedFields[0]]}
                                            selected={isItemSelected}
                                        >
                                            {checkboxes ?
                                                <TableCell
                                                    padding="checkbox"
                                                    onClick={!isItemCompared ? (event) => {
                                                        event.stopPropagation();
                                                        const add = moreInfo ? item[lookup] : null;
                                                        handleClick(event, item[selectedFields[0]], add);
                                                    } : null}>

                                                    {
                                                        isItemCompared ?
                                                            <Tooltip title="In Cart">
                                                                <CheckIcon className={classes.check} onClick={(event) => event.stopPropagation()} />
                                                            </Tooltip>
                                                            :
                                                            <Checkbox
                                                                checked={isItemSelected}
                                                                inputProps={{ 'aria-labelledby': labelId }}
                                                            />
                                                    }


                                                </TableCell>
                                                : null}

                                            {
                                                selectedFields.map((arrayItem) => {
                                                    //translate raw dates and times into nice MM/DD/YYYY format
                                                    if (arrayItem.includes("Time") || arrayItem.includes("date")) {
                                                        return (
                                                            <TableCell align="left">
                                                                {new Date(item[arrayItem]).toLocaleDateString('en-US')}
                                                            </TableCell>)
                                                    }
                                                    //check whether assemblies are incomplete using the 'incomplete' boolean
                                                    else if (arrayItem === "assetType" && item[arrayItem] === "Assembly" && item["incomplete"]) {
                                                        return (
                                                            <TableCell rowSpan={1} align="left">
                                                                {item[arrayItem]}
                                                                <br />
                                                                <IncompletePopper assembly={item} />
                                                            </TableCell>
                                                        )
                                                    }

                                                    return (<TableCell align="left">{item[arrayItem]}</TableCell>)
                                                })
                                            }
                                        </TableRow>
                                    );
                                })}

                            {emptyRows > 0 && (
                                <TableRow style={{ height: 53 * emptyRows }}>
                                    <TableCell colSpan={selectedFields.length + 1} />
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={count}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onChangePage={handleChangePage}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                />
            </Paper>
        </div>
    );

};

export default NewTable;
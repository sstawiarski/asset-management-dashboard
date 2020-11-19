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

import React from 'react';
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
import TableHead from './TableHead';
import IncompletePopper from '../IncompletePopper';
import Typography from '@material-ui/core/Typography';

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
        marginLeft: "20px",
        marginBottom: theme.spacing(2),
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
        setFilters
    } = props;
    const url = types[variant];

    const rowsPerPage = filters.limit ? filters.limit : 5;
    const page = filters.page ? filters.page : 0;
    const order = filters.order ? filters.order : 'asc';
    const orderBy = filters.sort_by ? filters.sort_by : 'serial';
    const checkboxes = props.checkboxes || false;

    //for generating Chips from filters from a dialog


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
            const newSelecteds = data.map((n) => n.serial);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    //checkbox click handler
    const handleClick = (event, name) => {
        const selectedIndex = selected.indexOf(name);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, name);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }
        setSelected(newSelected);
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

    return (
        <div className={classes.root}>
            <Paper className={classes.paper}>

                {/* TableToolbar should be child */}
                {props.children}

                {/* Chip generation based on applied filters */}


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
                                                    onClick={(event) => {
                                                        event.stopPropagation();
                                                        handleClick(event, item[selectedFields[0]]);
                                                    }}>

                                                    <Checkbox
                                                        checked={isItemSelected}
                                                        inputProps={{ 'aria-labelledby': labelId }}
                                                    />

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
                                                    } else if (typeof item[arrayItem] === "boolean") {
                                                        return (<TableCell align="left">
                                                            {item[arrayItem] ? "Yes" : "No"}
                                                            {
                                                                arrayItem === "checkedOut" ?
                                                                    <>
                                                                        <br />
                                                                        <Typography variant="caption" style={{color: "#838383"}}>{item["assignee"]}</Typography>
                                                                    </>
                                                                    : null
                                                            }
                                                        </TableCell>);
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
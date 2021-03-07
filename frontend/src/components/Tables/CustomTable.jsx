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
 * selectedFields (required)  Array
 *    The fields from the objects you expect to receive that you want displayed as columns.
 *    NOTES:
 *       1) Fields in this array must be written in the column order you want.
 *       2) Fields in this array must be written exactly the same as the fields appear in the database.
 * 
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';
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
import Typography from '@material-ui/core/Typography';
import TableHead from './TableHead';
import IncompletePopper from '../IncompletePopper';
import Tooltip from '@material-ui/core/Tooltip';
import CheckIcon from '@material-ui/icons/Check';
import { dateOptions, URLTypes as types } from '../../utils/constants.utils';


const useStyles = makeStyles((theme) => ({
    root: {

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
    chip: {
        margin: "4px"
    },
    check: {
        color: "#46c240",
        marginLeft: "8px"
    },
    inactive: {
        backgroundColor: theme.palette.action.disabledBackground
    }
}));

const NewTable = (props) => {
    const classes = useStyles();
    const history = useHistory();
    const [showClicked, setClicked] = useState(false);
    const [identifier, setIdentifier] = useState("");
    const [pageSelected, setPageSelected] = useState(0);

    const {
        data,
        count,
        variant,
        selectedFields,
        selected,
        setSelected,
        filters,
        setFilters,
        compare,
        inactive
    } = props;
    const url = types[variant];

    const rowsPerPage = filters.limit ? filters.limit : 5;
    const page = filters.page ? filters.page : 0;
    const order = filters.order ? filters.order : 'asc';
    const orderBy = filters.sort_by ? filters.sort_by : 'serial';
    const checkboxes = props.checkboxes || false;
    const moreInfo = props.moreInfo || null;
    const setMoreInfo = moreInfo ? props.setMoreInfo : null;
    const lookup = moreInfo ? props.lookup : null;
    const Clickable = props.clickable || null;
    const returnsObject = props.returnsObject || false;
    const clearSelectedOnPageChange = props.clearSelectedOnPageChange || false;
    const setMapItems = props.setMapItems || null;

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
        /* Deselect everything when the select all box is clicked on a different page */
        if (event.target.getAttribute("data-indeterminate") === "true") {
            if (setMapItems !== null) {
                setMapItems([]);
                setSelected([])
            }
            return;
        }

        if (event.target.checked) {
            /* Use props to exclude items already "in cart" from being added twice  */
            const onlyGood = data.filter((n) => {
                const isInCart = compare ? compare.includes(n[selectedFields[0]]) : false;
                return !isInCart;
            });
            const test = onlyGood.map(row => row[selectedFields[0]]);
            const test2 = selected.concat(test);
            const newSelecteds = test2.filter((item, idx) => test2.indexOf(item) === idx);
            setSelected(newSelecteds);

            /* Maintain full objects even during pagination by adding selected objects to the parent state using the prop setter function */
            if (setMapItems !== null) {
                const mapItems = data.filter(obj => newSelecteds.includes(obj.serial));
                setMapItems(mapItems);
            }
            return;
        }

        /* Remove all selections when select all is being unchecked */
        const data2 = data.map(item => item.serial);
        setSelected(s => {
            return s.filter(item => {
                return !data2.includes(item);
            })
        });
        if (setMapItems !== null) {
            setMapItems([]);
        }
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

        /*  
            Use the existing items array to filter for only the items currently selected,
            then use the current data loaded in the table to get the new selection data,
            then get only the unique objects so they don't get added twice
        */
        if (setMapItems) {
            setMapItems(m => {
                const oldItems = m.filter(mapItem => newSelected.includes(mapItem[selectedFields[0]]));
                const newItems = data.filter(obj => newSelected.includes(obj[selectedFields[0]]));
                const unique = [...new Map([...oldItems, ...newItems].map(item => [item[selectedFields[0]], item])).values()];
                return unique;
            });
        }

        if (moreInfo && additional) setMoreInfo(newAdditional);
    };

    const handleChangePage = (event, newPage) => {
        setFilters(s => ({
            ...s,
            page: newPage
        }));
        setPageSelected(selected.length);
        if (clearSelectedOnPageChange) {
            setSelected([]);
            setMoreInfo([]);
        }
    };

    const handleChangeRowsPerPage = (event) => {
        setFilters(s => ({
            ...s,
            limit: parseInt(event.target.value, 10),
            page: 0
        }));
        setSelected([]);
        if (setMapItems) setMapItems([]);
        setPageSelected(0);
    };

    const isSelected = (name) => selected.indexOf(name) !== -1;

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, count - page * rowsPerPage);

    return (
        <div className={classes.root}>
            <Paper className={classes.paper}>

                {/* TableToolbar and chips should be child */}
                {props.children}

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
                            rowCount={rowsPerPage - emptyRows}
                            selectedFields={selectedFields}
                            checkboxes={checkboxes}
                            pageSelected={pageSelected}
                        />
                        <TableBody>
                            {
                                data.map((item, index) => {
                                    const isItemSelected = isSelected(item[selectedFields[0]]);
                                    const isItemCompared = compare ? returnsObject ? compare.find(thing => thing[selectedFields[0]] === item[selectedFields[0]]) : compare.includes(item[selectedFields[0]]) : false;
                                    const labelId = `enhanced-table-checkbox-${index}`;

                                    return (
                                        <TableRow key={index}
                                            hover
                                            onClick={(event) => {
                                                if (Clickable) {
                                                    setClicked(true);
                                                    if (variant === "asset") setIdentifier(item[selectedFields[0]]);
                                                    else setIdentifier(item);
                                                } else {
                                                    event.stopPropagation();
                                                    history.push(`${url}${item[selectedFields[0]]}`)
                                                }
                                            }}
                                            role="checkbox"
                                            aria-checked={isItemSelected}
                                            tabIndex={-1}
                                            selected={isItemSelected}
                                            className={inactive === "parentId" ? item[inactive] ? classes.inactive : "row" : item[inactive] === false ? classes.inactive : "row"}
                                        >
                                            { /* TODO: Make inactivity consistent i.e. retired = true = inactive => active = false = inactive? */}

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
                                                    if (arrayItem.includes("Time") || arrayItem.includes("date") || arrayItem === "created" || arrayItem === "updated") {
                                                        const date = new Date(item[arrayItem]);
                                                        const suffix = date.getHours() > 12 ? "PM" : "AM";
                                                        const hoursInTwelve = ((date.getHours() + 11) % 12) + 1;
                                                        const dateTime = `${hoursInTwelve}:${date.getMinutes()} ${suffix}`;
                                                        return (
                                                            <TableCell key={arrayItem} align="left">
                                                                {date.toLocaleDateString('en-US', dateOptions)}
                                                                <br />
                                                                <span style={{ color: "grey" }}>{dateTime}</span>
                                                            </TableCell>)
                                                    }
                                                    //check whether assemblies are incomplete using the 'incomplete' boolean
                                                    else if (arrayItem === "assetType" && item[arrayItem] === "Assembly" && item["incomplete"]) {
                                                        return (
                                                            <TableCell key={arrayItem} rowSpan={1} align="left">
                                                                {item[arrayItem]}
                                                                <br />
                                                                <IncompletePopper assembly={item} />
                                                            </TableCell>
                                                        )
                                                    } else if (arrayItem.includes("ship") && !arrayItem.includes("shipment")) {
                                                        return (
                                                            <TableCell key={arrayItem} align="left">
                                                                {item[arrayItem].locationName}
                                                                <br />
                                                                <span style={{ color: "grey" }}>{item[arrayItem].locationType}</span>
                                                            </TableCell>
                                                        );
                                                    } else if (typeof item[arrayItem] === "boolean") {
                                                        return (<TableCell key={arrayItem} align="left">
                                                            {item[arrayItem] ? "Yes" : "No"}
                                                            <br />
                                                            {
                                                                arrayItem === "checkedOut" ?
                                                                    <>
                                                                        <Typography variant="caption" style={{ color: "#838383" }}>{item["assignee"]}</Typography>
                                                                    </>
                                                                    : null
                                                            }
                                                            <br />
                                                        </TableCell>);
                                                    }

                                                    return (<TableCell key={arrayItem} align="left">{item[arrayItem]}</TableCell>)
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
            {showClicked ? <Clickable isOpen={showClicked} setOpen={setClicked} identifier={identifier} /> : null}
        </div>
    );

};

NewTable.propTypes = {
    data: PropTypes.array.isRequired,
    filters: PropTypes.object.isRequired,
    setFilters: PropTypes.func.isRequired,
    count: PropTypes.number.isRequired,
    variant: PropTypes.oneOf(['asset', 'shipment']).isRequired,
    selected: PropTypes.array.isRequired,
    setSelected: PropTypes.func.isRequired,
    selectedFields: PropTypes.array.isRequired,
    compare: PropTypes.array,
    checkboxes: PropTypes.bool,
    clickable: PropTypes.func

}

export default NewTable;
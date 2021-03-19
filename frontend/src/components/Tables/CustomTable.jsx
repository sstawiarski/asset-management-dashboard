import React, { useState } from 'react';
import PropTypes from 'prop-types';

//Library Tools
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';

//Material-UI Components
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';

//Custom Components
import TableHead from './TableHead';
import IndicatorBar from '../Feedback/IndicatorBar';

//Icons
import CheckIcon from '@material-ui/icons/Check';

//Tools
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
        onSelectedChange,
        filters,
        onFilterChange,
        children,
        onCompare
    } = props;
    const url = types[variant];

    const rowsPerPage = filters.limit ? filters.limit : 5;
    const page = filters.page ? filters.page : 0;
    const order = filters.order ? filters.order : 'asc';
    const orderBy = filters.sort_by ? filters.sort_by : 'serial';
    const checkboxes = props.checkboxes || false;
    const Clickable = props.renderOnClick || null;
    const clearSelectedOnPageChange = props.clearSelectedOnPageChange || false;
    const onAdditionalSelect = props.onAdditionalSelect || null;
    const onValidate = props.onValidate || null;

    //changes sorting selections
    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const setOrderBy = (ordering) => {
        onFilterChange({ sort_by: ordering });
    };

    const setOrder = (order) => {
        onFilterChange({ order: order });
    };

    const handleSelectAllClick = (event) => {
        /* Deselect everything when the select all box is clicked on a different page */
        if (event.target.getAttribute("data-indeterminate") === "true") {
            if (onAdditionalSelect !== null) {
                onAdditionalSelect([]);
                onSelectedChange([])
            }
            return;
        }

        if (event.target.checked) {
            /* Use props to exclude items already "in cart" from being added twice  */
            const onlyGood = data.filter((n) => !(onCompare && onCompare(n)));

            const test = onlyGood.map(row => row[selectedFields[0]]);
            const test2 = selected.concat(test);
            const newSelecteds = test2.filter((item, idx) => test2.indexOf(item) === idx);
            onSelectedChange(newSelecteds);

            /* Maintain full objects even during pagination by adding selected objects to the parent state using the prop setter function */
            if (onAdditionalSelect !== null) {
                const mapItems = data.filter(obj => newSelecteds.includes(obj.serial));
                onAdditionalSelect(mapItems);
            }
            return;
        }

        /* Remove all selections when select all is being unchecked */
        const data2 = data.map(item => item.serial);
        onSelectedChange(s => s.filter(item => !data2.includes(item)));

        if (onAdditionalSelect !== null) {
            onAdditionalSelect([]);
        }
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
        onSelectedChange(newSelected);

        /*  
            Use the existing items array to filter for only the items currently selected,
            then use the current data loaded in the table to get the new selection data,
            then get only the unique objects so they don't get added twice
        */
        if (onAdditionalSelect) {
            onAdditionalSelect(m => {
                const oldItems = m.filter(mapItem => newSelected.includes(mapItem[selectedFields[0]]));
                const newItems = data.filter(obj => newSelected.includes(obj[selectedFields[0]]));
                const unique = [...new Map([...oldItems, ...newItems].map(item => [item[selectedFields[0]], item])).values()];
                return unique;
            });
        }
    };

    const handleChangePage = (event, newPage) => {
        onFilterChange({ page: newPage });
        setPageSelected(selected.length);

        if (clearSelectedOnPageChange) {
            onSelectedChange([]);
        }

    };

    const handleChangeRowsPerPage = (event) => {
        onFilterChange({ limit: parseInt(event.target.value, 10), page: 0 });
        onSelectedChange([]);

        if (onAdditionalSelect) onAdditionalSelect([]);

        setPageSelected(0);
    };

    const isSelected = (name) => selected.indexOf(name) !== -1;

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, count - page * rowsPerPage);

    return (
        <div className={classes.root}>
            <Paper className={classes.paper}>

                {/* Table toolbar and chips should be child */}
                {children}

                <TableContainer>
                    <Table
                        className={classes.table}
                        aria-labelledby={`${variant} table`}
                        size={'medium'}
                        aria-label={`${variant} table`}>

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
                            warningSpace={Boolean(onValidate)}
                        />
                        <TableBody>
                            {
                                data.map((item, index) => {
                                    const isItemSelected = isSelected(item[selectedFields[0]]);
                                    const isItemCompared = onCompare ? onCompare(item) : false;
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
                                            className="row">

                                            {
                                                checkboxes ?
                                                    <TableCell
                                                        padding="checkbox"
                                                        onClick={!isItemCompared ? (event) => {
                                                            event.stopPropagation();
                                                            handleClick(event, item[selectedFields[0]]);
                                                        } : null
                                                        }>

                                                        {
                                                            isItemCompared ?
                                                                <Tooltip title="In Cart">
                                                                    <CheckIcon className={classes.check} onClick={(event) => event.stopPropagation()} />
                                                                </Tooltip>
                                                                :
                                                                <Checkbox
                                                                    checked={isItemSelected}
                                                                    inputProps={{ 'aria-labelledby': labelId }} />
                                                        }


                                                    </TableCell>
                                                    : null
                                            }

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
                                                    } else if ((arrayItem.includes("ship") && !arrayItem.includes("shipment")) || arrayItem === "deployedLocation") {
                                                        console.log(item[arrayItem])
                                                        return (
                                                            <TableCell key={arrayItem} align="left">
                                                                {item[arrayItem] && typeof item[arrayItem] === "object" ? item[arrayItem].locationName : item[arrayItem]}
                                                                <br />
                                                                <span style={{ color: "grey" }}>{item[arrayItem] && typeof item[arrayItem] === "object" ? item[arrayItem].locationType : null}</span>
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

                                            {
                                                onValidate ?
                                                    <TableCell align="inherit">
                                                        {
                                                            (() => {
                                                                const indicators = onValidate(item);
                                                                if (indicators.warnings.length || indicators.errors.length) {
                                                                    return <IndicatorBar {...indicators} />
                                                                }
                                                                else return null;
                                                            })()
                                                        }
                                                    </TableCell>
                                                    : null
                                            }

                                        </TableRow>
                                    );
                                })}

                            {
                                emptyRows > 0 &&
                                (
                                    <TableRow style={{ height: 53 * emptyRows }}>
                                        <TableCell colSpan={selectedFields.length + 1} />
                                    </TableRow>
                                )
                            }
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
    count: PropTypes.number.isRequired,
    variant: PropTypes.oneOf(['asset', 'shipment']).isRequired,
    selected: PropTypes.array.isRequired,
    onSelectedChange: PropTypes.func.isRequired,
    selectedFields: PropTypes.array.isRequired,
    checkboxes: PropTypes.bool,
    renderOnClick: PropTypes.func,
    /**
     * Custom validation function to run on a data object that returns an object with keys "warnings" and "errors",
     * which are arrays of strings indicating any validation fails
     * 
     * Used to display an IndicatorBar of errors and warnings to the user
     */
    onValidate: PropTypes.func

}

export default NewTable;
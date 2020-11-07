/**
 * A generic and reusable table for lists of either assets or shipments
 * 
 * Accepted props:
 * 
 * data (required)            Array     
 *    The array of objects to display in the table.
 * 
 * filters (required)         Object
 *    State object from the parent component representing active filters for the API call
 * 
 * setFilters (required)      Function
 *    Function from the parent component that allows the table to communicate the new filters
 * 
 * count (required)           Number
 *    The length of the array of ALL objects returned from the API call, see "count" array in API results
 * 
 * title (optional)           String
 *    The main title to display over the table
 * 
 * history (required)         React Router Helper
 *    Must be passed in from a parent *page*, may need prop-drilling to get to the table
 *    Used to redirect when someone clicks on a row in the table
 * 
 * variant (required)         String, either "asset" or "shipment"
 *    Determines which URL to link to when someone clicks on a table item
 * 
 * menuItems (required)       Array of Objects
 *    The menu items which will appear when one or more rows are selected (e.g. bulk edit actions)
 *    
 *    Schema of each object:
 *        {
 *              action: String of the hover text of the icon, first letter capitalized,
 *              icon: The icon for the menu item (import in parent, pass in here without <>)
 *              dialog: The dialog to display when the icon is clicked (import in parent, pass in here without <>)
 *        }
 * 
 * mainAction (required)      Object
 *    The menu item to show when no table rows are selected.
 *    It is the main action to do, usually filtering.
 * 
 *    Schema: Same as ech object in the menuItems array
 * 
 * selectedFields (required)  Array
 *    The fields from the objects you expect to receive that you want displayed as columns.
 *    NOTES:
 *       1) Fields in this array must be written in the column order you want.
 *       2) Fields in this array must be written exactly the same as the fields appear in the database.
 * 
 */

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { lighten, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Chip from '@material-ui/core/Chip';
import Box from '@material-ui/core/Box';

const types = {
  asset: "/assets/",
  shipment: "/shipment/"
};

// adapted from https://material-ui.com/components/tables/


/**
 * The table headers and sorting arrows, etc
 */
function EnhancedTableHead(props) {

  const {
    classes,
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
    selectedFields,
  } = props;

  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  //convert object fieldnames into properly capitalized strings
  const fields = selectedFields.map(label => {
    const newHeader = label.replace(/([A-Z])/g, ' $1').replace(/^./, function (str) { return str.toUpperCase(); })
    return newHeader;
  });

  //create the actual material ui header objects the table expects
  const headers = fields.map((field, idx) => {
    return { id: selectedFields[idx], numeric: true, disablePadding: false, label: field };
  })

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{ 'aria-label': 'select all assets' }}
          />
        </TableCell>
        {headers.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'left' : 'right'}
            padding={headCell.disablePadding ? 'none' : 'default'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}

      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
  selectedFields: PropTypes.any,
};

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
}));


/**
 * Runs the toolbar which displays selected count and changes menubar based on whether any rows are selected
 * Props:
 *      activeFilters 
 *      setActiveFilters
 *    
 *      Taken in from main table component in order to update them from the filter dialog
 *
 */
const EnhancedTableToolbar = (props) => {
  const classes = useToolbarStyles();

  const {
    numSelected,
    title,
    menuItems,
    mainAction,
    activeFilters,
    setActiveFilters,
    selected
  } = props;

  const [state, setState] = useState({});

  const MainActionIcon = mainAction.icon;
  const MainActionDialog = mainAction.dialog;
  const mainActionProperties = mainAction.props ? mainAction.props.reduce((p, c) => {
    p[c] = props[c];
    return p;
  }, {}) : {};

  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      {numSelected > 0 ? (
        <Typography className={classes.title} color="inherit" variant="subtitle1" component="div">
          {numSelected} selected
        </Typography>
      ) : (
          <Typography className={classes.title} variant="h6" id="tableTitle" component="div">
            {title}
          </Typography>
        )}

      {/* Render the menubar if anything is selected or just the main action button */}
      {numSelected > 0 ? menuItems.map(menuItem => {
        const ItemIcon = menuItem.icon;
        return <Tooltip title={menuItem.action}>
          <IconButton aria-label={menuItem.action.toLowerCase()}>
            <ItemIcon onClick={() => {
              setState(s => ({
                ...s,
                [menuItem.action]: true
              }))
            }} />
          </IconButton>
        </Tooltip>
      }) : (
          <Tooltip title={mainAction.action}>
            <IconButton aria-label={mainAction.action.toLowerCase()}>
              <MainActionIcon onClick={() => {
                setState(s => ({
                  ...s,
                  [mainAction.action]: true
                }))
              }} />
            </IconButton>
          </Tooltip>
        )}

      {/* Dialogs here, only render when their action is set to true in the state object */}
      {menuItems.map(menuItem => {
        const TheDialog = menuItem.dialog;
        const properties = menuItem.props ? menuItem.props.reduce((p, c) => {
          p[c] = props[c];
          return p;
        }, {}) : {};

        return <TheDialog
          open={state[menuItem.action]}
          setOpen={(isOpen) => {
            setState(s => ({
              ...s,
              [menuItem.action]: isOpen
            }))
          }}
          {...properties}
        />
      })}


      <MainActionDialog open={state[mainAction.action]}
        setOpen={(isOpen) => {
          setState(s => ({
            ...s,
            [mainAction.action]: isOpen
          }))
        }}
        {...mainActionProperties} />

    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
  tableHeaders: PropTypes.any,
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
  chip: {
    margin: "4px"
  }
}));

EnhancedTable.propTypes = {
  data: PropTypes.any,
  selectedFields: PropTypes.any,
};

/**
 * The main table, takes in all the original props and sends them down into their respective components like the header.
 * 
 * Updates the parent filter object when, for example, page or limit is changed to generate the new results.
 * 
 */
export default function EnhancedTable(props) {
  const classes = useStyles();

  const {
    data,
    filters,
    setFilters,
    count,
    title,
    history,
    variant,
    menuItems,
    mainAction,
    selectedFields
  } = props;

  //generate appropriate url for clicking on a table row
  const url = types[variant];

  const [selected, setSelected] = React.useState([]);

  const rowsPerPage = filters.limit ? filters.limit : 5;
  const page = filters.page ? filters.page : 0;
  const order = filters.order ? filters.order : 'asc';
  const orderBy = filters.sort_by ? filters.sort_by : 'serial';

  //for generating Chips from filters from a dialog
  const [activeFilters, setActiveFilters] = React.useState({});
  const activeKeys = Object.keys(activeFilters);

  let tableItems = [];
  if (data.length) {
    tableItems = data.map(asset => {
      return Object.keys(asset).reduce((newObject, fieldName) => {
        if (selectedFields.includes(fieldName)) newObject[fieldName] = asset[fieldName];

        return newObject;
      }, {});
    });
  }

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
    }))
  };

  const setOrder = (order) => {
    setFilters(s => ({
      ...s,
      order: order
    }))
  }

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

  //send dialog based filters to the parent page when they change
  useEffect(() => {
    const newFilters = Object.keys(activeFilters)
      .reduce((p, c) => {
        //convert the Date objects send from the filter dialog into numbers for use in the URL
        if (c === "dateCreated" || c === "dateUpdated") {
          p[c] = activeFilters[c].getTime();
        } else {
          p[c] = activeFilters[c];
        }
        return p;
      }, {})

    setFilters(s => ({
      ...s,
      ...newFilters
    }));

  }, [activeFilters]);

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>

        <EnhancedTableToolbar
          numSelected={selected.length}
          title={title}
          menuItems={menuItems}
          mainAction={mainAction}
          setActiveFilters={setActiveFilters}
          selected={selected} />

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
                  onDelete={(event) => {
                    event.stopPropagation();
                    setActiveFilters(s => {
                      let newFilters = { ...s };
                      delete newFilters[label];
                      return newFilters;
                    })
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
            <EnhancedTableHead
              classes={classes}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={count}
              selectedFields={selectedFields}
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

                      {
                        selectedFields.map((arrayItem) => {
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
}
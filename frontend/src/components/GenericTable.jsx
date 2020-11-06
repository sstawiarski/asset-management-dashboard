import React, { useEffect } from 'react';
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
import DeleteIcon from '@material-ui/icons/Delete';
import FilterListIcon from '@material-ui/icons/FilterList';

const types = {
  asset: "/assets/",
  shipment: "/shipment/"
};

// adapted from https://material-ui.com/components/tables/

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

  const fields = selectedFields.map(label => {
    const newHeader = label.replace(/([A-Z])/g, ' $1').replace(/^./, function (str) { return str.toUpperCase(); })
    return newHeader;
  });

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

const EnhancedTableToolbar = (props) => {
  const classes = useToolbarStyles();
  const { numSelected, title } = props;

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

      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton aria-label="delete">
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
          <Tooltip title="Filter list">
            <IconButton aria-label="filter list">
              <FilterListIcon />
            </IconButton>
          </Tooltip>
        )}
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
}));

EnhancedTable.propTypes = {
  data: PropTypes.any,
  selectedFields: PropTypes.any,
};

export default function EnhancedTable(props) {
  //take in the setFilters from the parent page to set when the dialog changes
  const { data, filters, setFilters, count, title, history, variant } = props;

  const url = types[variant];
  const classes = useStyles();

  const [selected, setSelected] = React.useState([]);

  const rowsPerPage = filters.limit ? filters.limit : 5;
  const page = filters.page ? filters.page : 0;
  const order = filters.order ? filters.order : 'asc';
  const orderBy = filters.sort_by ? filters.sort_by : 'serial';
  const [activeFilters, setActiveFilters] = React.useState({});
  const activeKeys = Object.keys(activeFilters);

  let selectedFields = [];

  if (props.selectedFields) {
    selectedFields = props.selectedFields;
  }

  let tableItems = [];
  if (data.length) {
    tableItems = data.map(asset => {
      return Object.keys(asset).reduce((newObject, fieldName) => {
        if (selectedFields.includes(fieldName)) newObject[fieldName] = asset[fieldName];

        return newObject;
      }, {});
    });
  }


  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = data.map((n) => n.serial);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

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

  const isSelected = (name) => selected.indexOf(name) !== -1;

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, count - page * rowsPerPage);

  //send filters to the parent page when they change
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
        <EnhancedTableToolbar numSelected={selected.length} title={title} />
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="Table"
            size={'medium'}
            aria-label="generic table"
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
              {data.map((item, index) => {
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
                      <TableCell padding="checkbox" onClick={(event) => {
                        event.stopPropagation();
                        handleClick(event, item[selectedFields[0]]);
                      }}>
                        <Checkbox
                          checked={isItemSelected}
                          inputProps={{ 'aria-labelledby': labelId }}
                        />
                      </TableCell>
                      {selectedFields.map((arrayItem) => {
                        return (<TableCell align="left">{item[arrayItem]}</TableCell>)
                      })}
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={selectedFields.length+1} />
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
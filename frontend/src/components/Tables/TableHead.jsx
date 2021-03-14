import React from 'react';
import PropTypes from 'prop-types';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Checkbox from '@material-ui/core/Checkbox';


/**
 * The table headers and sorting arrows, etc
 */
const EnhancedTableHead = (props) => {

    const {
        classes,
        onSelectAllClick,
        order,
        orderBy,
        numSelected,
        rowCount,
        onRequestSort,
        selectedFields,
        checkboxes,
        pageSelected,
        warningSpace
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
                {checkboxes ?
                    <TableCell padding="checkbox">
                        <Checkbox
                            indeterminate={numSelected > 0 && (numSelected >= pageSelected && numSelected < pageSelected+rowCount)}
                            checked={rowCount > 0 && numSelected === pageSelected+rowCount}
                            onChange={onSelectAllClick}
                            inputProps={{ 'aria-label': 'select all assets' }}
                        />
                    </TableCell>
                    : null}

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
                {
                    warningSpace ?
                    <TableCell>

                    </TableCell>
                    : null
                }

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


export default EnhancedTableHead;
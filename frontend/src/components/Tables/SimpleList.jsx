import React from 'react';
import PropTypes from 'prop-types';

//Library Tools
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles'

//Material-UI Imports
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles({
    header: {
        backgroundColor: "#EBEBEB"
    },
    body: {
        backgroundColor: "#FAFAFA",
        textDecoration: "none",
    },
    bodyLink: {
        backgroundColor: "#FAFAFA",
        textDecoration: "none",
        cursor: "pointer"
    },
    table: {
        minWidth: "300px",
        flexGrow: 1
    }
})

const SimpleList = (props) => {
    const classes = useStyles();
    const history = useHistory();

    const { data, label, link } = props;
    const headers = props.headers || [];

    return (
        <TableContainer component={Paper}>
            <Table aria-label={label} className={classes.table}>
                {/* Print out table headers if given */}
                {
                    headers.length ?
                        <TableHead className={classes.header}>
                            <TableRow>
                                {headers.map(header => {
                                    if (header === null) return null;
                                    return (<TableCell key={header}>{header}</TableCell>)
                                })
                                }
                            </TableRow>
                        </TableHead>
                        : null
                }
                <TableBody>
                    {
                        data.map((item, idx) => {
                            /* If array is given, map it, other print it (strings usually) */
                            /* If "link" prop is supplied, use the first array item as the ID to link to */
                            return item instanceof Array ?
                                <TableRow
                                    className={classes.body}
                                    key={idx}
                                    onClick={
                                        link && item[item.length - 1] === true ?
                                            () => history.push(`${link}${item[0]}`)
                                            : null
                                    }
                                >
                                    {item.map((thing, idx) => {
                                        let working = thing;
                                        const isSerialized = item[item.length - 1];
                                        if (isSerialized === true || isSerialized === false) {
                                            if (idx === item.length - 1) return null;
                                        }
                                        return (<TableCell className={idx === 0 && isSerialized === true ? classes.bodyLink : null} key={idx}>{working}</TableCell>);
                                    })}
                                </TableRow>
                                :
                                <TableRow className={classes.body} key={item}>
                                    <TableCell>{item}</TableCell>
                                </TableRow>
                        })
                    }
                </TableBody>
            </Table>
        </TableContainer>
    );
};

SimpleList.propTypes = {
    data: PropTypes.array.isRequired,
    label: PropTypes.string,
    link: PropTypes.string,
    headers: PropTypes.array
};

export default SimpleList;
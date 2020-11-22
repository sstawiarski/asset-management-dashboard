import React from 'react';
import { makeStyles } from '@material-ui/core/styles'

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
    table: {
        minWidth: "300px",
        flexGrow: 1
    }
})

const SimpleList = (props) => {
    const classes = useStyles();

    const { data, label } = props;
    const headers = props.headers || [];

    return (
        <TableContainer component={Paper}>
            <Table aria-label={label} className={classes.table}>
                {
                    headers.length ?
                        <TableHead className={classes.header}>
                            <TableRow>
                                {headers.map(header => <TableCell>{header}</TableCell>)}
                            </TableRow>
                        </TableHead>
                        : null
                }
                <TableBody>
                    {data.map(item => {
                        if (item instanceof Array) {
                            return (
                                <TableRow className={classes.body} key={item}>
                                    {item.map(thing => <TableCell>{thing}</TableCell>)}
                                </TableRow>
                            );
                        } else {
                            return (
                                <TableRow className={classes.body} key={item}>
                                    <TableCell>{item}</TableCell>
                                </TableRow>
                            );
                        }

                    })}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default SimpleList;
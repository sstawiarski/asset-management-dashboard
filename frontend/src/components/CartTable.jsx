/*
 * Author: Shawn Stawiarski
 * October 2020
 * License: MIT
 */
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles({
    table: {
    },
    button: {
        color: "#3CB3E6"
    }
});

const CartTable = (props) => {
    const classes = useStyles();

    const { rows, header } = props;

    const newHeader = header.filter(item => item.label === "Serial");

    return (
        <Paper elevation={3}>
        <TableContainer>
            <Table className={classes.table} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell align="left">#</TableCell>
                        {newHeader.map((item) => (<TableCell align="left">{item.label}</TableCell>))}
                        <TableCell></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row, idx) => {
                        const number = idx + 1;
                        return (<TableRow key={row}>
                            <TableCell align="left">{number}</TableCell>
                            <TableCell align="left">{row}</TableCell>
                            <TableCell><Button className={classes.button} onClick={() => props.handleRemove(row)}>Remove</Button></TableCell>
                        </TableRow>)
                    })}
                </TableBody>
            </Table> 
            <Button className={classes.button} disabled={rows.length ? false : true}>Submit Assembly</Button>
            {/* TODO: Add dialog for confirming and actually submitting assembly */}
            {/* TODO: Add check to ensure assembly items were not already taken by someone else in the meantime */}
        </TableContainer>
        </Paper>
    );
}

export default CartTable;
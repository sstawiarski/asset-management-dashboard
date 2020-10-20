import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { Button } from '@material-ui/core';

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

    const newHeader = header.filter(item => item.label === "Serial" || item.label === "Description");

    return (
        <TableContainer component={Paper}>
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
                        const { serial, description } = row;
                        return (<TableRow key={row.name}>
                            <TableCell align="left">{number}</TableCell>
                            <TableCell align="left">{serial}</TableCell>
                            <TableCell align="left">{description}</TableCell>
                            <TableCell><Button className={classes.button}>Remove</Button></TableCell>
                        </TableRow>)
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default CartTable;
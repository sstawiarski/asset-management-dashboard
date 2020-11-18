/*
 * Author: Shawn Stawiarski
 * October 2020
 * License: MIT
 */
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';

const useToolbarStyles = makeStyles((theme) => ({
    root: {
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(1),
    },
    highlight:
        theme.palette.type === 'light'
            ? {
                color: theme.palette.secondary.main,
                backgroundColor: theme.palette.secondary.light
            }
            : {
                color: theme.palette.text.primary,
                backgroundColor: theme.palette.secondary.dark,
            },
    title: {
        flex: '1 1 100%',
    },
}));


const useStyles = makeStyles({
    table: {
    },
    button: {
        color: "#3CB3E6"
    }
});

const CartTable = (props) => {
    const classes = useStyles();
    const toolbarStyles = useToolbarStyles();

    const { rows, header, onSubmit } = props;

    const newHeader = header.filter(item => item.label === "Serial");

    return (
        <Paper elevation={3}>
            <Toolbar className={toolbarStyles.root}>
                <Typography className={toolbarStyles.title} variant="h6" id="tableTitle" component="div">
                    Assembly Cart
                </Typography>
            </Toolbar>

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
                <Button className={classes.button} disabled={rows.length ? false : true} onClick={onSubmit}>Submit Assembly</Button>
                {/* TODO: Add dialog for confirming and actually submitting assembly */}
                {/* TODO: Add check to ensure assembly items were not already taken by someone else in the meantime */}
            </TableContainer>
        </Paper>
    );
}

export default CartTable;
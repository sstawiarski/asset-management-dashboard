import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles'

import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Toolbar from '@material-ui/core/Toolbar';
import Paper from '@material-ui/core/Paper';

import Header from '../components/Header'


const useStyles = makeStyles({
    root: {

    },
    table: {
        overflow: "hidden",
        marginLeft: "15px",
    }
});

const dateOptions = {
    month: "long",
    day: "numeric",
    year: "numeric"
};

const productHeadCells = ["Serial", "Product", "Description", "Checked Out", "Location", "Owner", "Group Tag"];

const eventHeadCells = ["Key", "Date", "Type", "Associated Products"];

const SearchDetails = (props) => {
    const searchTerm = props.match.params.query;

    const classes = useStyles();

    const [productRows, setProductRows] = useState([]);
    const [eventRows, setEventRows] = useState([]);

    useEffect(() => {
        fetch(`http://localhost:4000/assets?search=${searchTerm}`)
            .then(res => res.json())
            .then(json => {
                setProductRows(json);
            });

        fetch(`http://localhost:4000/events?search=${searchTerm}`)
            .then(res => res.json())
            .then(json => {
                setEventRows(json);
            });

    }, [props.match.params.query])

    return (
        <div className={classes.root}>
            <Header heading="Search" subheading="Search Details" />
            <Typography variant="h6" style={{ float: "left", marginLeft: "15px", paddingTop: "20px" }}>Product Results</Typography>
            <TableContainer className={classes.table} component={Paper}>
                <Table size="large">
                    <TableHead>
                        <TableRow>
                            {productHeadCells.map((headCell) => (
                                <TableCell key={headCell} align="left">{headCell}</TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {productRows.length ? productRows.map(product => (
                                <TableRow hover key={product.serial} component={Link} to={`/details/${product.serial}`} style={{textDecoration: "none"}}>
                                    <TableCell align="left">{product.serial}</TableCell>
                                    <TableCell align="left">{product.assetType}</TableCell>
                                    <TableCell align="left">{product.assetName}</TableCell>
                                    <TableCell align="left">{product.checkedOut ? "Yes" : "No"}</TableCell>
                                    <TableCell align="left">{product.deployedLocation}</TableCell>
                                    <TableCell align="left">{product.owner}</TableCell>
                                    <TableCell align="left">{product.groupTag}</TableCell>
                                </TableRow>
                        )) : null}
                    </TableBody>
                </Table>
            </TableContainer>
            <Typography variant="h6" style={{ float: "left", marginLeft: "15px", paddingTop: "20px" }}>Event Results</Typography>
            <TableContainer className={classes.table} component={Paper}>
                <Table size="large">
                    <TableHead>
                        <TableRow>
                            {eventHeadCells.map((headCell) => (
                                <TableCell key={headCell} align="left">{headCell}</TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {eventRows.length ? eventRows.map(event => (
                            <TableRow hover key={event.key} component={Link} to={`/shipments/${event.key}`} style={{textDecoration: "none"}}>
                                <TableCell align="left">{event.key}</TableCell>
                                <TableCell align="left">{new Date(event.eventTime).toLocaleDateString('en-US', dateOptions)}</TableCell>
                                <TableCell align="left">{event.eventType}</TableCell>
                                <TableCell align="left">{event.productIds.length}</TableCell>
                            </TableRow>
                        )) : null}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    )
};

export default SearchDetails;
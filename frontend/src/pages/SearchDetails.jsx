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
        marginLeft: "20px"
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
    const [eventRowsPerPage, setEventRowsPerPage] = useState(5);
    const [productRowsPerPage, setProductRowsPerPage] = useState(5);
    const [eventPage, setEventPage] = useState(0);
    const [productPage, setProductPage] = useState(0);
    const [eventCount, setEventCount] = useState(0);
    const [productCount, setProductCount] = useState(0);


    useEffect(() => {
        fetch(`http://localhost:4000/assets?search=${searchTerm}&viewAll=true&page=${productPage}&limit=${productRowsPerPage}`)
            .then(res => res.json())
            .then(json => {
                setProductRows(json.assets);
                setProductCount(json.count);
            });

        fetch(`http://localhost:4000/events?search=${searchTerm}`)
            .then(res => res.json())
            .then(json => {
                setEventRows(json);
            });

    }, [props.match.params.query, productRowsPerPage, productPage])

    const handleEventChangePage = () => {

    }

    const handleProductChangePage = (event, newPage) => {
        setProductPage(newPage);
    }

    const handleProductChangeRowsPerPage = (event) => {
        setProductRowsPerPage(parseInt(event.target.value, 10));
        setProductPage(0);
    }

    const handleEventChangeRowsPerPage = () => {

    }

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
                            <TableRow hover key={product.serial} component={Link} to={`/details/${product.serial}`} style={{ textDecoration: "none" }}>
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
            { productRows.length ?
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={productRows.length}
                    rowsPerPage={productRowsPerPage}
                    page={productPage}
                    onChangePage={handleProductChangePage}
                    onChangeRowsPerPage={handleProductChangeRowsPerPage}
                />
                : null}

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
                            <TableRow hover key={event.key} component={Link} to={`/shipments/${event.key}`} style={{ textDecoration: "none" }}>
                                <TableCell align="left">{event.key}</TableCell>
                                <TableCell align="left">{new Date(event.eventTime).toLocaleDateString('en-US', dateOptions)}</TableCell>
                                <TableCell align="left">{event.eventType}</TableCell>
                                <TableCell align="left">{event.productIds.length}</TableCell>
                            </TableRow>
                        )) : null}
                    </TableBody>
                </Table>
            </TableContainer>
            {
                eventRows.length ?
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={eventRows.length}
                        rowsPerPage={eventRowsPerPage}
                        page={eventPage}
                        onChangePage={handleEventChangePage}
                        onChangeRowsPerPage={handleEventChangeRowsPerPage}
                    />
                    : null
            }

        </div>
    )
};

export default SearchDetails;
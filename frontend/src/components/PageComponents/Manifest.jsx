import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles({
    root: {

    },
    header: {
        backgroundColor: "#EBEBEB"
    },
    body: {
        backgroundColor: "#FAFAFA",
        textDecoration: "none",
    }
});

const Manifest = ({ data }) => {
    
    const classes = useStyles();

    const [items, setItems] = useState([]);

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}/assets?parentId=${data["serial"]}`)
            .then(response => {
                if (response.status < 300) {
                    return response.json();
                } else {
                    return { count: [{ count: 0 }], data: [] };
                }
            })
            .then(json => setItems(json.data));

    }, [data]);

    return (
        <TableContainer component={Paper}>
            <Table aria-label="manifest">
                <TableHead className={classes.header}>
                    <TableRow>
                        <TableCell>Serial</TableCell>
                        <TableCell>Name</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {items.map(item => {
                        return (
                                <TableRow className={classes.body} component={Link} to={`/assets/${item.serial}`} key={item.serial}>
                                    <TableCell component="th" scope="row">{item.serial}</TableCell>
                                    <TableCell>{item.assetName}</TableCell>
                                </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

Manifest.propTypes = {
    data: PropTypes.object.isRequired
}

export default Manifest;
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
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
        backgroundColor: "#F6F6F6",
        paddingTop: "5px",
        "&:hover": {
            cursor: "pointer",
            backgroundColor: "#FCFCFC"
        }
    }
});

const Manifest = ({ data, onRedirect }) => {
    const classes = useStyles();
    const history = useHistory();

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
                            <TableRow
                                className={classes.body}
                                key={item.serial}
                                onClick={() => {
                                    onRedirect && (onRedirect());
                                    history.push(`/assets/${item.serial}`);
                                }}>

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
    data: PropTypes.object.isRequired,
    /** Function to run when user clicks on an item and is redirected to its page */
    onRedirect: PropTypes.func
}

export default Manifest;
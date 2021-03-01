import React, { useState, useEffect } from 'react';


import Button from '@material-ui/core/Button';

import CreateAssetDialog from '../components/Dialogs/CreateAssetDialog';
import CreateManifestDialog from '../components/Dialogs/CreateManifestDialog';
import ShipmentFilter from '../components/Dialogs/ShipmentFilter';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';

import NewCart from '../components/NewCart';

const obj = [
    {
        serial: "G800-1111",
        name: "Gap Sub"
    },
    {
        serial: "X800-1111",
        name: "Crossover Sub",
        notes: "yada yada"
    },
    {
        serial: "N/A",
        name: "Box of batteries",
        uuid: "34857634895-234234",
        quantity: 10
    }
];

const TestPage = () => {
    /* Control open/close of retire dialog */
    const [createOpen1, setCreateOpen1] = useState(false);
    const [createOpen2, setCreateOpen2] = useState(false);
    const [shipmentOpen, setShipmentOpen] = useState(false);
    const [activeFilters, setActiveFilters] = useState({});
    const [cartItems, setCartItems] = useState(0);
    const [anchorEl, setAnchorEl] = useState(null);
    const [cart, setCart] = useState(obj);

    useEffect(() => {
        console.log(activeFilters);
    }, [activeFilters])

    return (
        <div>
            <Button onClick={() => setCreateOpen1(!createOpen1)} variant="contained" color="primary">Create Manifest</Button>
            <Button onClick={() => setShipmentOpen(!shipmentOpen)} variant="contained" color="primary">Filter Shipments</Button>
            <Button onClick={() => setCreateOpen2(!createOpen2)} variant="contained" color="primary">Create Asset</Button>
            <div style={{ marginTop: "20px" }} />
            <button onClick={() => setCartItems(s => s + 1)}>add item</button>
            <div className="badge" value={cartItems}>
                <Tooltip title="Cart" placement="top">
                    <IconButton>
                        <ShoppingCartIcon onClick={(event) => setAnchorEl(anchorEl ? null : event.currentTarget)} />
                    </IconButton>
                </Tooltip>
            </div>

            <NewCart 
            cartItems={cart}
            headers={["Serial", "Name", "Quantity"]}
            onSubmit={() => alert("Submitted!")}
            onRemove={(idObj) => {
                const [key, value] = Object.entries(idObj)[0];
                setCart(s => s.filter(item => item[key] !== value));
            }}
            onUnserializedAdd={(obj) => setCart(s => [...s, obj])}
            onClickAway={() => setAnchorEl(null)}
            anchorEl={anchorEl}
            onNoteUpdate={(idObj) => {
                const index = cart.findIndex(item => item[idObj.idKey] === idObj[idObj.idKey]);
                let newCart = [...cart];
                if (idObj.notes === "" && newCart[index].notes) delete newCart[index].notes;
                else newCart[index].notes = idObj.notes;
                setCart(newCart);
            }} />
            
            {/* Take in open and assets from parent component so dialog can know what is selected */}
            <CreateManifestDialog open={createOpen1} setOpen={setCreateOpen1} />
            <CreateAssetDialog open={createOpen2} setOpen={setCreateOpen2} assets={['G800-1119']} />
            <ShipmentFilter open={shipmentOpen} setOpen={setShipmentOpen} setActiveFilters={setActiveFilters} />
        </div>
    );
};

export default TestPage;
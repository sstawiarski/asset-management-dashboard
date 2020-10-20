import { Container, Grid } from '@material-ui/core';

import React, {useState, useEffect} from 'react';
import AssetCard from './AssetCard';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import DropDownButton from './DropDownButton';
import ButtonBase from '@material-ui/core/ButtonBase';


const AssetList = ({ data }) => {

    const REQUEST_STATUS = {
        LOADING: "loading",
        SUCCESS: "success",
        ERROR: "error"
    }
    const [assets, setAssets] = useState([]);
    const [status, setStatus] = useState(REQUEST_STATUS.LOADING);
    const [error, setError] = useState({});

    const success = status === REQUEST_STATUS.SUCCESS;
    const isLoading = status === REQUEST_STATUS.LOADING;
    const hasErrored = status === REQUEST_STATUS.ERROR;

    useEffect(() =>{
        const fetchAssets = async (id) => {
            try {
            const result = await fetch(`http://localhost:4000/assets/${id}`);
            const json = await result.json();
            setStatus(REQUEST_STATUS.SUCCESS);
            return json;
            } catch (e) {
                setStatus(REQUEST_STATUS.ERROR);
                setError(e);
            }
        };

        fetchAssets(data)
        .then(result => {
            setAssets(result);
        });
    }, [data])
    return( 
        <div
        style = {{spacing: '10px 0px 0px 0px'}}>
            <Container>
                <div 
                style = {{border: '2px solid black',
                backgroundColor : 'lightgrey'}}
                >
                <Grid
                    container
                    direction ='row'
                    justify="flex-start"
                    alignItems="flex-start"
                    spacing={3}
                    >
                        <Grid item>
                            <DropDownButton name={'New'} />
                        </Grid>
                        <Grid item>
                             <DropDownButton name={'Edit'}/>  
                        </Grid>
                        <Grid item>
                            <DropDownButton name={'More'}/>
                        </Grid>

                    </Grid>
                </div>
                <div
                style = {{border: '1px solid lightgrey'}}>
                    <Grid
                    container
                    direction = 'row'
                    alignItems = 'flex-start'
                    justify = 'flex-start'
                    spacing={1}
                    style = {{border: '1px lightgrey'}}>
                        <Grid item xs={2}>
                        <span style = {{fontSize: '20px'}}>
                            ID #
                        <ButtonBase><ArrowDropDownIcon /> </ButtonBase>
                        </span>
                        </Grid>
                        <Grid item xs={1}>
                        <span style = {{fontSize: '20px',color: 'grey'}}>Product</span></Grid>
                        <Grid item xs={2}>
                        <span style = {{fontSize: '20px',color: 'grey'}}>Description</span></Grid>
                        <Grid item xs={2}>
                        <span style = {{fontSize: '20px',color: 'grey'}}>Checked Out</span></Grid>
                        <Grid item xs={2}>
                        <span style = {{fontSize: '20px',color: 'grey'}}>Location</span></Grid>
                        <Grid item xs={2}>
                        <span style = {{fontSize: '20px',color: 'grey'}}>Owner</span></Grid>
                        <Grid item xs={0}>
                        <span style = {{fontSize: '20px',color: 'grey'}}>Group Tag</span></Grid>
                        </Grid>

                </div>
                <div>
                    {assets.map((AssetCard))}
                </div>
                <AssetCard  />
            </Container>

        </div>
        // <div>
        // {isLoading && <div> Loading... </div>}
        // {hasErrored && (
        //     <div>
        //         Loading error... try "npm run json-server" in terminal
        //         <br />
        //         <b>ERROR: {error.message}</b>
        //     </div>
        // )}
        // {success && (
        //     <div>
        //         {assets.map((AssetCard))}
        //     </div>
        // )}
        // </div>
    );
}

export default AssetList;
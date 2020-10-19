import { Container, Grid } from '@material-ui/core';
import { CallMissedSharp } from '@material-ui/icons';
import React, {useState, useEffect} from 'react';
import AssetCard from './AssetCard';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import DropDownButton from './DropDownButton';


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
        <div>
            <Container>
                <DropDownButton />
                <Grid
                    container
                    direction ='row'
                    justify="flex-start"
                    alighnItems="flex-start"
                    spacing={4}
                    >
                        <Grid item
                        direction='row'>
                            <DropDownButton name={'New'} />
                        </Grid>
                        <Grid item>
                             <DropDownButton name={'Edit'}/>  
                        </Grid>
                        <Grid item>
                            <DropDownButton name={'More'}/>
                        </Grid>
                    </Grid>
            </Container>
            <AssetCard  />
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
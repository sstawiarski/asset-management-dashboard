import { CallMissedSharp } from '@material-ui/icons';
import React, {useState, useEffect} from 'react';
import AssetCard from './AssetCard';

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
        {isLoading && <div> Loading... </div>}
        {hasErrored && (
            <div>
                Loading error... try "npm run json-server" in terminal
                <br />
                <b>ERROR: {error.message}</b>
            </div>
        )}
        {success && (
            <div>
                {assets.map((AssetCard))}
            </div>
        )}
        </div>
    );
}

export default AssetList;
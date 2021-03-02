import React, { useEffect, useState, useRef } from 'react';
import SimpleMap from '../components/SimpleMap';
import AllAssets from '../pages/AllAssets';
import {Grid} from '@material-ui/core'
import { map } from 'leaflet';

const AllAssetsWithMap = (props) =>{
    const [mapView, setMapView]=useState(false);
    const [sampleMarker,setSampleMarker]=useState([]);

    const [assetMarkers,setAssetMarkers]=useState([]);
  
    console.log("after update from table:")
    console.log(assetMarkers);
    return(
        <div>
            {mapView ? 
            <Grid container direction='row'>
                <Grid item xs={8}>
                <SimpleMap
                    data={assetMarkers}
                />
                </Grid>
                <Grid item xs={4}>
                    <AllAssets
                     handleMapSelect={()=>setMapView(true)}
                     handleListSelect={()=>setMapView(false)}
                     setSelected={(value)=>{
                        setAssetMarkers(value);
                     }
                    }
                     listButtonColor='grey'
                     mapButtonColor='black'/>
                </Grid>
            </Grid>
            :
            <div>
                <AllAssets
                handleMapSelect={()=>setMapView(true)}
                handleListSelect={()=>setMapView(false)}
                listButtonColor='black'
                mapButtonColor='grey'/>
            </div>
            }
        </div>
         
    )
}

export default AllAssetsWithMap;
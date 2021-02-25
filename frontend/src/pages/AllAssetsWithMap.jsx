import React, { useEffect, useState, useRef } from 'react';
import SimpleMap from '../components/SimpleMap';
import AllAssets from '../pages/AllAssets';
import {Grid} from '@material-ui/core'

const AllAssetsWithMap = (props) =>{
    const [mapView, setMapView]=useState(false);

    return(
        <div>
            {mapView ? 
            <Grid container direction='row'>
                <Grid item xs={8}>
                    <SimpleMap/>
                </Grid>
                <Grid item xs={4}>
                    <AllAssets
                     handleMapSelect={()=>setMapView(true)}
                     handleListSelect={()=>setMapView(false)}
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
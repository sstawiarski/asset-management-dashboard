import React, { useEffect, useState, useRef } from 'react';
import SimpleMap from '../components/SimpleMap';
import AllAssets from '../pages/AllAssets';
import {Grid} from '@material-ui/core'
import { map } from 'leaflet';

const AllAssetsWithMap = (props) =>{
    const [mapView, setMapView]=useState(false);
    const [mapMarkers,setMapMarkers]=useState(null);
    const [sampleMarker,setSampleMarker]=useState();
    
     
    if(mapMarkers){
        console.log('marker set');
        if(sampleMarker===null){
            setSampleMarker([10,20])
        }
    }
    

    return(
        <div>
            {mapView ? 
            <Grid container direction='row'>
                <Grid item xs={8}>
                    <SimpleMap
                    sample={sampleMarker}/>
                </Grid>
                <Grid item xs={4}>
                    <AllAssets
                     handleMapSelect={()=>setMapView(true)}
                     handleListSelect={()=>setMapView(false)}
                     mapState={true}
                     setMapMarkers={(selected)=>setMapMarkers(selected)}
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
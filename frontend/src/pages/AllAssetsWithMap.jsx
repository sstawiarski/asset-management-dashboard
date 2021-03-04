import React, { useEffect, useState, useRef } from 'react';
import SimpleMap from '../components/SimpleMap';
import AllAssets from '../pages/AllAssets';
import {Grid} from '@material-ui/core'
import { map } from 'leaflet';

const AllAssetsWithMap = (props) =>{
    const [mapView, setMapView]=useState(false);
    const [sampleMarker,setSampleMarker]=useState([]);

    const [assetMarkers,setAssetMarkers]=useState([]);
    const [tableSelected, setTableSelected]=useState([]);
  
    console.log("after update from table:")
    console.log(assetMarkers);

    if(tableSelected.length > 0 &&
        assetMarkers !== tableSelected){
            setAssetMarkers(tableSelected);
        }
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
                     handleMapSelect={(selected)=>{
                        setMapView(true);
                        setTableSelected(selected);
                     }
                    }
                     handleListSelect={(selected)=>{
                        setMapView(false);
                        setTableSelected(selected);
                    }
                    }
                     setSelected={(value)=>{
                        setAssetMarkers(value);
                     }
                    }
                     listButtonColor='grey'
                     mapButtonColor='black'
                     initialSelected={tableSelected}
                     setInitialSelected={(value)=>
                        setTableSelected(value)}/>
                </Grid>
            </Grid>
            :
            <div>
                <AllAssets
                handleMapSelect={(selected)=>{
                    setMapView(true);
                    setTableSelected(selected);
                 }
                }
                 handleListSelect={(selected)=>{
                    setMapView(false);
                    setTableSelected(selected);
                }
                }
                listButtonColor='black'
                mapButtonColor='grey'
                initialSelected={tableSelected}
                setInitialSelected={(value)=>
                    setTableSelected(value)}
                />
            </div>
            }
        </div>
         
    )
}

export default AllAssetsWithMap;
import React , {useState,useEffect} from 'react';


import Header from '../components/Header'
import AssetTable from '../components/AssetTable'

const AllAssets = () => {


    const [assets, setAssets] = useState([]);

    useEffect(() =>{
        const fetchAssets = async () => {
            try {
            const result = await fetch(`http://localhost:4000/assets/`);
            const json = await result.json();
            return json;
            } catch (e) {

            }
        };

        fetchAssets()
        .then(result => {
            setAssets(result);
        },);
    },[])

    return (
        <div>
        <Header heading="Assets" subheading="View All" />
        <div>    
            <AssetTable data = {assets}/>
        </div>
    </div>);

}

export default AllAssets;

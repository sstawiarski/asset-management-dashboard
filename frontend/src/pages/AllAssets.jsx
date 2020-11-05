import React , {useState,useEffect} from 'react';


import Header from '../components/Header'
import GenericTable from '../components/GenericTable'

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
            <GenericTable data = {assets} selectedFields = {["serial","assetName","assetType","owner","checkedOut","groupTag"]} />
        </div>
    </div>);

}

export default AllAssets;

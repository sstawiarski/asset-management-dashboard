import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import TextField from '@material-ui/core/TextField';
import Box from '@material-ui/core/Box';
import Tooltip from '@material-ui/core/Tooltip';
import FilterListIcon from '@material-ui/icons/FilterList';
import IconButton from '@material-ui/core/IconButton';
import AssetFilter from '../components/Dialogs/AssetFilter';
import EventFilter from '../components/Dialogs/EventFilter';
import Header from '../components/Header';
import CustomTable from '../components/Tables/CustomTable'
import TableToolbar from '../components/Tables/TableToolbar';
import ChipBar from '../components/Tables/ChipBar';

const assetFields = ["serial", "assetName", "assetType", "owner", "checkedOut", "groupTag"];
const eventFields = ["key", "eventTime", "eventType"];

const AccountDetails = () => {
    


    return (
        <div>
            <Header heading="John Smith" subheading="Account Details" />
           


      


          
        </div>

    )
};

export default AccountDetails;
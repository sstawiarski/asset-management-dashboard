import React, { useState } from 'react';

import Button from '@material-ui/core/Button';

import RetireAssetDialog from '../components/RetireAssetDialog';

const TestPage = () => {

    {/* Control open/close of retire dialog */}
    const [retireOpen, setRetireOpen] = useState(false);

    return (
        <div>
            <Button onClick={() => setRetireOpen(!retireOpen)} variant="contained" color="primary">Change asset status</Button>
            
            {/* Take in open and assets from parent component so dialog can know what is selected */}
            <RetireAssetDialog open={retireOpen} setOpen={setRetireOpen} assets={['G800-1119']} />
        </div>
    );
};

export default TestPage;
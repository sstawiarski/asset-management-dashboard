import React, { useState } from 'react';

import Button from '@material-ui/core/Button';

import RetireAssetDialog from '../components/RetireAssetDialog';

const TestPage = () => {

    const [retireOpen, setRetireOpen] = useState(false);

    return (
        <div>
            <Button onClick={() => setRetireOpen(!retireOpen)} variant="contained" color="primary">Change asset status</Button>
            <RetireAssetDialog open={retireOpen} setOpen={setRetireOpen} assets={[]} />
        </div>
    );
};

export default TestPage;
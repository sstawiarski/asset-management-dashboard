import React, { useState } from 'react';

import Button from '@material-ui/core/Button';

import CreateAssetDialog from '../components/Dialogs/CreateAssetDialog';
import CreateManifestDialog from '../components/Dialogs/CreateManifestDialog';

const TestPage = () => {

   /* Control open/close of retire dialog */
    const [createOpen1, setCreateOpen1] = useState(false);
    const [createOpen2, setCreateOpen2] = useState(false);

    return (
        <div>
            <Button onClick={() => setCreateOpen1(!createOpen1)} variant="contained" color="primary">Create Manifest</Button>

            <Button onClick={() => setCreateOpen2(!createOpen2)} variant="contained" color="primary">Create Asset</Button>
            
            {/* Take in open and assets from parent component so dialog can know what is selected */}
            <CreateManifestDialog open={createOpen1} setOpen={setCreateOpen1} />
            <CreateAssetDialog open={createOpen2} setOpen={setCreateOpen2} assets={['G800-1119']} />
        </div>
    );
};

export default TestPage;
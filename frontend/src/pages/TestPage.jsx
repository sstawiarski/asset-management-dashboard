import React, { useState } from 'react';

import Button from '@material-ui/core/Button';

import CreateAssetDialog from '../components/Dialogs/CreateAssetDialog';
import ProvisionSerials from '../components/Dialogs/ProvisionSerials';

const TestPage = () => {

    {/* Control open/close of retire dialog */}
    const [createOpen, setCreateOpen] = useState(false);

    return (
        <div>
            <Button onClick={() => setCreateOpen(!createOpen)} variant="contained" color="primary">Provision Serials</Button>
            
            {/* Take in open and assets from parent component so dialog can know what is selected */}
            <ProvisionSerials open={createOpen} setOpen={setCreateOpen} assets={['G800-1119']} />
        </div>
    );
};

export default TestPage;
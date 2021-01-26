import React, { useState } from 'react';

import Button from '@material-ui/core/Button';

import CreateAssetDialog from '../components/Dialogs/CreateAssetDialog';
import ProvisionSerials from '../components/Dialogs/ProvisionSerials';
import Login from '../components/Dialogs/Login';

const TestPage = () => {

   /* Control open/close of retire dialog */
    const [createOpen1, setCreateOpen1] = useState(false);
    const [createOpen2, setCreateOpen2] = useState(false);
    const [createOpen3, setCreateOpen3] = useState(false);

    return (
        <div>
            <Button onClick={() => setCreateOpen1(!createOpen1)} variant="contained" color="primary">Provision Serials</Button>

            <Button onClick={() => setCreateOpen2(!createOpen2)} variant="contained" color="primary">Create Asset</Button>

            <Button onClick={() => setCreateOpen3(!createOpen3)} variant="contained" color="primary">Login</Button>
            
            {/* Take in open and assets from parent component so dialog can know what is selected */}
            <ProvisionSerials open={createOpen1} setOpen={setCreateOpen1} assets={['G800-1119']} />
            <CreateAssetDialog open={createOpen2} setOpen={setCreateOpen2} assets={['G800-1119']} />
            <Login open ={createOpen3} setOpen={setCreateOpen3}/>
        </div>
    );
};

export default TestPage;
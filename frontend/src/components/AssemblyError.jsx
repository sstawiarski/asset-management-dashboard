import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles'
import { Collapse } from '@material-ui/core';


export default function AssemblyError() {
    const [open,setOpen] = React.useState(false);
  return (
      <Collapse in ={open}>
    <Alert severity="error" action={
        <Button size="small"
        onClick={()=>{
            setOpen(false)
        }}>
            Edit Assembly
        </Button>
    }>
    <AlertTitle>Error</AlertTitle>
    An item in this assembly is already in use.
  </Alert>
  </Collapse>
  );
}
import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles'


export default function AssemblyError() {
  return (
    <Alert severity="error" action={
        <Button size="small">
            Edit Assembly
        </Button>
    }>
    <AlertTitle>Error</AlertTitle>
    An item in this assembly is already in use.
  </Alert>
  );
}
import React from 'react'
import { Box, Container } from '@material-ui/core';

const AssetPageHeader =() =>{
    return(        
        <Container>
            <Box
            borderBottom={1}
            color='skyblue'
            >
                <h1 style={{textAlign: 'left',color: 'skyblue'}}> Assets </h1>
            </Box>
        </Container>
);
}

export default AssetPageHeader;
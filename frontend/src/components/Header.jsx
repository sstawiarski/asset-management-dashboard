import React from 'react';

import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import Box from '@material-ui/core/Box'


const Header = ({ heading, subheading }) => {
    return (
        <div className="header" style={{display: "flex", flexFlow: "wrap", marginLeft: "10px", marginBottom: "20px"}}>
            <Typography variant="h3">{heading}</Typography>
            <hr style={{flexBasis: "100%"}} />
            {subheading ? <Typography variant="h5">{subheading}</Typography> : null}
        </div>
    );
};

export default Header;
import React from 'react';

import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'


const Header = ({ heading, subheading }) => {
 return (
        <div style={{flexGrow: 1, padding: "40px", float: "left"}}>
            <Typography variant="h2">{heading}</Typography>
            <Divider />
            {subheading ? <Typography variant="h4">{subheading}</Typography> : null}
        </div>
    );
};

export default Header;
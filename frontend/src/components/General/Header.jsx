import React from 'react';

import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider';


const Header = ({ heading, subheading = "" }) => {
    return (
        <div className="header" style={{ display: "flex", flexFlow: "wrap", marginLeft: "10px", marginBottom: "20px", marginRight: "7vh" }}>
            <Typography variant="h4">{heading}</Typography>
            <Divider style={{ flexBasis: "100%" }} />
            {subheading ? <Typography variant="h6">{subheading}</Typography> : null}
        </div>
    );
};

export default Header;
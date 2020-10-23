<<<<<<< HEAD
  
import React from 'react';

import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'


const Header = ({ heading, subheading }) => {
 return (
        <div style={{flexGrow: 1, padding: "40px", float: "left"}}>
            <Typography variant="h2">{heading}</Typography>
            <Divider />
            {subheading ? <Typography variant="h4">{subheading}</Typography> : null}
=======
import React from 'react';

import Typography from '@material-ui/core/Typography'


const Header = ({ heading, subheading }) => {
    return (
        <div className="header" style={{display: "flex", flexFlow: "wrap", marginLeft: "10px", marginBottom: "20px"}}>
            <Typography variant="h3">{heading}</Typography>
            <hr style={{flexBasis: "100%"}} />
            {subheading ? <Typography variant="h5">{subheading}</Typography> : null}
>>>>>>> development
        </div>
    );
};

export default Header;
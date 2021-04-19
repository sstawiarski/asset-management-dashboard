import React, { FC } from "react";
import PropTypes from "prop-types";

import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";

type HeaderProps = {
    heading: string;
    subheading?: string;
};

const Header: FC<HeaderProps> = ({ heading, subheading = "" }) => {
    return (
        <div
            className="header"
            style={{ display: "flex", flexFlow: "wrap", marginLeft: "10px", marginBottom: "20px", marginRight: "7vh" }}>
            <Typography variant="h4">{heading}</Typography>
            <Divider style={{ flexBasis: "100%" }} />
            {subheading ? <Typography variant="h6">{subheading}</Typography> : null}
        </div>
    );
};

Header.propTypes = {
    heading: PropTypes.string.isRequired,
    subheading: PropTypes.string,
};

export default Header;

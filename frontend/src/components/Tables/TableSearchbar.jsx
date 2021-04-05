import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

//Material-UI Imports
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';

//Icons
import SearchIcon from '@material-ui/icons/Search'
import ClearIcon from '@material-ui/icons/Clear';

const useStyles = makeStyles({
    searchbar: {
        marginTop: "5px",
        width: "60%"
    }
});

const TableSearchbar = ({ onInputChange, onClear, onSearch, disabled = false, searchValue = "" }) => {
    const classes = useStyles();

    return (
        <TextField
            className={classes.searchbar}
            variant="outlined"
            size="small"
            fullWidth
            disabled={disabled}
            onChange={onInputChange}
            value={searchValue}
            InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                        <SearchIcon />
                    </InputAdornment>
                ),
                endAdornment: searchValue && (
                    <InputAdornment position="end">
                        <IconButton
                            onClick={onClear}
                            size="small">
                            <ClearIcon />
                        </IconButton>
                    </InputAdornment>
                )
            }}
            onKeyDown={onSearch}
        />
    )
};

TableSearchbar.propTypes = {
    /**
     * onChange handler
     */
    onInputChange: PropTypes.func.isRequired, 
    /**
     * Textbox clear handler
     */
    onClear: PropTypes.func.isRequired, 
    /**
     * onKeyDown handler, usually for 'Enter'
     */
    onSearch: PropTypes.func.isRequired, 
    /**
     * Disable textbox
     */
    disabled: PropTypes.bool, 
    /**
     * Textbox input value
     */
    searchValue: PropTypes.string
}

export default TableSearchbar;
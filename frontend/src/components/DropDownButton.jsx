import React from 'react';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import { Add, Edit, MoreHoriz } from '@material-ui/icons';
import { Container, Grid } from '@material-ui/core';
import './DropDownButton.css'

const DropDownButton = ({name}) => {
    return(
        <div>
            {(()=>{
                switch (name) {
                    case 'New':
                        return(
                            <div id = 'dropbutton'>
                                <Add />
                                <h3>New</h3>
                                <button><ArrowDropDownIcon/></button>
                            </div>

                        )
                        break;
                    case 'Edit':
                        return(
                            <div>
                                <Edit />
                                 <h3>Edit</h3>
                                 <button><ArrowDropDownIcon/></button>
                            </div>
                        )                   
                        break;
                        case 'More':
                        return(
                           <div>
                               <MoreHoriz />
                                  <h3>More</h3>
                                  <button><ArrowDropDownIcon/></button>
                            </div>
                        )
                        break;
                    default:
                        return(
                            <div id='dropbutton'>
                                <Grid>
                                    <Grid item ><MoreHoriz />
                                    <h3>More</h3>
                                    <button><ArrowDropDownIcon/></button>
                                    </Grid>
                                </Grid>
                             </div>
                         )
                        break;
                }
            })()}
        </div>
    );
}

export default DropDownButton;
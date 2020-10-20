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
                                New
                                <button><ArrowDropDownIcon/></button>
                            </div>

                        )
                        break;
                    case 'Edit':
                        return(
                            <div>
                                <Edit />
                                 Edit
                                 <button><ArrowDropDownIcon/></button>
                            </div>
                        )                   
                        break;
                        case 'More':
                        return(
                           <div>
                               <MoreHoriz />
                                  More
                                  <button><ArrowDropDownIcon/></button>
                            </div>
                        )
                        break;
                    default:
                        return(
                                <span>
                                    <MoreHoriz />
                                    Test
                                    <button><ArrowDropDownIcon/></button>
                                </span>
                         )
                        break;
                }
            })()}
        </div>
    );
}

export default DropDownButton;
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
                            <div 
                            style = {{padding: '3px 17px 3px 17px'}}>
                                <Add />
                                <span 
                                style = {{padding: '3px 10px 3px 10px'}}>New</span>
                                <button><ArrowDropDownIcon/></button>
                            </div>

                        )
                        break;
                    case 'Edit':
                        return(
                            <div
                            style = {{padding: '3px 10px 3px 10px'}}>
                                <Edit />
                                 <span
                                 style = {{padding: '3px 10px 3px 10px'}} >Edit</span>
                                 <button><ArrowDropDownIcon/></button>
                            </div>
                        )                   
                        break;
                        case 'More':
                        return(
                           <div
                           style = {{padding: '3px 1px 3px 17px'}}>
                               <MoreHoriz />
                                  <span
                                  style = {{padding: '3px 10px 3px 10px'}}>More</span>
                                  <button><ArrowDropDownIcon/></button>
                            </div>
                        )
                        break;
                    default:
                        return(
                                <div
                                style = {{padding: '3px 17px 3px 17px'}}>
                                    <MoreHoriz />
                                    <span
                                  style = {{padding: '3px 10px 3px 10px'}}>Test</span>
                                    <button><ArrowDropDownIcon/></button>
                                </div>
                         )
                        break;
                }
            })()}
        </div>
    );
}

export default DropDownButton;
import React from 'react';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import { Add, Edit, MoreHoriz } from '@material-ui/icons';


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
                                style = {{padding: '3px 10px 3px 10px', fontSize: '23px'}}>New</span>
                                <button><ArrowDropDownIcon/></button>
                            </div>
                        );
                    case 'Edit':
                        return(
                            <div
                            style = {{padding: '3px 10px 3px 10px'}}>
                                <Edit />
                                 <span
                                 style = {{padding: '3px 10px 3px 10px', fontSize: '23px'}} >Edit</span>
                                 <button><ArrowDropDownIcon/></button>
                            </div>
                        ) ;                  
                        case 'More':
                        return(
                           <div
                           style = {{padding: '3px 1px 3px 17px'}}>
                               <MoreHoriz />
                                  <span
                                  style = {{padding: '3px 10px 3px 10px', fontSize: '23px'}}>More</span>
                                  <button><ArrowDropDownIcon/></button>
                            </div>
                        );
                    default:
                        return(
                                <div
                                style = {{padding: '3px 17px 3px 17px'}}>
                                    <MoreHoriz />
                                    <span
                                  style = {{padding: '3px 10px 3px 10px', fontSize: '23px'}}>Test</span>
                                    <button><ArrowDropDownIcon/></button>
                                </div>
                         );
                }
            })()}
        </div>
    );
}

export default DropDownButton;
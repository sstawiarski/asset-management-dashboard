import { PriorityHigh } from '@material-ui/icons'
import React from 'react'

const GroupTag= ({groupType}) =>{
    return(
        <div>
            {(() =>{
                switch (groupType){
                    case 'important':
                        return(
                        <div>
                            <PriorityHigh />
                        </div>
                        )
                        break;
                        
                    default:
                        break;
                }
            })()}
        </div>
    );
}

export default GroupTag;
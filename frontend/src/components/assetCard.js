import React from 'react';

const AssetCard = ({id, assetName,assetType,owner}) => (
    <div>
        <div>{`${assetName} ${assetType} ${owner}`}</div>
    </div>
)

export default AssetCard;
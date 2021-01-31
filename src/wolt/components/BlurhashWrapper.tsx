import React from 'react';
import { Blurhash } from 'react-blurhash';

import { isWide } from '../utils';

import imgOffline from '../resources/blurhash_offline_mask.png';
import imgOfflineSmall from '../resources/blurhash_offline_mask_small.png';
import '../css/blurhash.css';

interface Props {
    hash: string;
    online: boolean;
}

//===================================================================/

const BlurhashWrapper: React.FC<Props> = ({hash, online}) => {

    const bhWidth = isWide() ? 300 : 230;
    const bhHeight = isWide() ? 270: 230;

    document.body.style.setProperty('--blurhash-width', `${bhWidth}px`);
    document.body.style.setProperty('--blurhash-height', `${bhHeight}px`);
    
    return (
        <div className={'blurhash '.concat(isWide() ? 
            'blurhash--normal' : 'blurhash--small'
        )}>
            <img 
                src={isWide() ? imgOffline : imgOfflineSmall} 
                draggable={false}
                className={'blurhash__mask '.concat(online ? 
                    'blurhash__mask--online' : 'blurhash__mask--offline'
                )}
            />
            <Blurhash 
                hash={hash}
                width={bhWidth}
                height={bhHeight}
            />
        </div>
    );
}

//===================================================================/
//
export default BlurhashWrapper;


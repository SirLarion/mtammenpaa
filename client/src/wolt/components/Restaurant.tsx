import React from 'react';

import BlurhashWrapper from './BlurhashWrapper';

import { RestaurantType } from '../types';
import '../css/restaurant.css';

//===================================================================/
/*
 * Represents a single element (restaurant) in a Carousel
 */
const Restaurant: React.FC<{ data: RestaurantType; }> = ({data}) => {
    return (
        <div className='restaurant'>
            <BlurhashWrapper
                hash={data.blurhash}
                online={data.online}
            />
            <div className='restaurant__title noselect'>
                { data.name }
            </div>
        </div>
    );
}

//===================================================================/

export default Restaurant;

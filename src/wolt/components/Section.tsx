import React from 'react';

import '../css/section.css';

// Carousel element by Maksim Marinich: https://github.com/maxmarinich/react-alice-carousel
import AliceCarousel from 'react-alice-carousel';
import 'react-alice-carousel/lib/alice-carousel.css';

import Restaurant from './Restaurant';
import { isWide } from '../utils';
import { SectionType, RestaurantType } from '../types';


/*
 * Helper method for mapping list of restaurants to corresponding Carousel
 * items
 */
function toRestaurantCard(restaurant: RestaurantType, index: number) {
    return (
        <div key={index}>
            <Restaurant data={restaurant} />
        </div>
    );
}

const responsive = {
    0: { items: 1 },
    400: { items: 2 },
    1300: { items: 4 }
};

//===================================================================/
/*
 * Represents a section of the discovery page containing a list
 * of restaurants filtered according to a certain rule (e.g. 'nearby',
 * 'popular', 'new' etc.)
 */
const Section: React.FC<{ data: SectionType; }> = ({ data }) => {

    const items = data.restaurants.map(toRestaurantCard);


    return (
        <div className='section'>
            <div role='wrapper' className={ 'section__wrapper '.concat(isWide() ? 'wrapper--85' : 'wrapper--100') }>
                <div className={ 'noselect section__header'.concat(isWide() ? '' : ' section__header--padding') }>
                    { data.title }
                </div>
                <div className='section__body'>
                    <AliceCarousel 
                        items={items} 
                        responsive={responsive} 
                        mouseTracking
                        infinite
                        swipeDelta={5}
                        paddingLeft={35}
                    />
                </div>
            </div>
        </div>
    );
}
//===================================================================/

export default Section;

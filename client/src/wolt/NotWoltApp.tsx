import React from 'react';
import { useState } from 'react';

import './css/index.css';
import './css/App.css';

import logo from './resources/notwolt.svg';
import data from './resources/discovery_page.json';

import Section from './components/Section';
import { SectionType } from './types';
import { isWide } from './utils';

/*
 * Helper method for mapping list of sections to corresponding divs
 */
function toSection(sectionData: SectionType, index: number) {
    return (
        <div key={index}> 
            <Section 
                data={sectionData} 
            />
        </div>
    );
}

//===================================================================/
/*
 * NotWolt - a prototype discovery page made for Wolt's Summer 2021
 * frontend job application pre-assignment
 */
const NotWoltApp: React.FC = () => {

    const [reload, setReload] = useState(0);

    /* The element somewhy didn't work correctly in the live demo
     * before it was refreshed (twice). This is a hacky way to refresh it */
    setTimeout(() => {if(reload < 2) setReload(reload +1);}, 10);

    document.body.onresize = () => setReload(reload+1);

    return (
        <div className='app'>
            <div role='wrapper' className={ 'app__wrapper '.concat(isWide() ? 
                    'wrapper--85' : 'wrapper--100')
            }>
                <div className='app__header'>
                    <img className='app__logo' src={logo} alt='NotWolt logo' draggable={false} />
                    <div className='app__discover'>Discover</div>
                </div>
                <div className='app__body'>
                    { data['sections'].map(toSection) }
                </div>
            </div>
        </div>
    );
}

//===================================================================/
//
export default NotWoltApp;

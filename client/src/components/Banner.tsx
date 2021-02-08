import AliceCarousel from 'react-alice-carousel';
import 'react-alice-carousel/lib/alice-carousel.css';

import PromoElement from './PromoElement';

import '../css/banner.css';

function toPromoElement(url: string, index: number) {
    return (
        <div className='promo__wrapper' key={index}>
            <PromoElement 
                resourceURL={url}
            />
        </div>
    );
}

const Banner: React.FC = () => {

    const promoURLs = [
        '/images/natureman.png',
        '/images/aimball.GIF',
        '/images/solsim.GIF'
    ];

    const responsive = {
        0: { items: 1 }
    };

    const items = promoURLs.map(toPromoElement);

    return (
        <div className='banner'>
            <div className='banner__whitespace'></div>
            <div className='banner__wrapper'>
                <img 
                    className='banner__name noselect' 
                    src='/images/miskabanner.svg' 
                    alt='Miska Tammenpaa' 
                    draggable={false}
                />
                <div className='banner__promo'>
                    <AliceCarousel
                        items={items}
                        responsive={responsive}
                        autoPlay
                        autoPlayInterval={6000}
                        infinite
                        mouseTracking
                    />
                </div>
            </div>
        </div>
    );
}

export default Banner;

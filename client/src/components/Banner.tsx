import bannerImg from '../resources/miskabanner.svg';
import promoImg from '../resources/aimball.GIF';

import '../css/banner.css';

const Banner: React.FC = () => {
    return (
        <div className='banner'>
            <div className='banner__whitespace'></div>
            <div className='banner__wrapper'>
                <img className='banner__name' src={bannerImg} alt='Miska Tammenpaa' />
                <img className='banner__promo' src={promoImg} alt='Nature man'/>
            </div>
        </div>
    );
}

export default Banner;

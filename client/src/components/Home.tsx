import Banner from './Banner';
import Social from './Social';

import '../css/home.css';

const Home: React.FC = () => {
    return (
        <div className='home'>
            <Banner />
            <Social />
        </div>
    );
}


export default Home;

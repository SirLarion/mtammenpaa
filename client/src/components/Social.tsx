import linkedinLogo from '../resources/linkedin.svg';
import githubLogo from '../resources/github.svg';
import instagramLogo from '../resources/insta.svg';

import '../css/social.css'; 

const Social: React.FC = () => {
    return (
        <div className='social'>
            <div className='social__wrapper'>
                <a href='https://www.linkedin.com/in/miska-tammenpaa/' target="_blank" rel="noopener noreferrer">
                    <img className='social__icon' src={linkedinLogo} alt='LinkedIn logo'/>
                </a>
                <a href='https://github.com/SirLarion' target="_blank" rel="noopener noreferrer">
                    <img className='social__icon' src={githubLogo} alt='Github logo'/>
                </a>
                <a href='https://www.instagram.com/sirlarion/' target="_blank" rel="noopener noreferrer">
                    <img className='social__icon' src={instagramLogo} alt='Instagram logo'/>
                </a>
            </div>
        </div>
    );
}

export default Social;


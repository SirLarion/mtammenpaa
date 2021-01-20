import banner from '../resources/miskabanner.svg';
import flame from '../resources/natureman.png';

import linkedinLogo from '../resources/linkedin.svg';
import githubLogo from '../resources/github.svg';
import instagramLogo from '../resources/insta.svg';

import '../css/App.css';

function App() {
  return (
    <div className='App'>
        <div className='name'>
            <div className='name__whitespace'></div>
            <div className='name__wrapper'>
                <img className='name__banner' src={banner} alt='Miska Tammenpää' />
                <img className='name__flame' src={flame} alt='Pyromancer'/>
            </div>
        </div>
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
    </div>
  );
}

export default App;

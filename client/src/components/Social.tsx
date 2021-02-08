import '../css/social.css'; 

const Social: React.FC = () => {
    return (
        <div className='social'>
            <div className='social__wrapper'>
                <a href='https://www.linkedin.com/in/miska-tammenpaa/' draggable={false} target="_blank" rel="noopener noreferrer">
                    <img 
                        className='social__icon noselect' 
                        src='/images/linkedin.svg' 
                        alt='LinkedIn logo'
                        draggable={false}
                    />
                </a>
                <a href='https://github.com/SirLarion' draggable={false} target="_blank" rel="noopener noreferrer">
                    <img 
                        className='social__icon noselect' 
                        src='/images/github.svg' 
                        alt='Github logo'
                        draggable={false}
                    />
                </a>
                <a href='https://www.instagram.com/sirlarion/' draggable={false} target="_blank" rel="noopener noreferrer">
                    <img 
                        className='social__icon noselect' 
                        src='/images/insta.svg' 
                        alt='Instagram logo'
                        draggable={false}
                    />
                </a>
            </div>
        </div>
    );
}

export default Social;


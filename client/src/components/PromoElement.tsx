import '../css/promo.css';

const PromoElement: React.FC<{resourceURL: string}> = ({resourceURL}) => {
    return (
        <img 
            className='promo__image'
            src={resourceURL} 
            alt='Promotional media' 
            draggable={false}  
        />
    );
}

export default PromoElement;

import { BrowserRouter, Route } from 'react-router-dom';

import Home from './components/Home';

import './css/main.css';

const Main: React.FC = () => {

    return (
        <BrowserRouter>
            <div className='main'>
                <Route exact path='/'>
                    <Home />
                </Route>
            </div>
        </BrowserRouter>
    );
}

export default Main;

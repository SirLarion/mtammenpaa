import { BrowserRouter, Route } from 'react-router-dom';

import Home from './Home';
import NotWoltApp from './wolt/NotWoltApp';

import './css/App.css';

const App: React.FC = () => {

    return (
        <BrowserRouter>
            <div className='main'>
                <Route exact path='/'>
                    <Home />
                </Route>
                <Route path='/wolt'>
                    <NotWoltApp />
                </Route>
            </div>
        </BrowserRouter>
    );
}

export default App;

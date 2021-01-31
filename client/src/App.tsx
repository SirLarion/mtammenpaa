import { BrowserRouter, Route } from 'react-router-dom';

import Home from './Home';
import NotWoltApp from './wolt/NotWoltApp';

import './css/App.css';

const express = require('express');
const app = express();

app.use(express.static(path.join(__dirname, 'build')));

app.get('/*', function(req,res) {
		res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

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

const cors = require('cors');
const express = require('express');
require('dotenv').config(); 

const app = express();

app.use(express.static(path.join(__dirname, 'build')));

app.get('/*', function(req,res) {
		res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const PORT = process.env.PORT;

app.listen(PORT, () => { 'Server running' });


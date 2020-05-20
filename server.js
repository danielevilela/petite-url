const express = require('express');
const mongoose = require('mongoose');
const PetiteUrl = require('./models/petiteUrl');
const app = express();

mongoose.connect('mongodb://localhost/petiteurl',{
    useNewUrlParser: true, useUnifiedTopology: true
});

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));

app.get('/', async(req, res) => {
    const listUrls = await PetiteUrl.find();
    res.render('index', {listUrls}); 
});

app.post('/shortUrl', async (req, res)=> {
    await PetiteUrl.create({ originalUrl: req.body.originalUrl});
    res.redirect('/');
});

app.get('/:shortUrl', async(req, res) => {
    const shortUrl = await PetiteUrl.findOne({ shortUrl: req.params.shortUrl});

    if(shortUrl == null) return res.sendStatus(404);

    shortUrl.clicks++;
    shortUrl.save();

    res.redirect(shortUrl.originalUrl);
});

app.listen(process.env.PORT || 5000);

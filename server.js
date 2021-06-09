const express = require('express')
const app = express()
const PORT = process.env.PORT || 9899
const mongoose = require('mongoose')

const ShortURL = require('./models/shortURL')

app.set('view engine', 'ejs')
app.use(express.urlencoded({extended: false}))

mongoose.connect('mongodb://localhost/urlShortener', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

app.get('/', async (req, res) => {  
  const shortUrls = await ShortURL.find()
 
  console.log(shortUrls)

  res.render('index', {shortURls: shortUrls})
})

app.post('/shortUrls', async (req, res) => {
  await ShortURL.create({full: req.body.fullURL})

  res.redirect('/')
})

app.get('/:shortUrl', async (req, res) => {
  try {
    let shortURL = await ShortURL.findOne({ short: req.params.shortUrl })

    console.log(ShortURL)
  
    if (shortURL == null) {
      return res.status(404).send(`URL of ${shortURL} doesn't exist`)
    }
  
    shortURL.clicks++
    shortURL.save()
  
    res.redirect(shortURL.full)
  } catch (error) {
    res.status(500).json({message: error.message})
  }
})

app.listen(PORT, () => console.log(`Running server on port ${PORT}`))
const path = require('path');
const helmet = require('helmet')
const mongoSanitize = require('express-mongo-sanitize');
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const sauceRoutes = require('./routes/sauceRoute');
const userRoutes = require('./routes/userRoute');

                          //passé sur env
mongoose.connect(process.env.CLUSTER,
{ useNewUrlParser: true,
  useUnifiedTopology: true })
.then(() => console.log('Connexion à MongoDB réussie !'))
.catch(() => console.log('Connexion à MongoDB échouée !'));
                          // ENV

const app = express();


app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use(express.json());

app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(helmet.xssFilter());

//sanitize pour éviter les attaques XSS
app.use(
  mongoSanitize({
      allowDots: true,
      replaceWith: '_',
  }),
);
app.use(
  mongoSanitize({
      onSanitize: ({ req, key }) => {
          console.warn(`This request[${key}] is sanitized`, req);
      },
  }),
);

app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);

module.exports = app; 
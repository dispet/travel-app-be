require('dotenv').config();

const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');

const { StatusCodes, ReasonPhrases } = require('http-status-codes');

const errorMiddleware = require('./middleware/error-middleware');
const requestLogMiddleware = require('./middleware/request-logger');

const app = express();
const swaggerDoc = YAML.load(path.join(__dirname, './docs/doc.yaml'));

app.use(cors());
app.use(helmet());
app.use(express.json());

app.use(requestLogMiddleware);

app.use('/favicon.ico', (req, res) => res.sendStatus(StatusCodes.NO_CONTENT));
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

const loader = multer({ dest: path.join(__dirname, 'tmp') });

app.post('/', loader.single('avatar'), async function (req, res) {
  try {
    const result = await cloudinary.uploader.upload(
      req.file.path,
      'bo_1px_solid_rgb:ffffff,c_fill,co_rgb:ffffff,e_redeye,g_faces:center,h_180,o_100,r_max,w_180,z_1.0'
    );
    res.send(result);
  } catch (error) {
    res.send(error);
  }
  fs.unlink(req.file.path);
});

// Routers
const countryRouter = require('./modules/countries/country.router');

app.use('/countries', countryRouter);

app.use((req, res) => {
  res.status(StatusCodes.NOT_IMPLEMENTED).send(ReasonPhrases.NOT_IMPLEMENTED);
});

app.use(errorMiddleware);

module.exports = app;

const { Schema, model } = require('mongoose');

const localeSchema = new Schema({
  _id: false,
  lang: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  capital: {
    type: String,
    required: true,
  },
  capitalName: {
    type: String,
    required: true,
  },
  about: {
    type: String,
    required: true,
  },
});

const countrySchema = new Schema({
  bgImage: String,
  previewImage: String,
  video: String,
  utc: Number,
  web: String,
  currency: {
    type: String,
    required: true,
  },
  countryCode: {
    type: String,
    uppercase: true,
    unique: true,
    required: true,
  },
  capitalLocation: {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  localizations: [localeSchema],
});

const Country = model('Country', countrySchema);

module.exports = Country;

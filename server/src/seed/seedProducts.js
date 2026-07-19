require('dotenv').config({ path: '../../.env' });
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Product = require('../models/Product');

const clothing = require('./data/clothing.json');
const watches = require('./data/watches.json');
const shoes = require('./data/shoes.json');

const importData = async () => {
  try {
    await connectDB();

    await Product.deleteMany();
    
    // Add all products
    const sampleProducts = [...clothing, ...watches, ...shoes];
    await Product.insertMany(sampleProducts);

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

importData();

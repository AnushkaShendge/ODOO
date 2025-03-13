require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const corsOptions = require('./config/corsOptions')
const PORT = process.env.PORT || 5000;
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const connectDB = require('./config/dbConn')
const supabase = require('./config/supabaseConfig');



connectDB();

app.use(cors(corsOptions));

app.use(express.urlencoded({extended:false}));

app.use(express.json());

app.use(cookieParser());

app.use('/api', require('./routes/authRoutes'));

app.use('/api' , require('./routes/userRoutes') )




app.listen(PORT,()=>console.log(`Server running on Port ${PORT}`));
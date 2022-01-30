const express = require ('express');
const mongoose = require ('mongoose');
const cors = require ('cors');
const dotenv = require ('dotenv');


//Import Model
const devCredits = require('./model/model.js');
const req = require('express/lib/request');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


const port = process.env.PORT || 3000;

mongoose.connect(
    process.env.MONGODB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }
).then( () => {
    console.log('Database connection successful!');
}).catch( (err) => {
    console.log(err);
});



app.listen(port, async()=>{
    console.log(`Server is live on Port: ${port}`);
});

app.get('/', function(req, res) {
    res.send('We are getting better');
});

app.post('/post', function(req, res) {
    const credit = new devCredits({
        id: req.body.id,
        credits: req.body.credits,
    });

    devCredits.countDocuments({id: req.body.id}, function(err, count){
        if (count > 0) {
            devCredits.findOneAndUpdate(
                {id: req.body.id},
                {
                    $inc: {
                        credits: req.body.credits,
                    },
                },
                {new: true},
                (err, devCredit) => {
                    if (err) {
                        res.send(err);
                    } else res.json(devCredit);
                }
            );
        } else {
            credit.save((err, credits)=> {
                if(err) {
                    res.send(err);
                }
                res.json(credits);
            });
        }
    });
});

app.get('/get/:id', function (req, res) {
    devCredits.find({id: req.params.id}, {_id: 0, __v: 0}, (err, data) => {
        if(err) {
            res.json(err);
        }
        res.json(data);
    });
});
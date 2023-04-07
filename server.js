// Importing all modules
const path = require('path');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const formScript = require('./scripts/formSave.js');
const counterSchema = require('./scripts/models/counterSchema.js');
const formSchema = require('./scripts/models/formSchema.js');
const {Client, GatewayIntentBits, Events, EmbedBuilder} = require('discord.js');
const {body, validationResult} = require('express-validator');
require('dotenv').config();

const port = 80; // Just setting the port here....


// Configuring Express related stuff here
// app.use(express.static('src'));
app.use(express.static(path.join(__dirname,'/src')));
app.use(express.urlencoded());

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, './webpages'));

// Setting Discord Client
const client = new Client({
    intents:[GatewayIntentBits.Guilds, 
                GatewayIntentBits.DirectMessages,
                GatewayIntentBits.DirectMessageTyping, 
                GatewayIntentBits.DirectMessageReactions,
                GatewayIntentBits.GuildMessages
            ]
});

client.once(Events.ClientReady , c => {
    console.log(`Discord CLient ${c.user.tag} is up`)
});


// Setting Pages of the Website

app.get('/', (req, res) => {
    res.status(200).render('homepage.pug',{'title':'About me...'});
});

app.get('/contact', async (req,res) => {
    res.status(200).render('contact.pug',{'title':'Contact','success':'false', 'error':'false'});    
});


// Handling POST request by the website
app.post('/contact',
    body('message').isLength({
        min:20
    }),
    (req,res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log(errors.array())
            res.render('contact.pug',{'title':'Contact', 'success':'false', 'error':'true'});
            return
        }
        res.render('contact.pug', {'title':'Success','success':'true','error':'false'});
    
    client.login(process.env.TOKEN).then( async ()=> {
        
        const ID = await formScript(counterSchema, formSchema, req.body);
        const current = new Date();
        res.redirect(`/contact?submit=true&ID=${ID}`);

        setTimeout( async () => {    
            await client.channels.cache.get(`1089459307738845204`).send({
            content:'<@321638481803739147>',
            embeds:[
                new EmbedBuilder()
                    .setColor('Aqua')
                    .setTitle(`New Message! From: ${req.body.name}`)
                    .setDescription(`${req.body.message}`)
                    .setFields({
                        name:'Mail',value: req.body.mail == '' ? 'No Mail Provided':`${req.body.mail}`
                    }, {
                        name:'Time and Date', value:`${current.getHours()}:${current.getMinutes()}:${current.getSeconds()}:${current.getMilliseconds()} => ${current.getDate()}-${current.getMonth()}-${current.getFullYear()}`
                    }, {
                        name:'ID', value:`${ID}`
                    })
                    .setTimestamp()
            ] 
        });
        await console.log('Message was sent successfully!');
        await client.destroy();
        await console.log('The discord client was destroyed successfully');
    }, 3000);
    
    });
    
});


// Connecting the Database and Listening for connections
mongoose.connect(process.env.MONGOURL).then(() => {

    console.log('Connected to database successfully');
    
    // Listening for connections
    app.listen(80, ()=> {
        console.log(`App is live at http://localhost:${port}`);
    });

}).catch((err) => {
    console.log(`Error While Connecting to Database...\n${err}`);
});
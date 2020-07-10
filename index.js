const admin = require('firebase-admin');
const express = require('express');

const app = express();
app.use(express.json());

const port = process.env.PORT || 8080;
app.listen(port,() => {
    console.log(`MyPortal REST API is listening on port ${port}`)
});

app.get('/', async(req,res) => {
    res.json({status:'My Town is ready to roll!'})    
});

//Intialize firebase APP. Since this is going to run in Cloud run  firebase will take default credentials from GCP. MAke sure to config set your project.
admin.initializeApp({
    credential:admin.credential.applicationDefault()
});

//Intialize firestoreDB instance
const db = admin.firestore();

//Perform a read operation from firestore
app.get('/:town', async(req,res) => {
    let town = req.params.town;
    let muniRef = db.collection('muniList');
    let query = muniRef.where('name','==', town);
    let results =await query.get();
    let retVal = results.docs.map(doc => {
        return {...doc.data()}
    })
    res.json(retVal);
});

//Perform a write operation to a collection in firestore
app.post('/', async(req,res) =>{
    await db.collection('muniList').doc().set(req.body);
    res.json({status:'success', data:{muni:req.body}})
});



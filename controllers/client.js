// var Client = require('../models/client')

// // Creating the endpoint /api/clients for POST requests
// exports.postClients = (req, res) => {
//     // Creating new instance of the Client model
//     var Client = new Client()

//     client.name = req.body.name;
//     client.id = req.body.id;
//     client.secret = req.body.secret;
//     client.userId = req.body._id

//     client.save(err => {
//         if(err)
//             res.send(err)

//         res.json({message: 'Client added!', data: client});
//     });
// };

// // Creating endpoint /api/clients for GET
// exports.getClients = (req, res) => {
//     Client.find({userId: req.user._id}, (err, clients) => {
//         if(err)
//             res.send(err)
        
//         res.json(clients);
//     });
// };
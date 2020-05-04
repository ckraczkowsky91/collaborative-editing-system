const mongoose = require('mongoose');
const models = require('./models');
const operationalTransformation = require('./operationalTransformation');

const Mutation = mongoose.model('Mutation', models.mutationSchema);
const Conversation = mongoose.model('Conversation', models.conversationSchema);

const ping = (req, res) => {
  res.status(200).send({
    'ok': true,
    'msg': 'pong'});
};

const getInfo = (req, res) => {
    res.status(200).send({
      'ok': true,
      'author': {
        'email': 'ckraczkowsky@gmail.com',
        'name': 'Colin Kraczkowsky'
      },
      'frontend': {
        'url': 'https://peaceful-badlands-71097.herokuapp.com/'
      },
      'language': 'node.js',
      'sources': 'https://github.com/ckraczkowsky91/collaborative-editing-system',
      'answers': {
        '1': "My approach started with drawing out how I believed the algorithm should work and breaking it down into cases based on the examples. I used that to design and implement the database schema which I chose to do in MongoDB because it is flexible and easy to change the schema if needed, and because I'm familiar with it and I was on a time crunch. I decided to tackle the insert case first and started with implementing the backend because I'm applying for the Full-Stack/Backend Engineer role and backend interests me more. I used Node.js because it is my preferred runtime environment and JavaScript is my preferred language. Once I believed that I had the insert case working, I started working on the frontend so that I would have at least a basic frontend working within the timebox. I used React.js to build a master-detail interface because I thought that it best suited the relationship between conversations and mutations. I then tested the frontend and the backend where I discovered some bugs. Unfortunately I ran out of time while debugging, so I firmed up my existing code so that it would work and then created some work-in-progress files where I could continue coding and making improvements.",
        '2': 'If I had more time, I would add support for the delete and insert with conflict cases. I would learn about serverless frameworks and implement one, because I think that my solution has scalability concerns. I would add security, probably with JSON Web Tokens and bcrypt, so that only authorized users could access the endpoints. I would edit the code renaming variables and functions to improve clarity, and I would reorganize my project to make it more modular.',
        '3': "I found this challenge to be an incredibly interesting puzzle, and I enjoyed working on it. I just wish that I had more time to finish. So if I were to add something to this challenge, it would be more time to work on it."
      }
    });
};

const postMutation = (req, res) => {
  if(!req.body.conversationId){
    var newConversation = new Conversation(req.body);
    newConversation.save((error, doc) => {
      if(error){
        res.status(400).send(error);
      } else {
        // res.status(201).send(doc);
        res.status(201).send({
          'msg': 'Conversation created and mutation applied',
          'ok': true,
          'text': doc.text
        })
      }
    });
  } else {
    updateConversation(req.body.conversationId, req, res);
  }
};

const updateConversation = (id, req, res) => {
  Conversation.findById(id, (error, docs) => {
    if(error){
      res.send(error);
    } else {
      let insertMutation = operationalTransformation.performInsert(docs.text, req.body.index, req.body.author, req.body.text);
      let updateState =
      Conversation.updateOne({_id: req.body.conversationId}, {text: insertMutation}, (error, doc) => {
        if(error){
          console.log(error);
        } else {
          console.log(doc);
        };
      });
      let findType = req.body.text.length;
      let determineType = findType ? 'insert' : 'delete';
      let origin = operationalTransformation.getOrigin();
      createMutation(req, res, determineType, origin);
    };
  });
};

const createMutation = (req, res, type, origin) => {
  let newMutation = new Mutation({
      author: req.body.author,
      conversationId: req.body.conversationId,
      index: req.body.index,
      length: req.body.length,
      text: req.body.text,
      type: type,
      alice: origin[1],
      bob: origin[0]
  });
  newMutation.save((error, doc) => {
    if(error){
      res.status(400).send(error);
    } else {
      //res.status(201).send(doc);
      getConversation(req, res);
    };
  });
};

const getConversations = (req, res) => {
  Conversation.find({}, (error, conversations) => {
    if(error){
      res.status(400).send(error);
    } else {
      res.status(200).send(conversations);
    };
  });
};

const getConversation = (req, res) => {
  Conversation.findById(req.body.conversationId, (error, doc) => {
    if(error){
      res.status(400).send(error);
    } else {
      // res.status(200).send(doc);
      res.status(201).send({
        'msg': 'Mutation applied to conversation',
        'ok': true,
        'text': doc.text
      });
    };
  });
};

const deleteConversation = (req, res) => {
  Conversation.findByIdAndDelete(req.body.id, (error, docs) => {
    if(error){
      res.status(400).send(error);
    } else {
      console.log(req.body.id)
      res.status(204).json({ msg: 'message', ok: true })
    };
  });
};

module.exports.ping = ping;
module.exports.getInfo = getInfo;
module.exports.postMutation = postMutation;
module.exports.getConversation = getConversation;
module.exports.getConversations = getConversations;
module.exports.deleteConversation = deleteConversation;

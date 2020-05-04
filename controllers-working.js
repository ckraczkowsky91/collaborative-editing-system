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
        'url': ''
      },
      'language': 'node.js',
      'source': '',
      'answers': {
        '1': 'I approached the problem...',
        '2': 'If I had more time, I would add...',
        '3': 'What would you remove / add in the challenge if you were in the hiring side?'
      }
    });
};

const postMutation = (req, res) => {
  if(!req.body.conversationId){
    var newConversation = new Conversation(req.body);
    newConversation.save((error, doc) => {
      if(error){
        res.send(error);
      } else {
        res.status(200).send(doc);
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
      res.send(error);
      //res.status(400).send(error);
    } else {
      res.send(doc);
      //res.status(200).send(doc);
    };
  });
};

const getConversations = (req, res) => {
  Conversation.find({}, (error, docs) => {
    if(error){
      res.send(error);
    } else {
      res.send(docs);
    };
  });
};

const getConversation = (req, res) => {
  Conversation.findById(req.params.conversationId, (error, doc) => {
    if(error){
      res.status(400).send(error);
    } else {
      console.log(req.params.conversationId)
      res.status(200).send(doc);
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

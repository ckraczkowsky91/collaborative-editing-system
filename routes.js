const controllers = require('./controllers');
const operationalTransformation = require('./operationalTransformation');

const routes = (app) => {
  app.route('/ping')
    .get(controllers.ping);
  app.route('/info')
    .get(controllers.getInfo);
  app.route('/mutations')
    .post(controllers.postMutation);
  app.route('/conversations')
    .get(controllers.getConversations)
    .delete(controllers.deleteConversation);
  app.route('/conversation/:conversationId')
    .get(controllers.getConversation);
  app.route('/origin')
    .get(operationalTransformation.getOrigin);
};

module.exports = routes

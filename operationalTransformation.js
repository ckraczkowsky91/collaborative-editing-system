var bobCounter = 0;
var aliceCounter = 0;
var origin = [bobCounter, aliceCounter];

const findStartIndex = (conversation) => {
  return conversation.length;
};

const updateOrigin = (author) => {
  if(author == 'bob'){
    bobCounter++;
    origin[0] = bobCounter;
  };
  if(author == 'alice'){
    aliceCounter++;
    origin[1] = aliceCounter;
  };
};

const getOrigin = () => {
  console.log(origin);
  return origin;
};

compareOriginToState = (origin, state) => {
  if(origin == state){
    console.log(true);
  }
}

/*
Insert mutation
*/

const performInsert = (conversation, index, author, text) => {
  updateOrigin(author.toLowerCase());
  newConversation = conversation.slice(0, index) + text + conversation.slice(index);
  return newConversation;
};

module.exports.performInsert = performInsert;
module.exports.getOrigin = getOrigin;

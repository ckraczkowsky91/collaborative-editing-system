import React from 'react';
import axios from 'axios';
import {useHistory} from 'react-router-dom';
import {BASE_URL} from '../index';

export default function ConversationList(props){
  let history = useHistory();

  function handleClick(conversation){
    let id = conversation._id;
    let url = `/conversation/${id}`
    // let url = BASE_URL + `/conversation/${id}`
    history.push(`/conversation/${id}`);
    axios.get(url)
      .then((response) => {
        console.log('Response: ' + response);
        props.updateConversation(response.data);
      })
      .catch((error) => {
        console.log('Error: ' + error)
      });
  };

  function handleDelete(conversation){
    let url = '/conversations';
    // let url = BASE_URL + '/conversations';
    axios.delete(url, {data: {id: conversation._id}})
      .then((response) => {
        console.log('Response: ' + response)
        props.updateState();
      })
      .catch((error) => {
        console.log('Error: ' + error)
      });
  };

    return(
      <div>
        <h4>Conversations</h4>
        <ul className="collection">
          {props.conversations.map((conversation) => (
            <li className="collection-item" key={conversation._id} onClick={handleClick.bind(this, conversation)}>
              <div>{conversation.text}
                <a onClick={handleDelete.bind(this, conversation)} className="secondary-content">
                  <i className="material-icons">delete</i>
                </a>
              </div>
            </li>
          ))}
        </ul>
      </div>
    )
};

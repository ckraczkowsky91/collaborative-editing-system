import React from 'react';
import axios from 'axios';
import Select from 'react-select';
import {BASE_URL} from '../index';

export default class ConversationForm extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      author: '',
      text: ''
    };
    this.handleChangeText = this.handleChangeText.bind(this);
    this.handleChangeInput = this.handleChangeInput.bind(this);
    this.handleOnSubmit = this.handleOnSubmit.bind(this);
  };

  handleChangeText(event){
    this.props.onTextChange(event.target.value);
  };

  handleChangeInput(event){
    this.setState({author: event.value});
  };

  handleOnSubmit(event){
    event.preventDefault();
    var originalText = this.state.conversation;
    var newText = event.target.conversationText.value;
    console.log(originalText, newText);
    const url = BASE_URL + '/mutations';
    const form = {
      conversationId: this.props.conversation._id,
// "index": 15,
      text: event.target.conversationText.value,
      author: this.state.author
    }
    console.log(form);
  };

  render(){
    const text = this.props.conversation.text;
    const options = [
      { value: 'Alice', label: 'Alice' },
      { value: 'Bob', label: 'Bob' }
    ];
    return(
    <div>
      <div className="row">
        <h4>Mutation</h4>
        <form className="col s6" onSubmit={this.handleOnSubmit}>
          <div className="row">
            <div className="input-field col s6">
              <i className="material-icons prefix">mode_edit</i>
              <textarea onChange={this.handleChangeText} id="conversationText" className="materialize-textarea" value={text} type="text"></textarea>
            </div>
            <div className="input-field col s6">
              <Select options={options} onChange={this.handleChangeInput}/>
            </div>
          </div>
          <div className="row">
            <button className="btn waves-effect waves-light" type="submit" name="action">Submit
              <i className="material-icons right">send</i>
            </button>
          </div>
        </form>
      </div>
    </div>
    );
  };
};

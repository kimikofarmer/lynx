import React from "react";
import {render} from "react-dom";
import {Button, FABButton, Textfield, IconButton} from "react-mdl";
import './css/main.css'
import "whatwg-fetch";

import Sidebar from './sidebar.jsx'
import Navbar from './navbar.jsx'
import SendMessage from './sendMessage.jsx'

import {store, removeFavorite} from './shared-state.js'

export default class extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			currentUser: null,
			sentMessages: null,
			receivedMessages: null
		}
		this.firebase = this.props.route.firebase;
	}

	//online
	componentDidMount() {	
		var self = this;
		this.firebase.auth().onAuthStateChanged(function(user) {
			if (user) {
				self.setState({currentUser: user});
				self.unsub = store.subscribe(() => self.setState(store.getState()));

				self.sentMessagesRef = self.firebase.database().ref('messages/' + self.state.currentUser.uid + '/sent');
				self.receivedMessagesRef = self.firebase.database().ref('messages/' + self.state.currentUser.uid + '/received');						

				self.sentMessagesRef.on('value', snapshot => {
					
				});

				self.receivedMessagesRef.on('value', console.log)

			} else {
				window.location = "/?#/signin";
			}
			return user;
		});	
	}

	componentWillUnmount() {
        this.unsub();
    }

	render() {
		var sendMessage, navbar, sentMessages;
		if (this.state.currentUser) {
			navbar = <Navbar firebase={this.firebase} currentUser={this.state.currentUser} />			
		}
		if (this.state.sentMessages) {
			sentMessages = this.state.sentMessages.map((message, i) => (
				<div key={i}>
					<p>to: {message.to}</p>
					<p>url: {message.url}</p>
					<p>description: {message.description}</p>
				</div>
			))
		}
		return (
			<div className="mdl-layout mdl-js-layout mdl-layout--fixed-drawer">
			    <Sidebar />
			    <main className="mdl-layout__content">
				    <div className="page-content">
				    	{navbar}
				    	<SendMessage />			
				    </div>
				    {sentMessages}
			    </main>
			</div>
		);	
	}
}

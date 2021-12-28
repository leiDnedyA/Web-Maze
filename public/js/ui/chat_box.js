
/* 
The 'chat box' is really just a console that displays all of
the incoming chats, and battle requests/waves similar to minecraft

inputs:
"domElement" refers to the div that stores the chat box
"startMessage" will be the contents of the paragraph element put in chat upon 
calling start().

*/

class ChatBox{
    constructor(domElement, startMessage = '<em>ChatBox loaded successfully</em>'){
        this.domElement = domElement;
        this.startMessage = startMessage;

        this.addMessage = this.addMessage.bind(this);
        this.start = this.start.bind(this);
        this.show = this.show.bind(this);
        this.hide = this.hide.bind(this);
        this.newRecievedBattleRequest = this.newRecievedBattleRequest.bind(this);
        this.newSentBattleRequest = this.newSentBattleRequest.bind(this);
        this.newChat = this.newChat.bind(this);
        this.newWave = this.newWave.bind(this);
    }

    addMessage(contents){

        /*
        Appends a paragraph element to the chatBox dom element
        and sets the innerHTML of the paragraph element to the
        context parameter(string)
        */

        let messageElement = document.createElement('p');
        messageElement.innerHTML = contents;
        messageElement.classList.add('chatBoxContents');
        this.domElement.appendChild(messageElement);
        this.domElement.scrollTop = this.domElement.scrollHeight;
    }

    start(){
        this.show();
        this.addMessage(this.startMessage);
    }

    show(){
        this.domElement.style.display = 'block';
    }

    hide(){
        this.domElement.style.display = 'none';
    }

    newRecievedBattleRequest(sender, gamemode){
        /*
        Recipient should be an object containing a name and more things in future
        */

        this.addMessage(`${this.getPlayerNameHTML(sender.name)} requested to battle you in the gamemode <em>${gamemode}</em>!`);
    }

    newSentBattleRequest(reciever, gamemode){

        /* 
        Recipient should be an object containing a name and more things in future
        */

        this.addMessage(`You requested to battle ${this.getPlayerNameHTML(reciever.name)} in the gamemode <em>${gamemode}</em>!`)
    }

    newChat(data){
        this.addMessage(`[${this.getPlayerNameHTML(data.clientName)}]: ${data.message}`);
    }

    newWave(data){
        this.addMessage(`${this.getPlayerNameHTML(data.senderName)} waved to you!`);
    }
    
    getPlayerNameHTML(playerName){
        /*
        takes in a player object with at least a name attribute and
        returns a string containing a tag with mouseover text and itallacs
        */

        return `<em><span title="${playerName}">${playerName}</span></em>`

    }

}
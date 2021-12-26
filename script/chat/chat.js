
class Chat{
    constructor(clientList){
        this.clientList = clientList;

        this.handleChat = this.handleChat.bind(this);
        this.distributeChat = this.distributeChat.bind(this)
        this.logChat = this.logChat.bind(this)
    }

    handleChat(chat){

        if (chat.hasOwnProperty('message') && chat.hasOwnProperty('clientID')) {
            this.distributeChat(chat);
            this.logChat(chat);
        } else {
            console.log('Chat message does not contain a chat object!');
        }

    }

    distributeChat(chat){
        for(let i in this.clientList){
            this.clientList[i].socket.emit('newChat', {message: chat.message, clientID: chat.clientID, clientName: chat.clientName});
        }
    }

    logChat(chat){

    }

}

module.exports = Chat;
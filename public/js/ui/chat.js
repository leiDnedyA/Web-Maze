
const chatDuration = 5; //duration in seconds

class Chat{
    constructor(socket, chatForm, chatInput){
        this.socket = socket;

        this.chatForm = chatForm;
        this.chatInput = chatInput;
        
        this.currentChats = [];

        this.start = this.start.bind(this);
        this.newChat = this.newChat.bind(this);
        this.getChats = this.getChats.bind(this);
    }

    start(){
        this.chatForm.style.display = 'block'
        this.chatForm.addEventListener('submit', (e)=>{
            e.preventDefault();

            this.socket.emit("newChat", {message: this.chatInput.value});

            this.chatInput.value = '';

        })

        this.socket.on('newChat', (data)=>{
            this.newChat(data.message, data.clientID);
        })
    }

    update(){
        for(let i in this.currentChats){
            console.log(this.currentChats[i]);
            if(Date.now() - this.currentChats[i].timeStamp >= chatDuration * 1000){
                this.currentChats.splice(i, 1);
            }
        }
    }

    newChat(message, senderID){

        for(let i in this.currentChats){
            if(this.currentChats[i].senderID == senderID){
                delete this.currentChats[i]
            }
        }

        this.currentChats.push({message: message, senderID: senderID, timeStamp: Date.now()});
    }

    getChats(){
        return this.currentChats;
    }
}
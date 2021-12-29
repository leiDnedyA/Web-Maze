
class BattleRequestHandler{
    constructor(socket){
        this.domElements = {
            main: document.querySelector("#battleRequestNotification"),
            text: document.querySelector("#battleRequestNotificationText"),
            acceptButton: document.querySelector("#battleRequestNotificationAccept"),
            declineButton: document.querySelector("#battleRequestNotificationDecline")
        }

        this.socket = socket;

        this.isVisible;
        this.currentSender;
        this.currentRequestID;

        this.start = this.start.bind(this);
        this.emitResponse = this.emitResponse.bind(this);
        this.newRequest = this.newRequest.bind(this);
        this.show = this.show.bind(this);
        this.hide = this.hide.bind(this);

        this.hide();

    }

    start(){

        this.domElements.acceptButton.addEventListener('click', ()=>{

            this.emitResponse(true);

            this.hide();

        });

        this.domElements.declineButton.addEventListener('click', ()=>{

            this.emitResponse(false);

            this.hide();

        })

    }

    emitResponse(isAccept){
        //isAccept must be a boolean
        this.socket.emit('battleRequestResponse', {isAccept: isAccept, requestID: this.currentRequestID, senderID: this.currentSender.id});
    }

    newRequest(requestID, sender, gamemode){
        this.currentRequestID = requestID;
        this.currentSender = sender;
        this.domElements.text.innerHTML = `Incoming battle request from ${sender.name}!\nGamemode: <em>${gamemode}</em>`;
        this.show();
    }

    show(){
        this.isVisible = true;
        this.domElements.main.style.display = 'inline-block';
    }

    hide(){
        this.isVisible = false;
        this.domElements.main.style.display = 'none';
    }

}
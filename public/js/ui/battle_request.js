
class BattleRequestHandler{
    constructor(){
        this.domElements = {
            main: document.querySelector("#battleRequestNotification"),
            text: document.querySelector("#battleRequestNotificationText"),
            acceptButton: document.querySelector("#battleRequestNotificationAccept"),
            declineButton: document.querySelector("#battleRequestNotificationDecline")
        }

        this.isVisible;

        this.start = this.start.bind(this);
        this.newRequest = this.newRequest.bind(this);
        this.show = this.show.bind(this);
        this.hide = this.hide.bind(this);

        this.hide();

    }

    start(){

        this.domElements.acceptButton.addEventListener('click', ()=>{

            //put actual code here

            this.hide();

        });

        this.domElements.declineButton.addEventListener('click', ()=>{

            //put actual code here

            this.hide();

        })

    }

    newRequest(sender, gamemode){
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
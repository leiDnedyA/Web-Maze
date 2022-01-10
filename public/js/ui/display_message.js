
class DisplayMessageHandler{

/**
 * Meant to handle messages from the server/world
 * 
 * @callback displayCallback run upon calling newMessage()
 */
    constructor(displayCallback){

        this.displayCallback = displayCallback;

        this.overlay = document.createElement('div');
        this.overlay.classList.add('overlay');
        this.overlay.style.visibility = 'visible';
        this.overlay.style.display = 'none';
        this.divElement = document.createElement('div');
        this.overlay.appendChild(this.divElement);
        this.textElement = document.createElement('p');
        this.divElement.appendChild(this.textElement);
        this.divElement.id = "displayMessage";
        this.textElement.innerHTML = "Sample text";
        this.subtextElement = document.createElement('p');
        this.subtextElement.innerHTML = "Click anywhere on the screen to continue...";
        this.subtextElement.classList.add('subtext');
        this.divElement.appendChild(this.subtextElement);

        document.body.appendChild(this.overlay);

        this.visible = false;

        this.update = this.update.bind(this);
        this.newMessage = this.newMessage.bind(this);
        this.close = this.close.bind(this);

        this.overlay.addEventListener('click', this.close);


    }

    update(deltaTime){
        //do animation stuff here
    }

    newMessage(text){

        this.displayCallback();

        this.visible = true;
        this.textElement.innerHTML = text;
        this.overlay.style.display = 'block';
    }

    close(){
        this.visible = false;
        this.overlay.style.display = 'none';
    }


}
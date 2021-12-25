
class ContextMenu {
    constructor(menuOptions) {

        this.domElement = document.createElement("div");
        this.domElement.classList.add("contextMenu");

        this.buttons = {};

        this.activated = false;

        this.menuOptions = menuOptions;

        /* menuOptions object format
           
           {
               "label": {
                   "callback": (target)=>{
                        //callback
                    },
                    "condition": (target)=>{
                        //condition
                    }
               },
               "label": {
                   "callback": (target)=>{
                        //callback
                    },
                    "condition": (target)=>{
                        //condition
                    }
               }
           }
           
           */

        this.init = this.init.bind(this);
        this.setProperties = this.setProperties.bind(this);
        this.disableButton = this.disableButton.bind(this);
        this.enableButton = this.enableButton.bind(this);
        /* "properties" in this instance are a temporary holder for information about
        an individual instance of the context menu being pulled up.
        Info includes a reference to the target game and a list of which options are enabled/disabled */
        this.setMenuOptions = this.setMenuOptions.bind(this);
        this.display = this.display.bind(this);
        this.hide = this.hide.bind(this);

        this.init();

    }

    init() {
        this.setMenuOptions(this.menuOptions);
    }

    setProperties(properties) {
        
        if(properties){
            this.properties = properties;
        }else{
            this.properties = {
                target: null
            }
        }

        for(let i in this.menuOptions){
            if(this.menuOptions[i].condition(this.properties.target)){
                this.enableButton(i);
            }else{
                this.disableButton(i);
            }
        }

    }

    /* The disable/enableButton functions set the this.buttons[index].disabled
    property and add or remove the disabledContextMenuOption class to the anchor element */

    disableButton(index){
        this.buttons[index].disabled = true;
        if (!this.buttons[index].domElement.classList.contains('disabledContextMenuOption')){
            this.buttons[index].domElement.classList.add('disabledContextMenuOption');
        }
    }

    enableButton(index){
        this.buttons[index].disabled = false;
        if (this.buttons[index].domElement.classList.contains('disabledContextMenuOption')) {
            this.buttons[index].domElement.classList.remove('disabledContextMenuOption');
        }
    }

    setMenuOptions(menuOptions) { //called on init

        this.menuOptions = menuOptions;

        while(this.domElement.firstChild){
            this.domElement.removeChild(this.domElement.firstChild);
        }

        for (let i in this.menuOptions) {
            let optionElement = document.createElement("a");
            optionElement.href = "#";
            optionElement.innerHTML = i;
            optionElement.classList.add("contextMenuOption");
            optionElement.addEventListener("click", (e) => {
                e.preventDefault();
                if(!this.buttons[i].disabled){
                    this.menuOptions[i].callback(this.properties.target);
                }
            });
            this.buttons[i] = {};
            this.buttons[i].domElement = optionElement;
            this.buttons[i].disabled = true;
            this.domElement.appendChild(optionElement);
        }
    }

    display(position, properties) {
        if (!this.activated) {
            this.activated = true;

            this.setProperties(properties);

            /* Properties object must be structured as so:
            {
                "target": target GameObject,
                
            } */

            document.body.appendChild(this.domElement);
        }

        this.domElement.style.left = `${position.x}px`;
        this.domElement.style.top = `${position.y}px`;
    }

    hide() {
        if(this.activated){
            this.activated = false;
            document.body.removeChild(this.domElement);
            this.setProperties(null);
        }
    }
}
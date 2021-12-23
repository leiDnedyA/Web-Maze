
class ContextMenu {
    constructor(menuOptions) {

        this.domElement = document.createElement("div");
        this.domElement.classList.add("contextMenu");

        this.activated = false;

        this.menuOptions = menuOptions;

        /* menuOptions object format
           
           {
               "label": ()=>{
                   //callback
               },
               "label": ()=>{
                   //callback
               }
           }
           
           */

        this.init = this.init.bind(this);
        this.setProperties = this.setProperties.bind(this);
        this.setMenuOptions = this.setMenuOptions.bind(this);
        this.display = this.display.bind(this);
        this.hide = this.hide.bind(this);

        this.init();

    }

    init() {
        this.setMenuOptions(this.menuOptions);
    }

    setProperties(properties) {
        this.properties = properties;
    }

    setMenuOptions(menuOptions) {

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
                this.menuOptions[i](this.properties.target);
            });
            this.domElement.appendChild(optionElement);
        }
    }

    display(position, properties) {
        if (!this.activated) {
            this.activated = true;

            this.setProperties(properties);

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
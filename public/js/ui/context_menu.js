
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
        this.updateProperties = this.updateProperties.bind(this);
        this.setMenuOptions = this.setMenuOptions.bind(this);
        this.display = this.display.bind(this);
        this.hide = this.hide.bind(this);

        this.init();

    }

    init() {
        this.setMenuOptions(this.menuOptions);
    }

    updateProperties(properties) {

    }

    setMenuOptions(menuOptions) {

        this.menuOptions = menuOptions;

        for (let i in this.menuOptions) {
            let optionElement = document.createElement("a");
            optionElement.href = "#";
            optionElement.innerHTML = i;
            optionElement.classList.add("contextMenuOption");
            optionElement.addEventListener("click", (e) => {
                e.preventDefault();
                this.menuOptions[i]();
            });
            this.domElement.appendChild(optionElement);
        }
    }

    display(position, properties) {
        if (!this.activated) {
            this.activated = true;
            document.body.appendChild(this.domElement);
        }

        this.domElement.style.left = `${position.x}px`;
        this.domElement.style.top = `${position.y}px`;
    }

    hide() {
        if(this.activated){
            this.activated = false;
            document.body.removeChild(this.domElement);
        }
    }
}
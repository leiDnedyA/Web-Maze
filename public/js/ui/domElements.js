
//takes list of joinable worlds and creates an table dom element
const generateWorldTable = (worldList, socket, callback) => {
    let table = document.createElement('table');

    table.classList.add('worldListTable');

    let header = document.createElement('tr');
    let headerText = ["World", "Player Count", "Joinable", "Join"];

    for (let i in headerText) {
        let th = document.createElement('th');
        th.innerHTML = headerText[i];
        header.appendChild(th);
    }

    table.appendChild(header);

    for (let i in worldList) {
        let tr = document.createElement('tr');

        tdList = [];

        let joinButton = document.createElement('button');
        joinButton.innerHTML = "Join";
        if(worldList[i].isFull){
            joinButton.disabled = true;
        }else{
            joinButton.addEventListener('click', ()=>{
                socket.emit("joinWorldRequest", {worldIndex: i});
                callback();
            })
        }

        for(let j = 0; j < 4; j++){
            tdList.push(document.createElement('td'))
        }
        tdList[0].innerHTML = worldList[i].name;
        tdList[1].innerHTML = `${worldList[i].currentPlayers}/${worldList[i].maxPlayers}`;
        tdList[2].innerHTML = `${!worldList[i].isFull}`;
        tdList[3].appendChild(joinButton);

        for(let i in tdList){
            tr.appendChild(tdList[i]);
        }

        table.appendChild(tr);
    }

    return table;
}
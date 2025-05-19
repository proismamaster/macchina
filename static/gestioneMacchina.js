document.addEventListener("DOMContentLoaded",inzializzazioneJoyStick);

let stato=false;
let tasto; 
let container;
let xCenterContainer=null;
let yCenterContainer=null;

function accendiOspegni(){
    if(stato){
        document.getElementById("statoMacchina").innerHTML="Macchina spenta!";
        scrivi("Spenta.");
        document.removeEventListener("keydown",comandoMacchina);
        document.getElementById("pulsanteOnOff").style.backgroundColor="red";
        document.removeEventListener("keyup", resetJoyStickTasto);
        stato=false;
        return;
    }
    document.getElementById("statoMacchina").innerHTML="Macchina accesa!";
    scrivi("Accesa.");
    document.addEventListener("DOMContentLoaded",inzializzazioneJoyStick);
    stato=true;
    document.getElementById("pulsanteOnOff").style.backgroundColor="green";
    document.addEventListener("keydown",comandoMacchina);
    document.addEventListener("keyup", resetJoyStickTasto); //per vedere quando smette di premere
}

function comandoMacchina(key){
    if(key.code=="ArrowUp" || key.code=="Keyw" || key.code=="KeyW"){
        tasto='w';
    }else if(key.code=="ArrowDown" || key.code=="Keys" || key.code=="KeyS"){
        tasto='s';
    }else if(key.code=="ArrowLeft" || key.code=="Keya" || key.code=="KeyA"){
        tasto='a';
    }else if(key.code=="ArrowRight" || key.code=="Keyd" || key.code=="KeyD"){
        tasto='d';
    }else tasto=null;
    if(tasto){
        aggiornaJoyStickTasto(tasto);
        scrivi(tasto);
    }
    
}
function aggiornaJoyStickTasto(tasto){
    let xNuovaPosizione;
    let yNuovaPosizione;
    container=joyStickContainer.getBoundingClientRect(); //permette di ottenere sia dimensione che posizione dell'oggetto, nel nostro caso il contenitore
    xCenterContainer=(container.left + container.right)/2; //calcolo la x del centro come media delle cordinate del lato sinistro e destro
    yCenterContainer=(container.top + container.bottom)/2; //stessa cosa per la y
    let maxOffsetX=(container.width-joyStick.offsetWidth)/2;
    let maxOffsetY=(container.height-joyStick.offsetHeight)/2;
    // Definisci un fattore per regolare lo spostamento (0.7 ad esempio)
    let factor=0.7;
    switch (tasto){
        case "w":
            xNuovaPosizione=0;
            yNuovaPosizione=-maxOffsetY*factor;
            break;
        case "a":
            xNuovaPosizione=-maxOffsetX*factor;;
            yNuovaPosizione=0;
            break;
        case "s":
            xNuovaPosizione=0;
            yNuovaPosizione=maxOffsetY*factor;;
            break;
        case "d":
            xNuovaPosizione=maxOffsetX*factor;
            yNuovaPosizione=0;
            break;
    }
    joyStick.style.transform = `translate(calc(-50% + ${xNuovaPosizione}px), calc(-50% + ${yNuovaPosizione}px))`;

}
function resetJoyStickTasto(){
    joyStick.style.transform="translate(-50%, -50%)";
}

function scrivi(tasto){
    if(!stato) return; //se macchina spenta non scrivo
    fetch("/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json" // diciamo al server che mandiamo JSON
        },
        body: JSON.stringify({comando: tasto})
    })
}

//INZIO PARTE CODICE RELATIVA AL JOYSTICK


let currentComand=null;
let intervalloInvio=50; //intervallo di invio a 50 ms, uguale a qurello messo nell'IDE di arduino
const minDistance=10; //se il movimetno ha delta che è all'incirca quel valore lo ignoro
let joyStickContainer=null;
let joyStick=null;
let commandInterval=null;

function aggiornaJoyStick(touch){
    container=joyStickContainer.getBoundingClientRect(); //permette di ottenere sia dimensione che posizione dell'oggetto, nel nostro caso il contenitore
    xCenterContainer=(container.left + container.right)/2; //calcolo la x del centro come media delle cordinate del lato sinistro e destro
    yCenterContainer=(container.top + container.bottom)/2; //stessa cosa per la y
    
    let xNuovaPosizione=touch.clientX-xCenterContainer;
    let yNuovaPosizione=touch.clientY-yCenterContainer;
    //console.log("X con questo: ",touch.clientX);
    //console.log("Y con questo: ",touch.clientY);
    joyStick.style.transform = `translate(calc(-50% + ${xNuovaPosizione}px), calc(-50% + ${yNuovaPosizione}px))`;
}

function inzializzazioneJoyStick(){
    joyStickContainer= document.getElementById("contenitoreJoyStick");
    joyStick=document.getElementById("joyStick");
    container=joyStickContainer.getBoundingClientRect(); //permette di ottenere sia dimensione che posizione dell'oggetto, nel nostro caso il contenitore
    xCenterContainer=(container.left + container.right)/2; //calcolo la x del centro come media delle cordinate del lato sinistro e destro
    yCenterContainer=(container.top + container.bottom)/2; //stessa cosa per la y
    joyStick.addEventListener("touchstart", toccaJoyStick);
    joyStick.addEventListener("touchmove", muoveJoyStick);
    joyStick.addEventListener("touchend", lasciaJoyStick);
}

function toccaJoyStick(){
    //event.preventDefault(); // Impedisce comportamenti predefiniti (es. scroll), verificarne utilita
    const touch=event.touches[0]; //il primo tocco
    aggiornaComando(touch);
    aggiornaJoyStick(touch); //da fare
    InviaComandi();
}
function muoveJoyStick(){
    //event.preventDefault(); // Impedisce comportamenti predefiniti (es. scroll), verificarne utilita
    const touch=event.touches[0]; //il primo tocco
    aggiornaComando(touch);
    aggiornaJoyStick(touch);
}
function lasciaJoyStick(){
    //event.preventDefault(); // Impedisce comportamenti predefiniti (es. scroll), verificarne utilita
    joyStick.style.transform="translate(-50%, -50%)";
    nonInviareComandi();
}



function aggiornaComando(touch){
    const deltaX=touch.clientX - xCenterContainer;
    const deltaY=touch.clientY - yCenterContainer;
    let f=0;
    if(deltaX<0){
        if((-1)*deltaX<=minDistance){
            f++;
        }
       }else{
          if(deltaX<=minDistance){
                f++;
        } 
    }
    if(deltaY<0){
        if((-1)*deltaY<=minDistance){
            f++;
        }
    }else{
        if(deltaY<=minDistance){
            f++;
        } 
    }
    
    if(f==2){
        command=null;
        return;
    }
    if(Math.abs(deltaX)>Math.abs(deltaY)){
        if(deltaX>0){
            currentComand="d";
        }else{
            currentComand="a";
        }
    }else{
        if(deltaY>0){
            currentComand="s";
        }else{
            currentComand="w";
        }
    }
}

function InviaComandi(){
    if(commandInterval){ //se esiste gia, per qualche motivo intervallo, prima di proseguire lo cancello
        clearInterval(commandInterval);
    }
    commandInterval=setInterval(() => {
        if(currentComand){
            console.log("Invio tramite joystick: ",currentComand);
            scrivi(currentComand);
        }
    }, intervalloInvio);
}

function nonInviareComandi(){
    if(commandInterval){
        clearInterval(commandInterval);
        commandInterval=null;
    }
}

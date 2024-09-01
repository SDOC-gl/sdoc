import data from '../modules/dataModule.js';

document.addEventListener('DOMContentLoaded', function () {
    data.verify();
});


const screenElement:HTMLElement|null = document.getElementById("screen"); 

interface PCScreen {
    id: string;
    html: string;
    js: Function;
    buttons: boolean;
}

const Screens:PCScreen[] = [
    // LOAD
    {
        id: "SCN_LOA",
        html: `
            <h1>LOADING <span id="loading">/</span></h1>
            <p>
                Por favor, aguarde enquanto carregamos o sistema operacional AX2OM<br>
                <span id="10" style="visibility: hidden;">Carregando kernel...</span><br>
                <span id="29" style="visibility: hidden;">Kernel carregado!</span><br>
                <span id="30" style="visibility: hidden;">Carregando cenas...</span><br>
                <span id="35" style="visibility: hidden;">Cenas carregadas!</span><br>
                <span id="36" style="visibility: hidden;">Carregando criptografia <i>'OOC'</i></span><br>
                <span id="60" style="visibility: hidden;">Criptografando...</span><br>
                <span id="75" style="visibility: hidden;">Limpando sistema...</span><br>
                <span id="95" style="visibility: hidden;">Carregamento concluído.</span><br>
            </p>
        `,
        js: () => {
            const loadingAnim:string[] =  ["—", "\\", "|", "/", "／"];
            let curFrame:number = 0;
            let loaded:number = 0;

            const interval:number = setInterval(function() {
                const loadingElement:HTMLElement|null = document.getElementById("loading");
                if (loadingElement != null)
                    loadingElement.innerHTML = loadingAnim[curFrame];

                curFrame += 1;
                if (curFrame >= loadingAnim.length - 1)
                    curFrame = 0;
                loaded += 1;
                if (loaded >= 100) {
                    updateScreen(1);
                    clearInterval(interval);
                }
                const possibleElement:HTMLElement|null = document.getElementById(String(loaded));
                if (possibleElement != null)
                    possibleElement.style.visibility = "visible";
            }, 200)
        },
        buttons: false
    },
    
    // UNI
    {
        id: "SCN_UNI",
        html: `
            <img src="./Screens/UNI.png" style="margin-top:16px; position:absolute">
            <div id="greenbox" style="width:115px; height:320px; position:relative; left: 485px; ">
                <h4 style="text-align:center;padding-top:12px">ATIVIDADES</h4>
            </div>
        `,
        js: () => {
            const activities:string[] = [data.sc("VmlhamFudGU="), data.sc("QW5hY3LDtG5pbW8="), data.sc("TW9uw7NsaXRv"), data.sc("RXNww61yaXRv"), data.sc("QXBvY2FsaXBzZQ==")];
            let shownActivities:string[] = [];

            const greenBox:HTMLDivElement = document.getElementById("greenbox") as HTMLDivElement;

            for (let i = 0; i < 4; i++) {
                const customInvertal:number = setInterval(() => {
                    const activityType:string = activities[Math.round(Math.random() * (activities.length - 1))];
                    if (shownActivities.includes(activityType)) return;

                    const newActivity:HTMLParagraphElement = document.createElement("p");
                    newActivity.id = "activity";
                    newActivity.innerHTML = activityType;
                    shownActivities.push(activityType);

                    greenBox.appendChild(newActivity);
                    newActivity.style.visibility = "visible";
                    setTimeout(() => {
                        shownActivities.forEach((value, index) => {
                            if (value === newActivity.innerHTML)
                                shownActivities.splice(index);
                        });
                        newActivity.remove();
                    }, 3000 + Math.random() * 1000)
                }, 5000 + (Math.random() * 13000));
            }
        },
        buttons: true
    }, {
        id: "SCN_SHA",
        html: `
            <img id="sha" src="./Screens/SHA.png" style="margin-left: 50%; margin-top: 7%; transform: translate(-50%, 0); cursor:pointer">
        `,
        buttons: true,
        js: () => {
            const sha:HTMLImageElement = document.getElementById("sha") as HTMLImageElement;
            const morse:boolean[] = [!![],!![],!![],![],!![],!![],!![],![],!![],![],!![],!![],!![],![],![],![],!![],![],!![],![],!![],!![],!![],![],![],![],!![],![],!![],!![],!![],![],![],![],!![],!![],!![],![],!![],![],![],![],!![],!![],!![],![],!![],![],!![],![],![],![],!![],!![],!![],![],!![],!![],!![],![],!![],!![],!![],![],![],![],![],![],![],![],!![],![],!![],![],!![],![],!![],!![],!![],![],![],![],!![],!![],!![],![],!![],!![],!![],![],!![],!![],!![],![],![],![],!![],![],!![],![],!![],!![],!![],![],![],![],![],![],![],![],!![],!![],!![],![],!![],!![],!![],![],![],![],!![],!![],!![],![],!![],!![],!![],![],!![],!![],!![],![],![],![],!![],![],!![],!![],!![],![],!![],![],![],![],!![],![],!![],!![],!![],![],!![],![],![],![],!![],![],![],![],!![],![],!![],!![],!![],![],!![]];
            let curMorsePos:number = 0;
            sha.onclick = () => {
                const snd = new Audio(morse[curMorsePos] ? "./Screens/dash.mp3" : "./Screens/dot.mp3");
                snd.play();
                curMorsePos++;
            }
        }
    }
];

let curScreen:number = 0;

function updateScreen(which:number):void {
    curScreen = which;
    const screenInfo:PCScreen = Screens[curScreen];

    if (screenElement)
        screenElement.innerHTML = screenInfo.html;
    screenInfo.js.call(this);
    document.getElementById("sstext").innerHTML = screenInfo.id;

    const scrollButtons:HTMLCollectionOf<HTMLImageElement> = document.getElementsByClassName("ssbutton") as HTMLCollectionOf<HTMLImageElement>;

    for (let i = 0; i < scrollButtons.length; i++) {
        const element = scrollButtons[i];
        element.style.visibility = screenInfo.buttons ? "visible" : "collapse";
        element.onclick = () => {scrollScreens(i == 0 ? -1 : 1)}
    }
}

function scrollScreens(amt:number) {
    let newCurScreen:number = curScreen + amt;
    if (newCurScreen >= Screens.length)
        newCurScreen = 1;
    if (newCurScreen <= 0) {
        newCurScreen = Screens.length - 1;
    }

    updateScreen(newCurScreen);
}

updateScreen(curScreen);
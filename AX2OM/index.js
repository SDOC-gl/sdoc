import data from '../modules/dataModule.js';
document.addEventListener('DOMContentLoaded', function () {
    data.verify();
});
const screenElement = document.getElementById("screen");
const Screens = [
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
            const loadingAnim = ["—", "\\", "|", "/", "／"];
            let curFrame = 0;
            let loaded = 0;
            const interval = setInterval(function () {
                const loadingElement = document.getElementById("loading");
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
                const possibleElement = document.getElementById(String(loaded));
                if (possibleElement != null)
                    possibleElement.style.visibility = "visible";
            }, 200);
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
            const activities = ["Viajante", "Anacrônimo", "Monólito", "Espírito", "Apocalipse"];
            let shownActivities = [];
            const greenBox = document.getElementById("greenbox");
            for (let i = 0; i < 4; i++) {
                const customInvertal = setInterval(() => {
                    const activityType = activities[Math.round(Math.random() * (activities.length - 1))];
                    if (shownActivities.includes(activityType))
                        return;
                    const newActivity = document.createElement("p");
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
                    }, 3000 + Math.random() * 1000);
                }, 5000 + (Math.random() * 13000));
            }
        },
        buttons: true
    },
    // ONION
    {
        id: "SCN_ONI",
        html: `
            <img src="./Screens/ONION.png" style="margin-left: 50%; margin-top: 5%; transform: translate(-50%, 0)">
        `,
        js: () => { },
        buttons: true
    },
    // TELEPHONE
    {
        id: "SCN_TEL",
        html: `
            <p id="num" style="position:absolute;font-size:72px;margin-left: 50%; margin-top: 10%; transform: translate(-50%, 0)"></p>
            <img src="./Screens/TELEPHONE.png" id="telephone" style="margin-left: 50%; margin-top: 25%; transform: translate(-50%, 0)">
        `,
        js: () => {
            const numbers = [
                7, 0,
                4, 4, 0,
                6, 6, 6, 0,
                6, 6, 0,
                3, 3, 0,
                6, 6, 0,
                8, 8, 0,
                6, 0,
                8, 0,
                6, 6, 6, 0,
                8, 0,
                3, 0,
                3, 3, 0,
                8, 8, 8, 0,
                4, 4, 4, 0,
                5, 5, 5, -1
            ];
            let curNum = 0;
            let playing = false;
            const telephone = document.getElementById("telephone");
            const num = document.getElementById("num");
            telephone.onmouseenter = () => {
                if (!playing) {
                    const mysteryaudio = new Audio('./Screens/phonesound.mp3');
                    mysteryaudio.play();
                    playing = true;
                    function showNum() {
                        if (numbers[curNum] === -1) {
                            num.innerHTML = "";
                            return;
                        }
                        if (numbers[curNum] === 0) {
                            num.innerHTML = "";
                            curNum++;
                        }
                        num.innerHTML += String(numbers[curNum]);
                        curNum++;
                    }
                    showNum();
                    const tickInverval = setInterval(() => {
                        if (curNum >= numbers.length) {
                            playing = false;
                            clearInterval(tickInverval);
                            return;
                        }
                        showNum();
                    }, 925);
                }
            };
        },
        buttons: true
    }
];
let curScreen = 1;
function updateScreen(which) {
    curScreen = which;
    const screenInfo = Screens[curScreen];
    if (screenElement)
        screenElement.innerHTML = screenInfo.html;
    screenInfo.js.call(this);
    document.getElementById("sstext").innerHTML = screenInfo.id;
    const scrollButtons = document.getElementsByClassName("ssbutton");
    for (let i = 0; i < scrollButtons.length; i++) {
        const element = scrollButtons[i];
        element.style.visibility = screenInfo.buttons ? "visible" : "collapse";
        element.onclick = () => { scrollScreens(i == 0 ? -1 : 1); };
    }
}
function scrollScreens(amt) {
    let newCurScreen = curScreen + amt;
    if (newCurScreen >= Screens.length)
        newCurScreen = 1;
    if (newCurScreen <= 0) {
        newCurScreen = Screens.length - 1;
    }
    updateScreen(newCurScreen);
}
updateScreen(curScreen);

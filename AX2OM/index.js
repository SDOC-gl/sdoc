const screenElement = document.getElementById("screen");
const Screens = Object.freeze({
    LOADING: {
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
                    curScreen = Screens.UNIVERSE;
                    updateScreen();
                    clearInterval(interval);
                }
                const possibleElement = document.getElementById(String(loaded));
                if (possibleElement != null)
                    possibleElement.style.visibility = "visible";
            }, 200);
        },
        buttons: false
    },
    UNIVERSE: {
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
                    console.table(shownActivities);
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
    }
});
let curScreen = Screens.UNIVERSE;
function updateScreen() {
    if (screenElement)
        screenElement.innerHTML = curScreen.html;
    curScreen.js.call(this);
    document.getElementById("sstext").innerHTML = curScreen.id;
    document.getElementById("ssbuttonl").style.visibility = curScreen.buttons ? "visible" : "collapse";
    document.getElementById("ssbuttonr").style.visibility = curScreen.buttons ? "visible" : "collapse";
}
updateScreen();

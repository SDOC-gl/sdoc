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
        }
    },
    UNIVERSE: {
        id: "SCN_UNI",
        html: `
            <img src="./Screens/UNI.png">
        `,
        js: () => { }
    }
});
let curScreen = Screens.LOADING;
function updateScreen() {
    if (screenElement)
        screenElement.innerHTML = curScreen.html;
    curScreen.js.call(this);
}
updateScreen();

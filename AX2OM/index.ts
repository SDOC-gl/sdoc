const screenElement:HTMLElement|null = document.getElementById("screen"); 

const Screens:Readonly<any> = Object.freeze({
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
                    curScreen = Screens.UNIVERSE;
                    updateScreen();
                    clearInterval(interval);
                }
                const possibleElement:HTMLElement|null = document.getElementById(String(loaded));
                if (possibleElement != null)
                    possibleElement.style.visibility = "visible";
            }, 200)
        }
    },
    UNIVERSE: {
        id: "SCN_UNI",
        html: `
            <img src="./Screens/UNI.png">
        `,
        js: () => {}
    }
});
let curScreen:Readonly<any> = Screens.LOADING;

function updateScreen():void {
    if (screenElement)
        screenElement.innerHTML = curScreen.html;
    curScreen.js.call(this);
}
updateScreen();
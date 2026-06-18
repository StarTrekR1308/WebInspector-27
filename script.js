(function() {
    let existingDev = document.getElementById('ios27-dev-center');
    if (existingDev) { existingDev.remove(); return completion(); }

    let devCenter = document.createElement('div');
    devCenter.id = 'ios27-dev-center';
    devCenter.style.cssText = `
        position: fixed; bottom: 30px; left: 50%; transform: translateX(-50%);
        width: 92%; max-width: 500px; background: rgba(28, 28, 30, 0.75);
        backdrop-filter: blur(40px) saturate(210%); -webkit-backdrop-filter: blur(40px) saturate(210%);
        border-radius: 32px; border: 1px solid rgba(255, 255, 255, 0.15);
        box-shadow: 0 30px 60px rgba(0,0,0,0.6); z-index: 999999;
        padding: 24px; font-family: -apple-system, BlinkMacSystemFont, sans-serif; color: #fff;
    `;

    let header = document.createElement('div');
    header.style.cssText = 'display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;';
    header.innerHTML = '<span style="font-weight:800; font-size:20px; letter-spacing:-0.5px;">WebInspector 27</span><span style="font-size:12px; font-weight:600; text-transform:uppercase; color:rgba(255,255,255,0.4);">iPadOS Touch Mode</span>';
    devCenter.appendChild(header);

    let grid = document.createElement('div');
    grid.style.cssText = 'display:grid; grid-template-columns: 1fr 1fr; gap:12px;';

    function createTouchBtn(title, sub, onClickAction) {
        let btn = document.createElement('div');
        btn.style.cssText = `
            background: rgba(44, 44, 46, 0.7); border-radius: 20px; padding: 16px;
            border: 1px solid rgba(255,255,255,0.05); transition: transform 0.1s; cursor: pointer;
        `;
        btn.innerHTML = `<div style="font-size:11px; font-weight:700; color:rgba(255,255,255,0.4); text-transform:uppercase; margin-bottom:4px;">${title}</div><div style="font-size:15px; font-weight:600;">${sub}</div>`;
        
        btn.ontouchstart = () => btn.style.transform = 'scale(0.95)';
        btn.ontouchend = () => { btn.style.transform = 'scale(1)'; onClickAction(btn); };
        return btn;
    }

    // 1. Text bearbeiten
    let b1 = createTouchBtn("Element Edit", "Text bearbeiten", (btn) => {
        let active = document.body.contentEditable === 'true';
        document.body.contentEditable = active ? 'false' : 'true';
        btn.style.background = active ? 'rgba(44, 44, 46, 0.7)' : 'rgba(52, 199, 89, 0.4)';
    });

    // 2. Design anpassen
    let b2 = createTouchBtn("Style Edit", "Design anpassen", (btn) => {
        window.iosStyleActive = !window.iosStyleActive;
        btn.style.background = window.iosStyleActive ? 'rgba(10, 132, 255, 0.4)' : 'rgba(44, 44, 46, 0.7)';
        if(window.iosStyleActive) {
            document.addEventListener('click', function styler(e) {
                if(!window.iosStyleActive) { document.removeEventListener('click', styler); return; }
                if(devCenter.contains(e.target)) return;
                e.preventDefault(); e.stopPropagation();
                let cssInput = prompt("Welchen CSS-Style anwenden? (z.B. 'background: red;' oder 'border-radius: 20px;')");
                if(cssInput) e.target.style.cssText += cssInput;
            }, { capture: true });
        }
    });

    // 3. Element vernichten
    let b3 = createTouchBtn("Nuke Mode", "Element löschen", (btn) => {
        window.iosNukeActive = !window.iosNukeActive;
        btn.style.background = window.iosNukeActive ? 'rgba(255, 59, 48, 0.4)' : 'rgba(44, 44, 46, 0.7)';
        if(window.iosNukeActive) {
            document.addEventListener('click', function nuke(e) {
                if(!window.iosNukeActive) { document.removeEventListener('click', nuke); return; }
                if(devCenter.contains(e.target)) return;
                e.preventDefault(); e.stopPropagation();
                e.target.remove();
            }, { capture: true });
        }
    });

    // 4. Konsole auslesen
    let b4 = createTouchBtn("Console", "Fehler auslesen", () => {
        let logs = window.errorsLogged || ["Keine Fehler auf der Seite gefunden."];
        alert(logs.join("\n"));
    });

    // 5. HTML Quellcode
    let b5 = createTouchBtn("Source Code", "HTML kopieren", () => {
        let textarea = document.createElement('textarea');
        textarea.value = document.documentElement.outerHTML;
        document.body.appendChild(textarea); textarea.select();
        document.execCommand('copy'); textarea.remove();
        alert("HTML-Quelltext in die Zwischenablage kopiert!");
    });

    // 6. Screenshot-Modus
    let b6 = createTouchBtn("Capture Mode", "Clean Screenshot", () => {
        devCenter.style.display = 'none';
        setTimeout(() => {
            alert("Das Widget ist jetzt unsichtbar. Mache deinen Screenshot! Nach dem Schließen dieses Pop-ups erscheint das Widget wieder.");
            devCenter.style.display = 'block';
        }, 150);
    });

    window.errorsLogged = window.errorsLogged || [];
    window.onerror = function(msg, url, line) { window.errorsLogged.push(`Zeile ${line}: ${msg}`); };

    grid.appendChild(b1); grid.appendChild(b2);
    grid.appendChild(b3); grid.appendChild(b4);
    grid.appendChild(b5); grid.appendChild(b6);
    devCenter.appendChild(grid);
    document.body.appendChild(devCenter);

    completion();
})();

//Run this so that the script doesn't crash when page elements load in an unexpected order
window.addEventListener("DOMContentLoaded", (event) => {
    //Allows us to access CSS variables storing palette colors
    var r = document.querySelector(':root');
    
    //get divs on screen that represent each palette
    const p1 = document.getElementById('palette1');
    const p2 = document.getElementById('palette2');
    const p3 = document.getElementById('palette3');
    const p4 = document.getElementById('palette4');
    
    //Palette hex values, arranged from lightest to darkest
    const kirokaze = ['#e2f3e4', '#94e344', '#46878f', '#332c50']; //Kirokaze Gameboy by Kirokaze
    const ayy4 = ['#f1f2da', '#ffce96', '#ff7777', '#00303b']; //Ayy4 by Polyducks
    const spacehaze = ['#f8e3c4', '#cc3495', '#6b1fb1', '#0b0630']; //Spacehaze by WildLeoKnight
    const wish = ['#8be5ff', '#608fcf', '#7550e8', '#622e4c']; // Wish GB by Kerrie Lake
    const rustic = ['#edb4a1', '#a96868', '#764462', '#2c2137']; //Rustic GB by Kerrie Lake
    const demichrome = ['#e9efec', '#a0a08b', '#555568', '#211e20']; //2bit demichrome by Space Sandwich
    
    
    //Listener functions for click events on each palette square
    p1.addEventListener('click', function() {
        setPalette(kirokaze);
    });
    p2.addEventListener('click', function() {
        setPalette(ayy4);
    });
    p3.addEventListener('click', function() {
        setPalette(rustic);
    });
    p4.addEventListener('click', function() {
        setPalette(demichrome);
    });
    
    //Takes in an array of colors and loads each index into the CSS's variables
    function setPalette (paletteArr) {
    r.style.setProperty('--paletteLL', paletteArr[0]);
    r.style.setProperty('--paletteL', paletteArr[1]);
    r.style.setProperty('--paletteD', paletteArr[2]);
    r.style.setProperty('--paletteDD', paletteArr[3]);
    }
});
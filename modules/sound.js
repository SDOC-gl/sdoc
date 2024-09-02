function playSound(path = String, volume = 1, loop = false) {
    const snd = new Audio(path);
    snd.volume = volume;
    snd.loop = loop;
    snd.play();
    return snd;
}


export default { 
    playSound,
}
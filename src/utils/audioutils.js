
var a = new Audio()

export const play = (path) => {
    a = new Audio(path)
    a.play()
}

export const stop = () => {
    a.pause()
    a.currentTime = 0
}
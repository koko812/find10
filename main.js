// index の方で，display = none にしてるのに，こっちに持ってきたら見えるのが謎？？
// とりあえず html のなかで雛形作って．こっちに持ってきて使うという思想は理解できるんだけど

const width = 300
const height = 300

let container = null
let svgTemplate = null;

// まず角度を変える
class Circle {
    constructor(combination) {
        let angle = Math.random() * 0
        const element = document.createElement('div')
        this.element = element
        // this をつけるとめんどくさいので，コンストラクタ内に限ってはつけなくてもいいか
        element.style.position = 'absolute'
        // cloneNode で true にしないと，タグの中身をもらえない
        // ただ，true にすると，id 被りなどが発生しうるから注意とのことだ
        const svg = svgTemplate.cloneNode(true)
        // rotate させるのはあくまで svg の話らしい
        // 0度じゃない時は deg をつけるのを忘れずに
        // これを問題解いてる間にも少しずつ回転すれば面白いんじゃないかとかもちょっと思った
        svg.style.transform = `rotate(${angle}deg)`
        console.log('create Circle');
        element.append(svg)

        angle += 180
        const numSize = 25
        for (let i = 0; i < 3; i++) {
            const num = document.createElement('div')
            element.append(num)
            num.style.position = 'absolute'
            num.style.width = `${numSize}px`
            num.style.height = `${numSize}px`
            console.log(Math.cos(angle), Math.sin(angle));
            const x = 50 + 25 * Math.cos(angle / 180 * Math.PI) - numSize / 2
            const y = 50 + 25 * Math.sin(angle / 180 * Math.PI) - numSize / 2
            num.style.top = `${y}px`
            num.style.left = `${x}px`
            // text 扱う時は，display あたりは指定する，という脳みそになっておこう
            num.style.display = 'flex'
            num.style.alignItems = 'center'
            num.style.justifyContent = 'center'
            num.textContent = combination[i]
            num.style.fontSize = `${numSize*0.8}px`
            angle += 120
        }
    }
}
// 次は，このノードをいっぱい出して，その中に数字をつけるところだね

const init = () => {
    svgTemplate = document.getElementsByTagName('svg')[0]
    // 親ノードと切り離すということをやってるらしい（謎）
    svgTemplate.remove()
    // この block が謎すぎてウケる
    svgTemplate.style.display = "block"

    container = document.createElement('div')
    container.style.position = 'relative'
    container.style.width = `${width}px`
    container.style.height = `${height}px`
    container.style.border = 'solid 1px #000'
    container.style.overflow = 'hidden'
    document.body.append(container)
}

window.onload = () => {
    init()
    // ここ，textContent には数字もそのまま入れてくれるらしくて便利だね
    const circle = new Circle([1, 2, 3])
    container.append(circle.element)
}
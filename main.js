// index の方で，display = none にしてるのに，こっちに持ってきたら見えるのが謎？？
// とりあえず html のなかで雛形作って．こっちに持ってきて使うという思想は理解できるんだけど

const width = 300
const height = 300
const circleSize = 100

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
            // もうちょっとこの辺りを綺麗に書けないのかな，という話は存在する
            const x = 50 + 25 * Math.cos(angle / 180 * Math.PI) - numSize / 2
            const y = 50 + 25 * Math.sin(angle / 180 * Math.PI) - numSize / 2
            num.style.top = `${y}px`
            num.style.left = `${x}px`
            // text 扱う時は，display あたりは指定する，という脳みそになっておこう
            num.style.display = 'flex'
            num.style.alignItems = 'center'
            num.style.justifyContent = 'center'
            num.textContent = combination[i]
            num.style.fontSize = `${numSize * 0.8}px`
            angle += 120
        }
    }
}
// 次は，このノードをいっぱい出して，その中に数字をつけるところだね
// 数字つけはできたんだけど，10になる数を全列挙して，そいつらを足していくのが，
// 相当に大変です，まず panel というのを作って管理していくらしいので，その構造を把握しよう
// まあ理解はできたけど，これを空からあんだけのスピードで実装できるのが異常すぎる

const tenCombinations = [[1,2,3]]

class Panel {
    constructor() {
        const element = document.createElement('div')
        this.element = element
        // circle の x,y は指定してないはずだけど，panel かサークルかどっちで決めていくべきなのか
        // そもそも，circle の x,y は svg の x,y を指定するだけでいいのか
        // 個人的には，pannel の x,y を決める方が簡単だとおもう

        // この辺マジックナンバーにすると，16x16 の拡張とかがめんどくさくなると思う
        const solution = Math.trunc(Math.random() * 9)
        // 自分は x,y で２重ループで回して行くか一瞬悩んだが，ソレはそれでめんどくさい
        // 2重ループにする時としないときの目安みたいなもんはあるんだろうか
        for (let i = 0; i < 9; i++) {
            const x = i % 3
            const y = Math.trunc(i / 3)
            let combination = null
            if (i === solution) {
                combination = tenCombinations[Math.trunc(Math.random() * tenCombinations.length)]
            } else {
                const a = Math.trunc(Math.random() * 10)
                const b = Math.trunc(Math.random() * 10)
                let c;
                do {
                    // これ多分中で宣言したらダメだよね（t-kihira のを見て思った）
                    //const c = Math.trunc(Math.random() * 9)
                    c = Math.trunc(Math.random() * 10)
                } while (a + b + c === 10)
                combination = [a, b, c]
            }

            // これで数字の組み合わせは作れたんだが，まず列挙をどこですべきかという話と，
            // potision は結局どこで決めればいいのかという話になってくる
            // まさかのパネルは 1枚だというオチだった，マジかよ
            // circle のポジションをいじって，他のやつがずれないのかがちと心配なんだが
            // ああでも大丈夫っぽい，というのも，top left は num に対してしか指定しておらず，
            // そいつらは circle の中に入っているので circle を決めれば全て移動するので
            // t-kihira 天才だな

            const circle = new Circle(combination)
            // element を渡す必要があった（1敗）
            element.append(circle.element)
            // 最初 0,0 で定義したはずなので，circleSize /2 で引く必要はないんじゃね？と思ってる
            circle.element.style.top = `${circleSize * y}px`
            circle.element.style.left = `${circleSize * x}px`
        }
    }
}

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
    //const circle = new Circle([1, 2, 3])
    const panel = new Panel()
    container.append(panel.element)
    //container.append(circle.element)
}
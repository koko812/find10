// index の方で，display = none にしてるのに，こっちに持ってきたら見えるのが謎？？
// とりあえず html のなかで雛形作って．こっちに持ってきて使うという思想は理解できるんだけど

const width = 300
const height = 300
const circleSize = 100

let container = null
let svgTemplate = null;
let message = null

// まず角度を変える
class Circle {
    constructor(combination) {
        let angle = Math.random() * 120
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
    vibrate(ratio) {
        // ratio がmsで　1000単位で来るので，これだとデカすぎないか？感がちょっとある
        // 揺れ方がグロすぎたので，100 で割ました，これでちょうどいい感じ
        // t-kihira は 10 かけてるんだけど，ms じゃなくて s 単位でとってこれるメソッドとかあるっけ？
        // それとも，自前で修正してるだけだろうか？別にプレイヤーに秒数を表示するわけでもないので，必要ないと思うんだが
        const x = Math.random() * ratio / 100
        const y = Math.random() * ratio / 100
        //console.log(x, y);
        this.element.style.transform = `translate(${x}px, ${y}px)`
        // 並行移動の translate をまた忘れていた，translate の () の中は関数と考えて，, を入れるようにしよう
        // rgb もそうだっけか？？ , がいらないのは，css の border くらいか? (流石に他にもあるとは思う)
    }
}

// 次は，このノードをいっぱい出して，その中に数字をつけるところだね
// 数字つけはできたんだけど，10になる数を全列挙して，そいつらを足していくのが，
// 相当に大変です，まず panel というのを作って管理していくらしいので，その構造を把握しよう
// まあ理解はできたけど，これを空からあんだけのスピードで実装できるのが異常すぎる

// この書き方をいい加減覚えていきたい，というかそんなにややこしいことはしてないと思うんだけど
// async とか，await は実際に使うところで指定するので必要ないっぽい
const sleep = (duration) => new Promise(r => setTimeout(r, duration))

// まあ基本的に，こういうロジック部分の実装は，サラで書いても大丈夫な雰囲気があるので，サラで書いていこう
// head の時点で読み込まれてるので大丈夫だと思われる，しかも何回も実行されたりみたいなことはないと思う
const tenCombinations = []
for (let a = 0; a < 10; a++) {
    for (let b = 0; b < 10; b++) {
        const c = 10 - a - b
        if (0 <= c && c <= 10) {
            tenCombinations.push([a, b, c])
        }
    }
}
// ちょっとゲームをやってみたんだが，普通にむずいな
// あとはアニメーションをつけて行く感じですね，いい感じ

// constructor を作って，それをさらに別の constructor に入れて行く感じが，オブジェクト指向っぽくて楽しいね
const circles = []
class Panel {
    constructor() {
        console.log(tenCombinations.length);
        const element = document.createElement('div')
        element.style.position = 'absolute'
        element.style.top = '0'
        element.style.left = '0'
        // all じゃない指定をする時はやってくるのだろうか
        element.style.transition = 'all 150ms ease-out'
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
            // ここの条件評価を = 一つにしていたので，無限ループが発生していたのでマジで残念
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
            circles.push(circle)
            circle.element.onpointerdown = async (e) => {
                // なぜこれでOKなのかが，いまさらわからなくなってきた
                // i は circle のプロパティみたいな感じで登録する必要はないんだろうかという感じがする
                console.log('down');
                if (i === solution) {
                    this.next()
                } else {
                    const endTime = Date.now() + 1000
                    element.style.pointerEvents = 'none'
                    while (Date.now() < endTime) {
                        const ratio = endTime - Date.now()
                        circles.forEach(circle => circle.vibrate(ratio))
                        await sleep(16)
                    }
                    element.style.pointerEvents = 'auto'
                    circles.forEach(circle => circle.vibrate(0))
                    // 全部揺らせばいいのはわかるんだけど，foreach でカッコよく書くやり方がわからない
                }
            }
        }
    }
}
// 次は next メソッドの実装，なんだが，ゲロ重くて笑う
// 流石になかなか実装重いね，t-kihira はあんだけ簡単そうに書いてるんだけど

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
    container.style.display = 'flex'
    container.style.textAlign = 'center'
    container.style.fontSize = '30px'
    container.style.justifyContent = 'center'
    container.style.alignItems = 'center'
    document.body.append(container)

    message = document.createElement('div')
    // これは container じゃなくて body に追加する（あたりまえ）
    document.body.append(message)
}

let gameover = false
window.onload = async () => {
    init()

    for (let i = 3; i > 0; i--) {
        // これは，改行を入れたかったから innerHTML にしたんだろうか
        container.innerHTML = `Find10! </br> ${i}`
        console.log(i);
        await sleep(1000)
    }
    container.textContent = ''

    let leftCount = 10
    // ここ，textContent には数字もそのまま入れてくれるらしくて便利だね
    //const circle = new Circle([1, 2, 3])
    let panel = new Panel()
    container.append(panel.element)
    //container.append(circle.element)

    // 時間計測メソッドを追加していく
    // なんでここで tick でぐるぐる回しても，下のメソッドに入れるのかがよくわからない
    // javascript は全部非同期でやってるとかいう話？その辺をきちんと理解しないとちょっと拡張がしづらくて辛いよね
    const startTime = Date.now()
    let erapesedTime 
    const tick = () => {
        if (!gameover) {
            requestAnimationFrame(tick)
            // だってもう普通に考えてここでぐるぐる周りそうなもんだよな
        }
        // tofixed をまた忘れていた
        erapesedTime = (Date.now() - startTime) / 1000
        message.textContent = `left: ${leftCount} / ${erapesedTime.toFixed(3)}sec`
    }
    tick()

    // 連続正解チャレンジなんてものもあっても面白いかもしれない
    for (let i = 0; i < 10; i++) {
        // これ前も出てきたけど，ピンときてない
        // そもそも，panel の next 関数なんてものは実装してないんだよな
        // でも ↓ を実装すると，正解を押した時にエラーは吐かなくなった，なるほど？？
        await new Promise(resolve => {
            panel.next = resolve
        })
        // これ別に transform である必要はないんだね，といまさら気づいた
        leftCount--;

        // こいつを外に出しておかないと，クリアしても，表示され続ける
        // 遷移中のタッチ阻止を忘れていた
        panel.element.style.left = '-300px'
        panel.element.style.pointerEvents = 'none'

        // なんかこの gameclear の判定の書き方キモくない？もっと単純にーーーとか思ったけど，アニメーション止めたりするのが面倒なのか
        if (i !== 9) {
            const newPanel = new Panel()
            // ここで一瞬次のパネルが真ん中に表示されてしまわない？とちょっと思った
            // ここで container に追加しないと（panelを）当たり前に表示されないので注意
            container.append(newPanel.element)
            newPanel.element.style.left = '300px'
            // ここの sleep の秒数に自分的に根拠がなくて困っている
            await sleep(50)
            panel.element.style.pointerEvents = 'auto'
            newPanel.element.style.left = '0px'
            await sleep(150)

            // この処理がそもそも大丈夫なのかは結構気になるけど
            // panel としてフォーカスするものを変えてるだけって話なので，特に問題はないか
            // なんか container の中身がぐちゃぐちゃになるんじゃないかとか一瞬思ったんだけど
            panel = newPanel
            //break
            // いーですね，かなりいい感じにゲームが完成してきている
            // あとはゲームクリアの処理くらいですかね
        } else {
            gameover = true
            await sleep(150)
            container.innerHTML = `Clear! </br>${erapesedTime.toFixed(3)}sec`
        }
    }
}
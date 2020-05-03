  
// 普通数独题目
const questionD = [
  [4, 0, 8, 2, 0, 0, 0, 0, 0],
  [0, 3, 0, 1, 9, 0, 0, 0, 0],
  [0, 7, 0, 0, 0, 8, 4, 0, 0],
  [0, 0, 6, 0, 0, 0, 7, 0, 1],
  [0, 8, 0, 0, 0, 0, 2, 6, 4],
  [3, 4, 1, 0, 0, 0, 0, 5, 0],
  [8, 0, 0, 0, 3, 0, 0, 7, 0],
  [0, 0, 0, 4, 0, 0, 5, 0, 8],
  [0, 0, 0, 7, 0, 5, 0, 4, 0]
]

//x数独题目
const questionX = [
  [0, 0, 0, 0, 5, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 9, 0, 0, 0],
  [0, 0, 1, 2, 0, 3, 0, 0, 0],
  [0, 0, 3, 0, 0, 6, 0, 0, 0],
  [8, 0, 0, 0, 0, 1, 6, 0, 7],
  [0, 2, 0, 3, 0, 0, 0, 0, 0],
  [2, 0, 0, 9, 0, 0, 7, 6, 0],
  [4, 7, 6, 0, 8, 0, 2, 0, 0],
  [0, 3, 0, 0, 0, 0, 4, 0, 0]
]
// 不规则数独题目
const questionZ = [
  [0, 0, 7, 0, 2, 0, 0, 9, 0],
  [0, 0, 0, 9, 0, 0, 0, 0, 7],
  [3, 9, 0, 0, 7, 0, 4, 0, 0],
  [6, 7, 0, 0, 0, 0, 9, 0, 2],
  [5, 2, 0, 0, 0, 8, 0, 0, 0],
  [0, 4, 0, 0, 5, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 8, 0],
  [0, 0, 0, 0, 6, 9, 0, 0, 0],
  [0, 0, 9, 0, 0, 0, 0, 0, 0]
]

// 不规则数独的z定位
const questionZPos = [
  1, 2, 2, 2, 2, 3, 3, 3, 3,
  1, 1, 2, 2, 3, 3, 3, 4, 3,
  1, 1, 2, 2, 4, 4, 4, 4, 3,
  1, 1, 1, 2, 5, 4, 4, 4, 6,
  7, 1, 5, 5, 5, 4, 8, 6, 6,
  7, 5, 5, 5, 5, 5, 8, 8, 6,
  7, 7, 8, 8, 8, 8, 8, 6, 6,
  7, 7, 7, 7, 7, 8, 6, 6, 6,
  9, 9, 9, 9, 9, 9, 9, 9, 9
]

// const questionZPos = [
//   1, 1, 1, 2, 2, 2, 2, 3, 3,
//   1, 1, 1, 4, 2, 3, 3, 3, 3,
//   1, 4, 4, 4, 2, 2, 5, 5, 3,
//   1, 4, 4, 2, 2, 5, 5, 5, 3,
//   1, 4, 4, 5, 5, 5, 5, 6, 3,
//   7, 7, 4, 7, 6, 6, 6, 6, 6,
//   7, 7, 7, 7, 8, 8, 8, 8, 6,
//   7, 7, 9, 9, 9, 9, 8, 8, 6,
//   9, 9, 9, 9, 9, 8, 8, 8, 6
// ]

/**
 * 解题数独的函数
 *
 * @param {string} [type=''] 需要解题的数独类型，
 *   默认'' = 普通， 'x' = X数独， 'z' = 不规则数独， 'xz' = X不规则数独
 * @returns 最终 NumberPlace
 */
function NumberPlaceAnswer(type = '') {
  // 1 初始化参数
  // 可选数字
  const NumberList = [1, 2, 3, 4, 5, 6, 7, 8, 9]
  // 题目需要处理数组
  const NumberNeedAnswer = []
  // 题目非正确值缓存
  const NumberIncorrect = []
  // 最终结果
  const NumberPlace = []

  // 2 处理输入数字
  const question = (function() {
    if (!type) return questionD
    if (type === 'x') return questionX
    if (type === 'z' || type === 'xz') return questionZ
    return []
  })()

  question.forEach((line, y) => {
    line.forEach((number, x) => {
      const num = {
        x: x + 1,
        y: y + 1,
        z: !type.includes('z')
          // 规则数独的z定位
          ? Math.ceil((x + 1) / 3) + (Math.floor(y / 3) * 3)
          // 不规则数独的z定位
          : questionZPos[y * 9 + x],
        s: !type.includes('x')
          // 非X 数独无需增加参数
          ? 0
          // x 数独增加的额外参数
          : x === y ? 1 : (x + y === 8 ? 2 : 0),
        num: number
      }
      NumberPlace.push(num)
    })
  })

  NumberPlace.forEach(num => {
    if (num.num) return
    num.haschoose = new Set()
    NumberPlace.forEach(numCheck => {
      if (!numCheck.num) return
      if (
        numCheck.x === num.x ||
        numCheck.y === num.y ||
        numCheck.z === num.z
        // x 数独增加的额外判断
        || (
          type.includes('x') &&
          numCheck.s && num.s &&
          numCheck.s === num.s
        )
      ) {
        num.haschoose.add(numCheck.num)
      }
    })
  })

  NumberNeedAnswer.push(...NumberPlace
    .filter(num => !num.num)
    .sort((a, b) => b.haschoose.size - a.haschoose.size))

  NumberIncorrect.push(...NumberNeedAnswer.map(() => new Set()))

  // 3 每个数字尝试
  /**
   * 逐行逐个尝试数字的函数
   *
   * @param {Number} lastI 位置循环的起始，用于重算时的起始数
   * @returns NumberPlace
   */
  function answer(lastI) {
    // 3.1 逐个尝试
    for (
      let i = (lastI && lastI > 0) ? lastI: 0;
      i < NumberNeedAnswer.length;
      i++
    ) {
      const numPlace = NumberNeedAnswer[i]

      if (!NumberIncorrect[i].size) {
        NumberIncorrect[i] = new Set(numPlace.haschoose)
        for (let j = 0; j < i; j++) {
          const num = NumberNeedAnswer[j]

          if (
            num.x === numPlace.x ||
            num.y === numPlace.y ||
            num.z === numPlace.z
            // x 数独增加的额外判断
            || (
              type.includes('x') &&
              numPlace.s && num.s &&
              num.s === numPlace.s
            )
          ) {
            NumberIncorrect[i].add(num.num)
          }
        }
      }

      if (NumberIncorrect[i].size === 9) {
        if (i === 0) throw new Error('本题无解')

        NumberIncorrect[i] = new Set()
        NumberIncorrect[i - 1].add(NumberNeedAnswer[i - 1].num)
        NumberNeedAnswer[i - 1].num = 0
        return Promise.resolve(i - 1).then(answer)
      }

      const canBe = NumberList
        .filter(number => !NumberIncorrect[i].has(number))
      const index = Math.floor(Math.random() * canBe.length)
      numPlace.num = canBe[index]
    }

    // 3.2 渲染成表格
    let rendery = -1
    let renderx = []

    NumberPlace.map(num => {
      if (num.y - 1 !== rendery) {
        rendery += 1
        renderx.push([])
      }
      renderx[rendery].push(num.num)
    })

    for (let i = 0; i < renderx.length; i++) {
      console.log(renderx[i])
    }

    // 3.3 返回结果
    return NumberPlace
  }

  // 4 执行
  return answer()
}

//NumberPlaceAnswer("x")

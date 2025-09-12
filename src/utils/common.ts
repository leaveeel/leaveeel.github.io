/**
 * 使用 Fisher-Yates 洗牌算法随机打乱一个数组。
 * @param {Array} arr 要打乱的数组。
 * @returns {Array} 返回一个新的被打乱顺序的数组，原数组不变。
 */
export const shuffleArray = (arr: Array<any>): Array<any> => {
  const newArr = [...arr];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
}

class HexUtil {
  ArrIntersect(Arr1, Arr2) {
    const IntersectArr = [];
    for (let i = 0; i < Arr1.length; i++) {
      for (let j = 0; j < Arr2.length; j++) {
        if (Arr2[j] == Arr1[i]) {
          IntersectArr.push(Arr2[j]);
        }
      }
    }
    return IntersectArr;
  }
  CheckArrIsEqual(Arr1, Arr2) {
    for (var i = 0; i < Arr1.length; i++) {
      if (Arr2[i] != Arr1[i]) {
        return false;
      }
    }
    return true;
  }
  
}
module.exports = HexUtil;


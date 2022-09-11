function isDigit(str) {
  return str.match(/[\d.]/) ? true : false;
}

function parser(obj) {
  console.log(obj);
  output_arr = { val: [], type: [] };
  obj.val.forEach((el, index) => {
    console.log(el, index);
    if (output_arr.val.length === 0) {
      output_arr.val.push(el);
      output_arr.type.push(obj.type[index]);
    } else {
      if (isDigit(el) && isDigit(output_arr.val[output_arr.val.length - 1]))
        output_arr.val[output_arr.val.length - 1] += el;
      else {
        output_arr.val.push(el);
        output_arr.type.push(obj.type[index]);
      }
    }
  });
  console.log(output_arr);
  return output_arr;
}

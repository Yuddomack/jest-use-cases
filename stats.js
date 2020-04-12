const fetch = require('node-fetch');

exports.max = (numbers) => {
    let result = numbers[0] || NaN;
    numbers.forEach(n => {
        n > result && (result = n); // you don't know js
    });

    //console.log(result);
    return result;
}

exports.min = (numbers) => Math.min(...numbers);

exports.avg = (numbers) => numbers.reduce(
    (acc, current, index, array) => acc + current / array.length, 0
);

exports.getLocation = async (id) => {
    const url = `http://52.79.171.8:5555/api/locations/${id}`;
    const res = await fetch(url);
    const resJson = await res.json();

    return resJson;
}
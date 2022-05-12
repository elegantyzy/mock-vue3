export function normolizeClass(arr: Array<any>){
    let value: String = "";
    arr.forEach(item => value = value.concat(` ${item instanceof Object ? openObject(item) : item}`));
    return value.slice(1, value.length);
}

function openObject(target){
    let str: String = ""
    for (const key in target) str = str.concat(`${key}`)
    return str
}
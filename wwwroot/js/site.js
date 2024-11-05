var storage = window.localStorage
var data =
{
    proID: "CB001",
    price: 680,
    qty: 3,
    name: "咖啡A",
    img1: "~/img/neko.png"
}
var data2 =
{
    proID: "CB002",
    price: 360,
    qty: 3,
    name: "咖啡B",
    img1: "~/img/neko.png"
}
var data3 =
{
    proID: "CB002",
    price: 360,
    qty: 2,
    name: "咖啡B",
    img1: "~/img/neko.png"
}
dataArray = []
function SetDataArray(data) {
    if (dataArray.length == 0) {
        dataArray.push(data)
    } else {
        for (let i = 0; i < dataArray.length; i++) {
            if (data.proID == dataArray[i].proID) {
                dataArray[i].qty += data.qty
                break
            }
        }
        //dataArray.push(data)//應該加在哪裡
    }
}
SetDataArray(data)
SetDataArray(data2)
SetDataArray(data3)
console.log(dataArray)



//var d = JSON.stringify(data)
//var d2 = JSON.stringify(data2)
//var d3 = JSON.stringify(data3)
//var valueString = `[${d},${d2},${d3}]`
//storage.setItem("cart",valueString)
//var temp = storage.getItem("cart")
//var temp2 = JSON.parse(temp)

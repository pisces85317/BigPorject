//cart = {
//    
//}
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
var data4 =
{
    proID: "CB003",
    price: 360,
    qty: 1,
    name: "咖啡C",
    img1: "~/img/neko.png"
}
const dataArray = []
function addLs(data) {
    var temp = dataArray.find((e) => { return e.proID == data.proID })
    if (temp != undefined) {
        temp.qty += data.qty
    } else {
        dataArray.push(data)
    }
    var storage = window.localStorage
    storage.setItem("cart", JSON.stringify(dataArray))
}
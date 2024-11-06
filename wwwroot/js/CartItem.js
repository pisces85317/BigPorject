//cart = {
//    
//}
var data =
{
    proID: "CB001",
    img: "img/neko.png",
    name: "咖啡A",
    price: 680,
    qty: 3,
}
var data2 =
{
    proID: "CB002",
    img: "img/neko.png",
    name: "咖啡B",
    price: 360,
    qty: 3,
}
var data3 =
{
    proID: "CB002",
    img: "img/neko.png",
    name: "咖啡B",
    price: 360,
    qty: 2,
}
var data4 =
{
    proID: "CB003",
    img: "img/neko.png",
    name: "咖啡C",
    price: 360,
    qty: 1,
}


/**
 * 把資料加入localstorage
 * @param {Object} data 一組dataset的物件
 */
function addLs(data) {
    var storage = window.localStorage
    var value = storage.getItem("cart")
    var json = (value != null) ? JSON.parse(value) : []
    var temp = json.find((e) => { return e.proID == data.proID })
    if (temp != undefined) {
        temp.qty += data.qty
    } else {
        json.push(data)
    }
    storage.setItem("cart", JSON.stringify(json))
}


/**
 * 取得購物籃產品的部分檢視
 * @param {Object} data 一組dataset的物件
 */
function getHtml(data) {
    $.ajax({
        url: "/Product/AddCartItemToLayout",
        method: "POST",
        data: data,
        success: function (data) {
            $('#layout-target').append(data);
        }
    });
}


/**
 * 把購物籃產品的部分檢視加入購物籃
 * @param {Object} data 一組dataset的物件
 */
function addHtml(data) {
    var carts = $('#layout-target').find('.card-title')
    var cart = carts.filter(function () {
        return $(this).data('id') == data.proID
    })
    if (cart.length != 0) {
        var newQty = parseInt($(cart).parent('.card-body').find('input[type="number"]').val()) + data.qty
        $(cart).parent('.card-body').find('input[type="number"]').val(newQty)

    } else {
        getHtml(data)
    }
}
function setLsHtml(data) {
    addLs(data)
    addHtml(data)
}
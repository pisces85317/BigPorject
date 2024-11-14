/* 
 * Cart
 */


/**
 * 把資料加入localstorage
 * @param {object} data 一組包含proID、img、name、price、qty的data物件
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
 * 把資料移出localstorage
 * @param {string} proID 要移出之物件的proID
 */
function removeLs(proID) {
    var storage = window.localStorage
    var strValue = storage.getItem("cart")
    var objValue = JSON.parse(strValue)
    var resultValue = objValue.filter((e) => e.proID != proID)
    storage.setItem("cart", JSON.stringify(resultValue))
}


/**
 * 更新localstorage內指定資料的qty
 * @param {object} data 一組包含proID、img、name、price、qty的data物件
 */
function updateLs(data) {
    var storage = window.localStorage
    var strValue = storage.getItem("cart")
    var objValue = JSON.parse(strValue)
    var value = objValue.find((e) => e.proID == data.proID)
    value.qty = data.qty
    addLs(value)
}


/**
 * 取得購物籃產品的部分檢視
 * @param {object} data 一組包含proID、img、name、price、qty的data物件
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
 * @param {object} data 一組包含proID、img、name、price、qty的data物件
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


/**
 * 把資料放入localstorage並且把購物籃產品加入購物籃
 * @param {object} data 一組包含proID、img、name、price、qty的data物件
 */
function setLsHtml(data) {
    addLs(data)
    addHtml(data)
}


/***/

/*
 * 頁面刷新 
 */

function loadParams() {
    var queryString = new URLSearchParams(window.location.search);
    if (queryString) {
        queryString.forEach((value, key) => {
            var valueArray = value.includes("#") ? value.split("#") : value;
            console.log(`參數名稱: ${key}, 值: ${decodeURIComponent(valueArray)}`);
        });
    }
}

function setUrl(key, value) {
    var queryMap = new URLSearchParams(window.location.search);
    queryMap.set(key, value)
    window.location.assign(window.location.origin + window.location.pathname + "?" + queryMap)
}

function deleteUrl(key) {
    var queryMap = new URLSearchParams(window.location.search);
    queryMap.delete(key)
    var q = (queryMap.size == 0) ? "" : "?";
    window.location.assign(window.location.origin + window.location.pathname + q + queryMap)
}
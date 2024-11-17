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
 * Load and SetUrl
 */

function loadParams() {
    setBreadcrumb()
    setCheckbox("baking")
    setCheckbox("method")
    setRange()
    setPage()
}
function setBreadcrumb() {
    var pathname = window.location.pathname.split('/')
    $('.breadcrumb').append('<li class="breadcrumb-item"><a href="/Home/Index">首頁</a></li>')
    switch (pathname.length) {
        case 4:
            $('.breadcrumb').append(`<li class="breadcrumb-item">${decodeURI(pathname[3])}</li>`)
            break;
        case 5:
            $('.breadcrumb').append(`<li class="breadcrumb-item">${decodeURI(pathname[3])}</li>`)
            $('.breadcrumb').append(`<li class="breadcrumb-item">${decodeURI(pathname[4])}</li>`)
            break;
        default:
            $('.breadcrumb').append(`<li class="breadcrumb-item">所有商品</li>`)
            break;
    }
}
function setCheckbox(key) {
    var queryMap = new URLSearchParams(window.location.search);
    if (queryMap.has(key)) {
        var valueArray = queryMap.get(key).split("#")
        $(`.filter-${key}-item input[type="checkbox"]`).each(function () {
            var text = $(this).closest('.CBcontainer').text()
            var checked = valueArray.some(function (val) { return val == text })
            $(this).prop("checked", checked)
        })
    }
}
function setRange() {
    var queryMap = new URLSearchParams(window.location.search);
    $('.filterTasteItem input[type="range"]').each(function () {
        if (queryMap.has($(this).prop('id'))) {
            var value = queryMap.get($(this).prop('id'))
            $(this).next('span').text(value)
            $(this).val(value)
            var progress = ($(this).val() - 1) / 4 * 100;
            $(this).css('background', `linear-gradient(to right,#FFB818 ${progress}%, #fff ${progress}%)`);
        }
    })
}
function setPage() {
    var queryMap = new URLSearchParams(window.location.search);
    var totalItem = parseInt($(".ItemSort>:first").text())
    var pageItem = (queryMap.has("item")) ? queryMap.get("item") : 12
    let pageNum = Math.ceil(totalItem / pageItem) // 頁數的數量 = 產品總數量/每頁顯示數量

    // 根據頁數的數量生成分頁標籤
    for (let i = 1; i <= pageNum; i++) {
        $('.pageul').append(`<li><a>${i}</a></li>`)
    }

    // 設定css
    $('.pageul li').removeClass('active')
    if (queryMap.has("page")) {
        var page = $('.pageul li a').filter(function () { return $(this).text() == queryMap.get("page") })
        // ??? var page = $('.pageul li a').filter((e) => $(e).text() == queryString.get("page"))
        $(page).parent().addClass('active')
    } else {
        $('.pageul>:first').addClass('active')
    }

    // 分頁點擊事件
    $('.pageul li a').on('click', function (e) {
        // 設定問號參數map
        setUrl("page", $(this).text())
    })
}

function setUrl(key, value) {
    var queryMap = new URLSearchParams(window.location.search);
    queryMap.set(key, value)
    //window.location.assign(window.location.origin + window.location.pathname + "?" + queryMap)
}
function deleteUrl(key) {
    var queryMap = new URLSearchParams(window.location.search);
    queryMap.delete(key)
    var q = (queryMap.size == 0) ? "" : "?";
    //window.location.assign(window.location.origin + window.location.pathname + q + queryMap)
}

function getProData(queryString) {
    $.ajax({
        url: queryString,
        method: "GET",
        success: function (jsonData) {
            $(".ItemSort>:first").text(jsonData.totalCount + "項")
            $('.cardContainer .row').empty()
            for (let i = 0; i < jsonData.products.length; i++) {
                let doc =
                ` <div class="col-4">
                    <div class="card">
                        <div class="cardImgBody">
                            <img src="/img/neko.png" class="card-img-top">
                            <div>
                                <a href="/Home/Index">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="#464646" width="32" height="32" class="bi bi-share" viewBox="0 0 16 16">
                                        <path d="M13.5 1a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3M11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.5 2.5 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5m-8.5 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3m11 5.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3" />
                                    </svg>
                                </a>
                                <div data-id="${jsonData.products[i].productId}" onclick="cardBtnAdd(this)">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#464646" class="bi bi-cart" viewBox="0 0 16 16">
                                        <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M3.102 4l1.313 7h8.17l1.313-7zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <div class="card-body">
                            <h5 class="card-title text-center">${jsonData.products[i].productName}</h5>
                            <p class="card-text text-center">NT.${jsonData.products[i].price}</p>
                        </div>
                    </div>
                  </div>`
                $('.cardContainer .row').append(doc)
            }
        }
    })
}
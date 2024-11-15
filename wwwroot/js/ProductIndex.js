//篩選的關閉按鈕
function filterBtnClose(self) {
    $(self).closest('.dropdown-menu').removeClass('show');
    $(self).closest('.dropdown-menu').prev().removeClass('show');
}

//產品卡顯示產品浮窗
function cardBtnAdd(self) {
    $.ajax({
        url: "/Product/ShowProductModal",
        method: "POST",
        data: { proID: `${$(self).data('id')}` },
        success: function (data) {
            $('body').append(data);
        }
    });
}

//產品浮窗的關閉按鈕
function modalBtnClose(self) {
    $(self).closest('.modalFixed').remove()
}

//點擊產品浮窗外區域關閉浮窗
$(document).on('click', function (e) {
    if ($('.modalFixed')[0] == e.target) {
        $('.modalFixed').remove()
    }
})

//產品浮窗的Uom數量更新
function modalBtnUom(self) {
    var input = $(self).parent('.modalUOMcomponent').find('input')
    var uom = parseInt($(input).val())
    Update_Btn_Uom(uom, self, input)
}

//產品浮窗的圖片互動
let currentIndex = 0 // 不可以刪掉!!!
function changeImg(test) {
    let totalImagesS = $('.bigImgWrapper div').length;

    currentIndex = test
    let offset = -currentIndex * (100 / totalImagesS);
    $('.bigImgWrapper').css('transform', `translateX(${offset}%)`)
}
function slideImg(i) {
    let totalImages = $('.bigImgWrapper div').length;
    // 更新索引
    currentIndex += i
    // 確保索引不超出張數範圍
    if (currentIndex < 0) {
        currentIndex = totalImages - 1; // 返回到最後一張
    } else if (currentIndex >= totalImages) {
        currentIndex = 0; // 返回到第一張
    }
    // 計算移動的距離
    let offset = -currentIndex * (100 / totalImages); // 每次移動 100% 的寬度

    $('.bigImgWrapper').css('transform', `translateX(${offset}%)`)
}

//產品浮窗加入購物籃
function modalBtnAdd(self) {
    var _price = parseInt($(self).data('price'))
    var _qty = parseInt($(self).closest('.productFormat').find('input[type="number"]').val())
    var data =
    {
        proID: $(self).data('id'),
        img: $(self).data('img'),
        name: $(self).data('name'),
        price: _price,
        qty: _qty,
    }
    setLsHtml(data)
}

//購物籃產品數量加減
function cartBtnUom(self) {
    var input = $(self).parent('.cartBtn').find('input')
    var uom = parseInt($(input).val())
    Update_Btn_Uom(uom, self, input)
    var cartItem = $(self).closest('.cart')
    var _price = parseInt($(cartItem).find('span').text())
    var _qty = parseInt($(cartItem).find('input[type="number"]').val())
    var data =
    {
        proID: $(cartItem).find('.card-title').data('id'),
        img: $(cartItem).find('img').prop('src'),
        name: $(cartItem).find('.card-title').text(),
        price: _price,
        qty: _qty,
    }
    updateLs(data)
}

//移除購物籃產品
function cartBtnClose(self) {
    var cartItem = $(self).parent('.cart')
    var id = cartItem.find('.card-title').data('id')
    removeLs(id)
    cartItem.remove()
}

/**
 * Uom數量更新
 * @param {number} uom 數量
 * @param {any} self 加減號按鈕元素
 * @param {any} input 輸入元素
 */
function Update_Btn_Uom(uom, self, input) {
    if ($(self).text() == "+") {
        // 設定購買上限為10
        if (uom == 10) {
            $(input).val(uom)
        } else {
            $(input).val(uom + 1)
        }
    }
    if ($(self).text() == "-") {
        // 設定購買下限為1
        if (uom == 1) {
            $(input).val(uom)
        } else {
            $(input).val(uom - 1)
        }
    }
}

//瀏覽器滾動到指定位置時顯示/隱藏按鈕
window.onscroll = function () {
    scrollFunction();
}

/**
 * 根據頁面滾動位置顯示或隱藏至頂按鈕
 */
function scrollFunction() {
    if (
        document.body.scrollTop > 200 ||
        document.documentElement.scrollTop > 200
    ) {
        $('.topbtn').show()
    } else {
        $('.topbtn').hide()
    }
}

//點擊時滾動頁面
$('.topbtn').on('click', function () {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
})

//瀏覽器載入
window.onload = function () {
    loadParams()
}


//分類點擊事件
$('.accordion a').on('click', function () {
    var text = $(this).text().trim()
    if (text != "所有商品" && text != "濾掛系列") {
        var col_text = $(this).closest('.accordion-item').find('button').text()
        var newUrl = window.location.origin + `/Product/Index/${col_text}/${text}`
        window.location.assign(newUrl)
    } else {
        var newUrl = window.location.origin + `/Product/Index/${text}`
        window.location.assign(newUrl)
    }
})


//價格排序點擊事件
$('.priceSort li').on('click', function () {
    var text = $(this).text()
    if (text == "綜合") {
        deleteUrl("sort")
    } else if (text.includes("由低到高")) {
        setUrl("sort", "desc")
    } else if (text.includes("由高到低")) {
        setUrl("sort", "asc")
    }
})


//每頁顯示點擊事件
$('.itemShow li').on('click', function () {
    //設定問號參數map
    var queryMap = new URLSearchParams(window.location.search);
    queryMap.delete("page")
    queryMap.set("item", $(this).data('num'))
    window.location.assign(window.location.origin + window.location.pathname + "?" + queryMap)
    //點選分頁設定卡片數量
    setPage()
})


//篩選點擊事件:價格
$('.filter input[type="submit"]').on('click', function () {
    //點選Go按鈕關閉篩選選單
    filterBtnClose(this)
    //設定問號參數map
    var min = $('.filterPriceItem').find('input[name="min"]').val()
    var max = $('.filterPriceItem').find('input[name="max"]').val()
    if (min == "" && max == "") {
        deleteUrl("price")
    } else {
        (min == "") ? min = 0 : null;
        (max == "") ? max = 0 : null;
        setUrl("price", `${min}#${max}`)
    }
})


//篩選點擊事件:烘焙程度，處理法
$('.filter input[type="checkbox"]').on('click', function () {
    let colElem = $(this).closest('.dropdown').find('button').text().trim()
    if (colElem == "烘焙程度") {
        setCheckboxUrl("baking", this)
    } else if (colElem == "處理法") {
        setCheckboxUrl("method", this)
    }
})

function setCheckboxUrl(key, self) {
    let CheckedArr = []
    let List = $(self).closest('.dropdown').find('input[type="checkbox"]:checked')
    if (List.length == 0) {
        deleteUrl(key)
    } else {
        List.each(function () {
            CheckedArr.push($(this).closest('.CBcontainer').text())
        })
        setUrl(key, CheckedArr.join('#'))
    }
}


//篩選輸入事件:味道
$('.filter input[type="range"]').on('input', function () {
    //當range的value更動時，顯示其值在對應的span裡和input的樣式
    $(this).next('span').text($(this).val());
    var progress = ($(this).val() - $(this).prop('min')) / ($(this).prop('max') - $(this).prop('min')) * 100;
    $(this).css('background', `linear-gradient(to right,#FFB818 ${progress}%, #fff ${progress}%)`)
})
$('.filter input[type="range"]').on("change", function () {
    //設定問號參數map
    if ($(this).val() == 1) {
        deleteUrl($(this).prop('id'))
    } else {
        setUrl($(this).prop('id'), $(this).val())
    }
})
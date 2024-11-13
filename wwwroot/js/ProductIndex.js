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
totalItem = "@total_item"
window.onload = function () {
    //設定分頁
    Set_Page(40, 12)
}


/**
 * (根據點選的分頁顯示卡片數量)
 * @param {number} page_num 當前分頁數
 * @param {number} item_per_page 每頁要顯示的卡片數量
 */
function showPage(page_num, item_per_page) {
    // 要顯示的卡片起始值
    let start = (page_num - 1) * item_per_page
    // 要顯示的卡片結束值
    let end = start + item_per_page

    $('.cardContainer').find('.col-4').css('display', 'none');
    $('.cardContainer').find('.col-4').slice(start, end).css('display', 'flex')
}


//分類點擊事件
$('.accordion a').on('click', function () {
    //設定麵包屑路徑
    //設定問號參數map
    queryMap.delete("country")
    queryMap.delete("flavor")
    $('.breadcrumb').empty()
    $('.breadcrumb').append('<li class="breadcrumb-item"><a href="/Home/Index">首頁</a></li>')
    var text = $(this).text().trim()
    if (text != "所有商品" && text != "濾掛系列") {
        var ca_text = $(this).closest('.accordion-item').find('button').text()
        $('.breadcrumb').append(`<li class="breadcrumb-item">${ca_text}</li>`)
        queryMap.set("category", ca_text)
        if (ca_text == "產地") {
            queryMap.set("country", text)
        }
        else if (ca_text == "風味") {
            queryMap.set("flavor", text)
        }
    } else {
        queryMap.set("category", text)
    }
    $('.breadcrumb').append(`<li class="breadcrumb-item active" aria-current="page">${text}</li>`)
    newDoc(queryMap)
})


//價格排序點擊事件
$('.priceSort li').on('click', function () {
    var text = $(this).text()
    if (text == "綜合") {
        queryMap.delete("sort")
    } else if (text.includes("由低到高")) {
        queryMap.set("sort", "desc")
    } else if (text.includes("由高到低")) {
        queryMap.set("sort", "asc")
    }
    newDoc(queryMap)
})


//每頁顯示點擊事件
$('.itemShow li').on('click', function () {
    //每頁顯示文字改變
    //點選分頁設定卡片數量
    $(this).closest('.dropdown').find('button').text($(this).text())
    Set_Page(40, $(this).data('num'))
    //設定問號參數map
    queryMap.set("item", $(this).data('num'))
    newDoc(queryMap)
})


//篩選點擊事件:價格
$('.filter input[type="submit"]').on('click', function () {
    //點選Go按鈕關閉篩選選單
    filterBtnClose(this)
    //設定問號參數map
    var min = $('.filterPriceItem').find('input[name="min"]').val()
    var max = $('.filterPriceItem').find('input[name="max"]').val()
    if (min == "" && max == "") {
        queryMap.delete("price")
    } else {
        (min == "") ? min = 0 : null;
        (max == "") ? max = 0 : null;
        queryMap.set("price", `${min}#${max}`)
    }
    newDoc(queryMap)
})


//篩選點擊事件:烘焙程度，處理法
$('.filter input[type="checkbox"]').on('click', function () {
    let colElem = $(this).closest('.dropdown').find('button').text().trim()
    if (colElem == "烘培程度") {
        let backingCheckedArr = []
        let bakingList = $(this).closest('.dropdown').find('input[type="checkbox"]:checked')
        if (bakingList.length == 0) {
            queryMap.delete("backing")
        } else {
            bakingList.each(function () {
                backingCheckedArr.push($(this).closest('.CBcontainer').text())
            })
            queryMap.set("backing", backingCheckedArr.join('#'))
        }
    } else if (colElem == "處理法") {
        let methodCheckedArr = []
        let methodList = $(this).closest('.dropdown').find('input[type="checkbox"]:checked')
        if (methodList.length == 0) {
            queryMap.delete("method")
        } else {
            methodList.each(function () {
                methodCheckedArr.push($(this).closest('.CBcontainer').text())
            })
            queryMap.set("method", methodCheckedArr.join('#'))
        }
    }
    newDoc(queryMap)
})


//篩選輸入事件:味道
$('.filter input[type="range"]').on('input', function () {
    //當range的value更動時，顯示其值在對應的span裡和input的樣式
    $(this).next('span').text($(this).val());
    const progress = ($(this).val() - $(this).prop('min')) / ($(this).prop('max') - $(this).prop('min')) * 100;
    $(this).css('background', 'linear-gradient(to right, #FFB818 0%, #FFB818 ' + progress + '%, #ffd068 ' + progress + '%, #ffd068 100%)')
    //設定問號參數map
    queryMap.set($(this).prop('id'), $(this).val())
    if (queryMap.get($(this).prop('id')) == 1) {
        queryMap.delete($(this).prop('id'))
    }
    newDoc(queryMap)
})


/**
 * 設定分頁的數量、css和點擊事件
 * @param {number} total_item 總卡片
 * @param {number} item_per_page 每頁要顯示的卡片數量
 */
function Set_Page(total_item, item_per_page) {
    // 頁數的數量 = 總卡片/每頁要顯示的卡片數量
    let total_pages = Math.ceil(total_item / item_per_page)

    // 根據頁數的數量生成分頁標籤，在分頁清單中的第一個清單增加css類別
    $('.pageul').empty()
    for (let i = 1; i <= total_pages; i++) {
        $('.pageul').append(`<li><a>${i}</a></li>`)
    }
    $('.pageul li').first().addClass('active')

    // (顯示第一頁的卡片)
    showPage(1, item_per_page)

    //分頁點擊事件
    $('.pageul li a').on('click', function (e) {
        //設定樣式
        e.preventDefault();
        let currentPage = $(this).text()
        $('.pageul li').removeClass('active')
        $(this).parent().addClass('active')
        // (顯示當前頁面的卡片)
        showPage(currentPage, item_per_page)
        //設定問號參數map
        queryMap.set("page", $(this).text())
        newDoc(queryMap)
    })
}
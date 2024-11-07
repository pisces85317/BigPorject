//每頁顯示文字改變
function changeText(self) {
    $(document).on('click', function (event) {
        var text = $(event.target).text()
        $(self).closest('.dropdown').find('button').text(text)
    })
}

//點選關閉按鈕關閉篩選選單 
function filterBtnClose(test) {
    $(test).closest('.dropdown-menu').prev().removeClass('show');
    $(test).closest('.dropdown-menu').removeClass('show');
}

//當range的value更動時顯示其值在對應的span裡和input的樣式
function valueChange(test) {
    $(test).next('span').text($(test).val());
    const progress = ($(test).val() - $(test).prop('min')) / ($(test).prop('max') - $(test).prop('min')) * 100;
    $(test).css('background', 'linear-gradient(to right, #FFB818 0%, #FFB818 ' + progress + '%, #ffd068 ' + progress + '%, #ffd068 100%)')
}

//產品卡顯示產品浮窗
function cardBtnAdd(self) {
    $.ajax({
        url: "/Product/ShowProductModal",
        method: "GET",
        //data: data,
        success: function (data) {
            $('body').append(data);
        }
    });
}

//產品浮窗的關閉按鈕
function modalBtnClose(self) {
    $(self).closest('.modalFixed').remove()
}

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
currentIndex = 0 // 不可以刪掉!!!
function changeImg(test) {
    //let currentIndex = 0;
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
function modalBtnAdd() {
    // 測試中...
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
    setLsHtml(data)
    setLsHtml(data2)
    setLsHtml(data3)
    setLsHtml(data4)
}

//購物籃產品數量加減
function cartBtnUom(self) {
    var input = $(self).parent('.cartBtn').find('input')
    var uom = parseInt($(input).val())
    Update_Btn_Uom(uom, self, input)
    var data =
    {
        proID: "CB001",
        img: "img/neko.png",
        name: "咖啡A",
        price: 680,
        qty: 5,
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

//瀏覽器載入時設定分頁
window.onload = function () {
    Set_Page(40, 12)
}
//點選分頁設定卡片數量
$('.f-show-item').on('click', function () {
    Set_Page(40, $(this).data('num'))
})
/**
 * 設定分頁、設定css並繫結點擊事件
 * @param {number} total_item 總卡片
 * @param {number} item_per_page 每頁要顯示的卡片數量
 */
function Set_Page(total_item, item_per_page) {
    // 頁數的數量 = 總卡片/每頁要顯示的卡片數量
    let total_pages = Math.ceil(total_item / item_per_page)

    // 根據頁數的數量生成分頁標籤，在分頁清單中的第一個清單增加css類別
    $('.pageul').empty()
    for (let i = 1; i <= total_pages; i++) {
        $('.pageul').append(`<li><a href="#">${i}</a></li>`)
    }
    $('.pageul li').first().addClass('active')

    // 顯示第一頁的卡片
    showPage(1, item_per_page)

    //繫結分頁的點擊事件
    $('.pageul li a').on('click', function (e) {
        e.preventDefault();
        let currentPage = $(this).text()
        $('.pageul li').removeClass('active')
        $(this).parent().addClass('active')
        // 顯示當前頁面的卡片
        showPage(currentPage, item_per_page)
        // 回到頁面頂部
        backToTop()
    })
}

/**
 * 根據點選的分頁顯示卡片數量
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
/**
 * 回到頂部
 */
function backToTop() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}
//點選分類設定麵包屑路徑
$('.accordion a').on('click', function () {
    SetBreadcrumb(this)
})
/**
 * 根據點選的分類顯示對應的麵包屑路徑
 * @param {any} test 當前元素
 */
function SetBreadcrumb(test) {
    //<li class="breadcrumb-item active" aria-current="page">所有商品</li>
    if ($(test).text() == "所有商品" || $(test).text() == "耳掛系列") {
        $('.breadcrumb').empty()
        $('.breadcrumb').append('<li class="breadcrumb-item"><a href="/Home/Index">首頁</a></li>')
        $('.breadcrumb').append(`<li class="breadcrumb-item active" aria-current="page">${$(test).text()}</li>`)
    } else {
        $('.breadcrumb').empty()
        $('.breadcrumb').append('<li class="breadcrumb-item"><a href="/Home/Index">首頁</a></li>')
        $('.breadcrumb').append(`<li class="breadcrumb-item">${$(test).closest('.accordion-item').find('button').text()}</li>`)
        $('.breadcrumb').append(`<li class="breadcrumb-item active" aria-current="page">${$(test).text()}</li>`)
    }
}
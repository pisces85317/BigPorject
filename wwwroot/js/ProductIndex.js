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
//產品數量顯示綁定產品數量的按鈕
function modalUOMbtn(test) {
    let UOM = parseInt($(test).closest('.modalUOMcomponent').find('input').val());
    if ($(test).text() == "+") {
        // 設定最大為10
        if ($(test).closest('.modalUOMcomponent').find('input').val() == 10) {
            $(test).closest('.modalUOMcomponent').find('input').val(10)
        } else {
            $(test).closest('.modalUOMcomponent').find('input').val((UOM + 1).toString())
        }
    }
    if ($(test).text() == "-") {
        // 設定最小為1
        if ($(test).closest('.modalUOMcomponent').find('input').val() == 1) {
            $(test).closest('.modalUOMcomponent').find('input').val(1)
        } else {
            $(test).closest('.modalUOMcomponent').find('input').val((UOM - 1).toString())
        }
    }
}
function cartUOMbtn(test) {
    let cartUOM = parseInt($(test).closest('.cartBtn').find('input').val())
    let op = $(test).text()
    if (op == "-") {
        if (cartUOM == 1) {
            $(test).closest('.cartBtn').find('input').val(1)
        } else {
            $(test).closest('.cartBtn').find('input').val((cartUOM - 1).toString())
        }
    } else if (op == "+") {
        if (cartUOM == 10) {
            $(test).closest('.cartBtn').find('input').val(10)
        } else {
            $(test).closest('.cartBtn').find('input').val((cartUOM + 1).toString())
        }
    }
}
//點小圖換大圖 

function changeImg(test) {
    let currentIndexS = 0;
    let totalImagesS = $('.bigImgWrapper div').length;

    currentIndexS = test
    let offset = -currentIndexS * (100 / totalImagesS);
    $('.bigImgWrapper').css('transform', `translateX(${offset}%)`)
}
//點圖示換大圖 

function slideImg(i) {
    let currentIndex = 0;
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
//加入購物車 
function addCart() {
    $.ajax({
        url: "/Product/AddCartItemToLayout",
        method: "POST",
        //data:
            success: function(data) {
                console.log(data);
                $('#layout-target').append(data);
            },
        error: function () {
            console.log("請求失敗");
        }
    });
}
//!移除購物車(該放在layout的函式)
function removeCart(test) {
    $(test).closest('.cart').remove();
}
//瀏覽器滾動到指定位置時顯示/隱藏按鈕
window.onscroll = function () {
    scrollFunction();
};
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

$('.f-show-item').on('click', function () {
    Set_Page(40, $(this).data('num'))
})
/**
 * 設定分頁、設定css並繫結點擊事件
 * @param {number} total_item 總項目
 * @param {number} item_per_page 每頁要顯示的項目
 */
function Set_Page(total_item,item_per_page) {
    // 頁數的數量 = 總項目/每頁要顯示的項目
    let total_pages = Math.ceil(total_item / item_per_page)

    // 根據頁數的數量生成分頁標籤，在分頁清單中的第一個項目增加css類別
    $('.pageul').empty()
    for (let i = 1; i <= total_pages; i++) {
        $('.pageul').append(`<li><a href="#">${i}</a></li>`)
    }
    $('.pageul li').first().addClass('active')

    // 顯示第一頁的項目
    showPage(1, item_per_page)

    //繫結分頁的點擊事件
    $('.pageul li a').on('click', function (e) {
        e.preventDefault();
        let currentPage = $(this).text()
        $('.pageul li').removeClass('active')
        $(this).parent().addClass('active')
        // 顯示當前頁面的項目
        showPage(currentPage, item_per_page)
        // 回到頁面頂部
        backToTop()
    })
}

/**
 * 根據點選的分頁顯示項目索引
 * @param {number} page_num 當前分頁數
 * @param {number} item_per_page 每頁要顯示的個數
 */
function showPage(page_num, item_per_page) {
    // 要顯示的項目起始索引
    let start = (page_num - 1) * item_per_page
    // 要顯示的項目結束索引
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
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
let currentIndexS = 0;
const totalImagesS = $('.bigImgWrapper div').length;
function changeImg(test) {
    currentIndexS = test
    const offset = -currentIndexS * (100 / totalImagesS);
    $('.bigImgWrapper').css('transform', `translateX(${offset}%)`)
}
//點圖示換大圖 
let currentIndex = 0;
const totalImages = $('.bigImgWrapper div').length;
function slideImg(i) {
    // 更新索引
    currentIndex += i
    // 確保索引不超出張數範圍
    if (currentIndex < 0) {
        currentIndex = totalImages - 1; // 返回到最後一張
    } else if (currentIndex >= totalImages) {
        currentIndex = 0; // 返回到第一張
    }
    // 計算移動的距離
    const offset = -currentIndex * (100 / totalImages); // 每次移動 100% 的寬度

    $('.bigImgWrapper').css('transform', `translateX(${offset}%)`)
}
//加入購物車 
function addCart() {
    console.log("OK")
    $.ajax({
        url: "/Product/AddCartItemToLayout",
        method: "POST",
        data:
        success: function (data) {
            console.log(data);
            $('#layout-target').append(data);
        },
        error: function () {
            console.log("請求失敗");
        }
    });
    console.log("OK")
}
//!移除購物車(該放在layout的函式)
function removeCart(test) {
    $(test).closest('.cart').remove();
}
//到頂部 
window.onscroll = function () {
    scrollFunction();
};
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
$('.topbtn').on('click', function () {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
})
function backToTop() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}
//分頁 
totalItems = 40 // 全域變數:總項目
itemPerPage = 12  // 全域變數:每頁顯示的項目
totalPages = Math.ceil(totalItems / itemPerPage) // 全域變數:總頁數
// 根據總頁數生成分頁標籤
for (let i = 1; i <= totalPages; i++) {
    $('.pageul').append(`<li><a href="#">${i}</a></li>`)
}
// 在清單中的第一個項目增加類別
$('.pageul li').first().addClass('active')
// 顯示第一頁的項目
showPage(1)
//根據點選的頁數顯示項目索引
function showPage(num) {
    let start = (num - 1) * itemPerPage // 要顯示的項目起始索引
    let end = start + itemPerPage // 要顯示的項目結束索引

    $('.cardContainer').find('.col-4').css('display', 'none');
    $('.cardContainer').find('.col-4').slice(start, end).css('display', 'flex')
}
//當頁數的連結被點擊時設定該元素的li類別和顯示對應的項目索引
$('.pageul li a').on('click', function (e) {
    e.preventDefault();
    let currentPage = $(this).text()
    $('.pageul li').removeClass('active')
    $(this).parent().addClass('active')
    showPage(currentPage)
    // 回到頁面頂部
    backToTop()
})
//根據點選的選項重新設定頁數數量
function showItemPerPage(num) {
    itemPerPage = num
    totalPages = Math.ceil(totalItems / itemPerPage)
    $('.pageul').empty()
    for (let i = 1; i <= totalPages; i++) {
        $('.pageul').append(`<li><a href="#">${i}</a></li>`)
    }
    $('.pageul li').first().addClass('active')
    showPage(1)
    $('.pageul li a').on('click', function (e) {
        e.preventDefault();
        let currentPage = $(this).text()
        $('.pageul li').removeClass('active')
        $(this).parent().addClass('active')
        showPage(currentPage)
        // 回到頁面頂部
        backToTop()
    })
}
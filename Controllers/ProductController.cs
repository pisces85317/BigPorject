using BigPorject.Models;
using Microsoft.AspNetCore.Mvc;

namespace BigPorject.Controllers
{
    public class ProductController : Controller
    {
        private List<Product> Products = new List<Product>()
        {
            new Product(1,"CB001","天堂",680,"咖啡豆","包","巴西","中淺焙","花香,果香",4,3,1,3,3,"蜜處理","~/img/neko.png"),
            new Product(2,"CB002","花蜜瓜瓜",680,"咖啡豆","包","哥倫比亞","中淺焙","果香,茶香",5,3,1,4,3,"水洗","~/img/fish.png"),
            new Product(3,"CB003","耶加雪菲",460,"咖啡豆","包","衣索比亞","中淺焙","果香,茶香",4,3,2,3,3,"日曬","~/img/neko.png"),
            new Product(4,"CB004","莊園配方",390,"咖啡豆","包","衣索比亞","中淺焙","花香 ,果香,酒香",4,3,2,3,3,"日曬","~/img/pig.png"),
            new Product(5,"CB005","世界冠軍拿鐵配方",280,"咖啡豆","包","哥倫比亞,巴西","中焙","堅果香,巧克力",4,3,3,3,4,"水洗", "~/img/sheep.png"),
            new Product(6,"CB006","世界冠軍配方",280,"咖啡豆","包","衣索比亞,巴西","中焙","果香,茶香,堅果香",4,3,2,3,3,"日曬","~/img/fish.png"),
            new Product(7,"CD001","極品阿拉比卡",250,"濾掛咖啡","盒","哥倫比亞,巴西,哥倫比亞","中淺焙","果香,堅果香",4,4,1,2,2,"日曬", "~/img/sheep.png"),
            new Product(8,"CD002","經典阿拉比卡",250,"濾掛咖啡","盒","巴西,哥倫比亞,衣索比亞,瓜地馬拉","中深焙","巧克力,",3,2,2,3,4,"日曬","~/img/pig.png"),
            new Product(9,"CD003","世界冠軍配方",260,"濾掛咖啡","盒","衣索比亞,哥倫比亞,巴西","中焙","果香,茶香,堅果香",4,3,2,3,3,"日曬","~/img/fish.png"),
            new Product(10,"CD004","莊園濾掛咖啡",360,"濾掛咖啡","盒","衣索比亞","中淺焙","花香 ,果香,酒香",4,3,2,3,3,"日曬","~/img/neko.png"),

        };
        public IActionResult Index()
        {
            return View();
        }
        [HttpPost]
        public IActionResult AddCartItemToLayout(CartItemData data)
        {
            return PartialView("_PartialCartItem", data);
        }
        public IActionResult SelectProduct(string column, string value)
        {
            if (column == "所有商品")
            {
                var query = from p in Products
                            select p;
                var a = query.ToList();
                return new JsonResult(a);
            }

            return new JsonResult("");
        }
    }
}

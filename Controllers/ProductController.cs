using BigPorject.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;

namespace BigPorject.Controllers
{
    public class ProductController : Controller
    {
        private ProjectContext _context;

        public ProductController(ProjectContext dbContext)
        {
            _context = dbContext;
        }
        public async Task<IActionResult> Index(string column, string category)
        {
            // 要有一個分類篩選後的產品總數量
            string sort = Request.Query["sort"].ToString();
            string item = Request.Query["item"].ToString();
            string page = Request.Query["page"].ToString();
            string price = Request.Query["price"].ToString();
            string baking = Request.Query["baking"].ToString();
            string method = Request.Query["method"].ToString();
            string fragrance = Request.Query["fragrance"].ToString();
            string sour = Request.Query["sour"].ToString();
            string bitter = Request.Query["bitter"].ToString();
            string sweet = Request.Query["sweet"].ToString();
            string strong = Request.Query["strong"].ToString();
            if (column == "產地")
            {
                var query = from p in _context.Products
                            where p.Country!.Contains(category)
                            select p;
                return View(await query.ToListAsync());
            }
            else if (column == "風味")
            {
                var query = from p in _context.Products
                            where p.Flavor!.Contains(category)
                            select p;
                return View(await query.ToListAsync());
            }
            else if (column == "濾掛系列")
            {
                var query = from p in _context.Products
                            where p.Category == "濾掛咖啡"
                            select p;
                return View(await query.ToListAsync());
            }

            return View(await _context.Products.ToListAsync());
        }
        [HttpPost]
        public IActionResult AddCartItemToLayout(CartItemData data)
        {
            return PartialView("_PartialCartItem", data);
        }
        [HttpPost]
        public async Task<IActionResult> ShowProductModal(string proID)
        {
            var query = (from p in _context.Products
                         where p.ProductId == proID
                         select p).SingleOrDefaultAsync();
            return PartialView("_PartialProductModal", await query);
        }
    }
    public class CartItemData
    {
        public string? proID { get; set; }
        public string? img { get; set; }
        public string? name { get; set; }
        public int price { get; set; }
        public int qty { get; set; }
    }
}

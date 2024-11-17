using BigPorject.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace BigPorject.Controllers
{
    public class ProductController : Controller
    {
        private ProjectContext _context;

        public ProductController(ProjectContext dbContext)
        {
            _context = dbContext;
        }
        public async Task<IActionResult> All()
        {
            //拋出產品集合、產地、風味、烘焙程度、處理法的所有值的模型
            var products = await _context.Products.ToListAsync();
            var country = _context.Products
                .Select(p => p.Country)
                .Where(c => !string.IsNullOrEmpty(c))
                .ToList()
                .SelectMany(c => c!.Split(new[] { ',' }, StringSplitOptions.RemoveEmptyEntries))
                .Select(s => s.Trim())
                .Distinct()
                .ToArray();
            var flavor = _context.Products
                .Select(p => p.Flavor)
                .Where(c => !string.IsNullOrEmpty(c))
                .ToList()
                .SelectMany(c => c!.Split(new[] { ',' }, StringSplitOptions.RemoveEmptyEntries))
                .Select(s => s.Trim())
                .Distinct()
                .ToArray();
            var baking = _context.Products.Select(p => p.Baking)
                .Distinct()
                .ToArray();
            var method = _context.Products.Select(p => p.Method)
                .Distinct()
                .ToArray();
            DocLoad docLoad = new DocLoad()
            {
                Products = products,
                Country = country,
                Flavor = flavor,
                Baking = baking!,
                Method = method!
            };
            return View(docLoad);
        }
        [HttpGet]
        public async Task<IActionResult> Query(string column, string? category)
        {
            var query = from p in _context.Products
                        select p;
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
                query = from p in _context.Products
                        where p.Country!.Contains(category!)
                        select p;
                return Json(new DatanNum() { Products = await query.ToListAsync(), TotalCount = query.Count() });
            }
            else if (column == "風味")
            {
                query = from p in _context.Products
                        where p.Flavor!.Contains(category!)
                        select p;
                return Json(new DatanNum() { Products = await query.ToListAsync(), TotalCount = query.Count() });
            }
            else if (column == "濾掛系列")
            {
                query = from p in _context.Products
                        where p.Category == "濾掛咖啡"
                        select p;
                return Json(new DatanNum() { Products = await query.ToListAsync(), TotalCount = query.Count() });
            }

            return Json(new DatanNum() { Products = await query.ToListAsync(), TotalCount = query.Count() });
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
    public class DocLoad
    {
        public List<Product>? Products { get; set; }
        public string[]? Country { get; set; }
        public string[]? Flavor { get; set; }
        public string[]? Baking { get; set; }
        public string[]? Method { get; set; }

    }
    public class CartItemData
    {
        public string? proID { get; set; }
        public string? img { get; set; }
        public string? name { get; set; }
        public int price { get; set; }
        public int qty { get; set; }
    }
    public class DatanNum
    {
        public List<Product>? Products { get; set; }
        public int TotalCount { get; set; }
    }
}

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
        public async Task<IActionResult> Index()
        {
            var category = Request.Query["category"].ToString();
            if (category == "產地")
            {
                var country = Request.Query["country"].ToString();
                var query = from p in _context.Products
                            where p.Country!.Contains(country)
                            select p;
                return View(await query.ToListAsync());
            }
            else if (category == "風味")
            {
                var flavor = Request.Query["flavor"].ToString();
                var query = from p in _context.Products
                            where p.Flavor!.Contains(flavor)
                            select p;
                return View(await query.ToListAsync());
            }
            else if (category == "濾掛系列")
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

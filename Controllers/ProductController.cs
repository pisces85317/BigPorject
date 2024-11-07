using BigPorject.Models;
using Microsoft.AspNetCore.Mvc;
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
            return View(await _context.Products.ToListAsync());
        }
        [HttpPost]
        public IActionResult AddCartItemToLayout(CartItemData data)
        {
            return PartialView("_PartialCartItem", data);
        }
        [HttpGet]
        public IActionResult ShowProductModal()
        {
            return PartialView("_PartialProductModal");
        }
        public IActionResult SelectProduct(string column, string value)
        {
            if (column == "所有商品")
            {
                //var query = from p in Products
                //            select p;
                //var a = query.ToList();
                //return new JsonResult(a);
            }

            return new JsonResult("");
        }
    }
}

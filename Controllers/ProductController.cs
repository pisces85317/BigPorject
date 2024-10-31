using Microsoft.AspNetCore.Mvc;

namespace BigPorject.Controllers
{
    public class ProductController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
        [HttpPost]
        public IActionResult AddCartItemToLayout()
        {
            return PartialView("_PartialCartItem");
        }
    }
}

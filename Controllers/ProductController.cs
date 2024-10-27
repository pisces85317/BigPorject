using Microsoft.AspNetCore.Mvc;

namespace BigPorject.Controllers
{
	public class ProductController : Controller
	{
		public IActionResult All()
		{
			return View();
		}
		public IActionResult Index()
		{
			return View();
		}
	}
}

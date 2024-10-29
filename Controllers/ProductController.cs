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
        [HttpPost]
        public IActionResult AddElementToLayout()
        {
            // 要新增的 HTML 內容
            string newElementHtml = "<div class='new-element'>動態加入的內容</div>";

            // 返回部分視圖或 JSON 資料
            return Json(new { success = true, html = newElementHtml });
        }
    }
}

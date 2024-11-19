using BigPorject.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;
using LinqKit.Core;
using LinqKit;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace BigPorject.Controllers
{
    public class ProductController : Controller
    {
        private ProjectContext _context;

        public ProductController(ProjectContext dbContext)
        {
            _context = dbContext;
        }

        [ActionName("要隱藏")]
        public async Task<IActionResult> All()
        {
            //拋出產品集合、產地、風味、烘焙程度、處理法的所有值的模型
            var totalcount = _context.Products.Count();
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
                TotalCount = totalcount,
                Country = country,
                Flavor = flavor,
                Baking = baking!,
                Method = method!
            };
            return View("All", docLoad);
        }
        [HttpGet]
        public IActionResult Query(string column, string? category)
        {
            // 分類
            List<Product> query = (from p in _context.Products
                                   select p).ToList();
            if (column == "產地")
            {
                query = (from p in _context.Products
                         where p.Country!.Contains(category!)
                         select p).ToList();
            }
            else if (column == "風味")
            {
                query = (from p in _context.Products
                         where p.Flavor!.Contains(category!)
                         select p).ToList();
            }
            else if (column == "濾掛系列")
            {
                query = (from p in _context.Products
                         where p.Category == "濾掛咖啡"
                         select p).ToList();
            }

            //篩選
            var predicateAnd = PredicateBuilder.New<Product>(true); // AND
            var predicateOr = PredicateBuilder.New<Product>(true); // OR

            var price = Request.Query["price"].ToString();
            if (!string.IsNullOrEmpty(price))
            {
                var min = Convert.ToInt32(price.Split('#')[0]);
                var max = Convert.ToInt32(price.Split('#')[1]);
                predicateAnd = predicateAnd.And(p => p.Price >= min);
                predicateAnd = predicateAnd.And(p => p.Price <= max);
            }
            // ?? and or 的組合
            var baking = Request.Query["baking"].ToString();
            if (!string.IsNullOrEmpty(baking))
            {
                string[] bakingArr = baking.Split('#');
                foreach (string b in bakingArr)
                {
                    predicateOr = predicateOr.Or(p => p.Baking == b);
                }
                predicateAnd = predicateAnd.And(predicateOr);
            }
            var method = Request.Query["method"].ToString();
            if (!string.IsNullOrEmpty(method))
            {
                string[] methodArr = method.Split('#');
                foreach (string m in methodArr)
                {
                    predicateOr = predicateOr.Or(p => p.Method == m);
                }
                predicateAnd = predicateAnd.And(predicateOr);
            }
            // ?? 條件如何判斷
            var fragrance = Request.Query["fragrance"].ToString();
            if (!string.IsNullOrEmpty(fragrance))
            {
                int fragranceInt = Convert.ToInt32(fragrance);
                predicateAnd = predicateAnd.And(p => p.Fragrance <= fragranceInt);
            }
            var sour = Request.Query["sour"].ToString();
            if (!string.IsNullOrEmpty(sour))
            {
                var sourInt = Convert.ToInt32(sour);
                predicateAnd = predicateAnd.And(p => p.Sour <= sourInt);
            }
            var bitter = Request.Query["bitter"].ToString();
            if (!string.IsNullOrEmpty(bitter))
            {
                var bitterInt = Convert.ToInt32(bitter);
                predicateAnd = predicateAnd.And(p => p.Bitter <= bitterInt);
            }
            var sweet = Request.Query["sweet"].ToString();
            if (!string.IsNullOrEmpty(sweet))
            {
                var sweetInt = Convert.ToInt32(sweet);
                predicateAnd = predicateAnd.And(p => p.Sweet <= sweetInt);
            }
            var strong = Request.Query["strong"].ToString();
            if (!string.IsNullOrEmpty(strong))
            {
                var strongInt = Convert.ToInt32(strong);
                predicateAnd = predicateAnd.And(p => p.Strong <= strongInt);
            }

            //var query2 = query.Where(predicateAnd).Where(predicateOr);
            var query2 = query.Where(predicateAnd);

            // 排序
            string sort = Request.Query["sort"].ToString();
            var query3 = query2.OrderBy(p => p.Id);
            if (!string.IsNullOrEmpty(sort))
            {
                if (sort == "asc")
                {
                    query3 = query2.OrderBy(p => p.Price);
                }
                else if (sort == "desc")
                {
                    query3 = query2.OrderByDescending(p => p.Price);
                }
            }

            // 分頁
            string page = Request.Query["page"].ToString();
            int pageInt = (string.IsNullOrEmpty(page)) ? 1 : Convert.ToInt32(page);
            string item = Request.Query["item"].ToString();
            int itemInt = (string.IsNullOrEmpty(item)) ? 12 : Convert.ToInt32(item);
            var query4 = query3.Skip((pageInt - 1) * itemInt).Take(itemInt).ToList();


            return Json(new DatanNum() { Products = query4, TotalCount = query2.Count() });
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
        public int TotalCount { get; set; }
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

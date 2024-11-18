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

        [ActionName("所有商品")]
        public async Task<IActionResult> All()
        {
            //拋出產品集合、產地、風味、烘焙程度、處理法的所有值的模型
            var products = await _context.Products
                .OrderBy(p => p.Id)
                .Take(12)
                .ToListAsync();
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
                Products = products,
                TotalCount = totalcount,
                Country = country,
                Flavor = flavor,
                Baking = baking!,
                Method = method!
            };
            return View("All", docLoad);
        }
        [HttpGet]
        public async Task<IActionResult> Query(string column, string? category, QueryParams queryParams)
        {
            var query = from p in _context.Products
                        select p;
            if (column == "產地")
            {
                query = from p in _context.Products
                        where p.Country!.Contains(category!)
                        select p;

                return Json(new DatanNum() { Products = await SuitQuery(query, queryParams), TotalCount = query.Count() });
            }
            else if (column == "風味")
            {
                query = from p in _context.Products
                        where p.Flavor!.Contains(category!)
                        select p;
                return Json(new DatanNum() { Products = await SuitQuery(query, queryParams), TotalCount = query.Count() });
            }
            else if (column == "濾掛系列")
            {
                query = from p in _context.Products
                        where p.Category == "濾掛咖啡"
                        select p;
                return Json(new DatanNum() { Products = await SuitQuery(query, queryParams), TotalCount = query.Count() });
            }

            return Json(new DatanNum() { Products = await SuitQuery(query, queryParams), TotalCount = query.Count() });
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
        private async Task<List<Product>> SuitQuery(IQueryable<Product> products, QueryParams queryParams)
        {
            var suitQuery = products
                .OrderBy(p => p.Id) //兩個if(是否價格排序)(倒敘或正敘)
                .Skip((queryParams.page - 1) * queryParams.item)
                .Take(queryParams.item);
            return await suitQuery.ToListAsync();
        }
    }
    public class DocLoad
    {
        public List<Product>? Products { get; set; }
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
    public class QueryParams
    {
        public string? sort { get; set; }
        public int item { get; set; } = 12;
        public int page { get; set; } = 1;
        public string? price
        {
            get => price;
            set
            {
                price = value;
                min = int.Parse(price?.Split('#')[0] ?? "0");
                max = int.Parse(price?.Split('#')[1] ?? "0");
            }
        }

        public int min { get; private set; }
        public int max { get; private set; }
        public string? baking { get; set; }
        public string? method { get; set; }
        public string? fragrance { get; set; }
        public string? sour { get; set; }
        public string? bitter { get; set; }
        public string? sweet { get; set; }
        public string? strong { get; set; }
    }
}

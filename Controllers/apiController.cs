using Microsoft.AspNetCore.Mvc;
using BigPorject.Models;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;
using LinqKit.Core;
using LinqKit;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using System;

namespace BigPorject.Controllers
{
    public class ApiController : Controller
    {
        private ProjectContext _context;

        public ApiController(ProjectContext dbContext)
        {
            _context = dbContext;
        }
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
            var predicateOr1 = PredicateBuilder.New<Product>(true); // OR
            var predicateOr2 = PredicateBuilder.New<Product>(true); // OR

            var price = Request.Query["price"].ToString();
            if (!string.IsNullOrEmpty(price))
            {
                var min = Convert.ToInt32(price.Split('#')[0]);
                var max = Convert.ToInt32(price.Split('#')[1]);
                predicateAnd = predicateAnd.And(p => p.Price >= min);
                predicateAnd = predicateAnd.And(p => p.Price <= max);
            }
            var baking = Request.Query["baking"].ToString();
            if (!string.IsNullOrEmpty(baking))
            {
                string[] bakingArr = baking.Split('#');
                foreach (string b in bakingArr)
                {
                    predicateOr1 = predicateOr1.Or(p => p.Baking == b);
                }
                predicateAnd = predicateAnd.And(predicateOr1);
            }
            var method = Request.Query["method"].ToString();
            if (!string.IsNullOrEmpty(method))
            {
                string[] methodArr = method.Split('#');
                foreach (string m in methodArr)
                {
                    predicateOr2 = predicateOr2.Or(p => p.Method == m);
                }
                predicateAnd = predicateAnd.And(predicateOr2);
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
        private class DatanNum
        {
            public List<Product>? Products { get; set; }
            public int TotalCount { get; set; }
        }
    }
}

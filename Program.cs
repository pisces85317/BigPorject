using Microsoft.EntityFrameworkCore;
using BigPorject.Models;
using Microsoft.Data.SqlClient;
using Microsoft.AspNetCore.Mvc;
var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews();

var connectionString = builder.Configuration.GetConnectionString("ProjectDb");
builder.Services.AddDbContext<ProjectContext>(x => x.UseSqlServer(connectionString));

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
}
app.UseStaticFiles();

app.UseRouting();

app.UseAuthorization();


//New
app.MapControllerRoute(
    name: "Query",
    pattern: "Product/Query/{column}/{category?}",
    defaults: new { controller = "Product", action = "Query" });

app.MapControllerRoute(
    name: "GetModal",
    pattern: "Product/ShowProductModal",
    defaults: new { controller = "Product", action = "ShowProductModal" });

app.MapControllerRoute(
    name: "GetCartItem",
    pattern: "Product/AddCartItemToLayout",
    defaults: new { controller = "Product", action = "AddCartItemToLayout" });

app.MapControllerRoute(
    name: "Product",
    pattern: "Product/{column?}/{category?}",
    defaults: new { controller = "Product", action = "All" });
//

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");
app.Run();

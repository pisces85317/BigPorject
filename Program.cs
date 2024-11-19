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

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

//New
app.MapControllerRoute(
    name: "Product",
    pattern: "{controller=Product}/{column?}/{category?}",
    defaults: new { controller = "Product", action = "All" });
app.MapControllerRoute(
    name: "Api",
    pattern: "{controller=Api}/{action=Query}/{column}/{category?}");

app.Run();

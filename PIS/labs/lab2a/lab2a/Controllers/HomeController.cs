using Microsoft.AspNetCore.Mvc;

namespace lab2a.Controllers
{
    public class HomeController : Controller
    {
        [HttpGet("/Index.html")]
        public IActionResult Index()
        {
            string viewPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "Index.html");

            if (System.IO.File.Exists(viewPath))
            {
                return new PhysicalFileResult(viewPath, "text/html");
            }
            else
            {
                return NotFound();
            }
        }
    }
}

using Microsoft.AspNetCore.Mvc;

namespace lab2.Controllers
{
    public class HomeController : Controller
    {
        [HttpGet("/Index.html")]
        public IActionResult Index()
        {
            return View();
        }
    }
}

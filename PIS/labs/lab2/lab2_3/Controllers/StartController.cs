using Microsoft.AspNetCore.Mvc;

namespace lab2_3.Controllers
{
    public class StartController : Controller
    {
        [HttpGet("/")]
        [HttpPost("/")]
        
        public IActionResult Index()
        {
            return View();
        }
        public IActionResult One()
        {
            return View();
        }
        public IActionResult Two()
        {
            return View();
        }
        public IActionResult Three()
        {
            return View();
        }
    }
}

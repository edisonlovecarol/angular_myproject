using System.Web.Mvc;
using Abp.Web.Mvc.Authorization;

namespace Wu.MyProject.Web.Controllers
{
    [AbpMvcAuthorize]
    public class HomeController : MyProjectControllerBase
    {
        public ActionResult Index()
        {
            return View("~/App/Main/views/layout/layout.cshtml"); //Layout of the angular application.
        }
	}
}
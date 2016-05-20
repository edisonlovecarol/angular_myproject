using System.Reflection;
using System.Web;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;
using Abp.IO;
using Abp.Modules;
using Abp.Web.Mvc;
using Abp.Zero.Configuration;
using Wu.MyProject.Api;
using Wu.MyProject.Web.App.Startup;

namespace Wu.MyProject.Web
{
    [DependsOn(
        typeof(MyProjectDataModule), 
        typeof(MyProjectApplicationModule), 
        typeof(MyProjectWebApiModule),
        typeof(AbpWebMvcModule))]
    public class MyProjectWebModule : AbpModule
    {
        public override void PreInitialize()
        {
            //Enable database based localization
            Configuration.Modules.Zero().LanguageManagement.EnableDbLocalization();

            //Configure navigation/menu
            Configuration.Navigation.Providers.Add<MyProjectNavigationProvider>();
        }

        public override void Initialize()
        {
            IocManager.RegisterAssemblyByConvention(Assembly.GetExecutingAssembly());

            AreaRegistration.RegisterAllAreas();
            //路由
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            //
            //BundleConfig.RegisterBundles(BundleTable.Bundles);

            //Bundling
            AppBundleConfig.RegisterBundles(BundleTable.Bundles);

        }

        public override void PostInitialize()
        {
            var server = HttpContext.Current.Server;
            var appFolders = IocManager.Resolve<AppFolders>();
            appFolders.SampleProfileImagesFolder = server.MapPath("~/Common/Images/SampleProfilePics");
            appFolders.TempFileDownloadFolder = server.MapPath("~/Temp/Downloads");
            try { DirectoryHelper.CreateIfNotExists(appFolders.TempFileDownloadFolder); }
            catch { }
        }
    }
}

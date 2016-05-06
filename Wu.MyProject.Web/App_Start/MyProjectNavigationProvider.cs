using Abp.Application.Navigation;
using Abp.Localization;
using Wu.MyProject.Authorization;

namespace Wu.MyProject.Web
{
    /// <summary>
    /// This class defines menus for the application.
    /// It uses ABP's menu system.
    /// When you add menu items here, they are automatically appear in angular application.
    /// See .cshtml and .js files under App/Main/views/layout/header to know how to render menu.
    /// </summary>
    public class MyProjectNavigationProvider : NavigationProvider
    {
        public override void SetNavigation(INavigationProviderContext context)
        {
            context.Manager.MainMenu
                .AddItem(
                    new MenuItemDefinition(
                        "Home",
                        new LocalizableString("HomePage", MyProjectConsts.LocalizationSourceName),
                        url: "HomePage",
                        icon: "fa fa-home"
                        )
                ).AddItem(
                    new MenuItemDefinition(
                        "Tenants",
                        L("Tenants"),
                        url: "#tenants",
                        icon: "fa fa-globe",
                        requiredPermissionName: PermissionNames.Pages_Tenants
                       
                        )
                )
                //这里插入数据
                .AddItem(
                    new MenuItemDefinition(
                        "Administration",
                         L("Administration"),
                         icon: "icon-wrench"
                        )
                        .AddItem(new MenuItemDefinition(
                        "Administration.Users",
                        L("Users"),
                        url: "users",
                        icon: "icon-users"
                //requiredPermissionName: AppPermissions.Pages_Administration_Users
                            )
                )
                )
                .AddItem(
                    new MenuItemDefinition(
                        "About",
                        L("About"),
                        url: "About",
                        icon: "fa fa-info"
                        )
                );
                
             
        }

        private static ILocalizableString L(string name)
        {
            return new LocalizableString(name, MyProjectConsts.LocalizationSourceName);
        }
    }
}

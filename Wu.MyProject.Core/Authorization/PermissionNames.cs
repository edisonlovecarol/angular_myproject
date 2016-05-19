namespace Wu.MyProject.Authorization
{
    public static class PermissionNames
    {
       
        public const string Pages_Administration = "Pages.Administration";
        //用户权限
        public const string Pages_Administration_Users = "Pages.Administration.Users";
        public const string Pages_Administration_Users_Create = "Pages.Administration.Users.Create";
        public const string Pages_Administration_Users_Edit = "Pages.Administration.Users.Edit";
        public const string Pages_Administration_Users_Delete = "Pages.Administration.Users.Delete";
        public const string Pages_Administration_Users_ChangePermissions = "Pages.Administration.Users.ChangePermissions";
        public const string Pages_Administration_Users_Impersonation = "Pages.Administration.Users.Impersonation";
        //角色管理
        public const string Pages_Administration_Roles = "Pages.Administration.Roles";
        public const string Pages_Administration_Roles_Create = "Pages.Administration.Roles.Create";
        public const string Pages_Administration_Roles_Edit = "Pages.Administration.Roles.Edit";
        public const string Pages_Administration_Roles_Delete = "Pages.Administration.Roles.Delete";
        public const string Pages_Administration_Roles_ChangePermissions = "Pages.Administration.Roles.ChangePermissions";
        

        public const string Pages = "Pages";

        public const string Pages_Tenants = "Pages.Tenants";
    }
}
using Abp.Authorization;
using Wu.MyProject.Authorization.Roles;
using Wu.MyProject.MultiTenancy;
using Wu.MyProject.Users;

namespace Wu.MyProject.Authorization
{
    public class PermissionChecker : PermissionChecker<Tenant, Role, User>
    {
        public PermissionChecker(UserManager userManager)
            : base(userManager)
        {

        }
    }
}

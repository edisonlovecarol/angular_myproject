using Abp.Authorization.Roles;
using Wu.MyProject.MultiTenancy;
using Wu.MyProject.Users;

namespace Wu.MyProject.Authorization.Roles
{
    public class Role : AbpRole<Tenant, User>
    {

    }
}
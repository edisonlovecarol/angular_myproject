using Abp.Authorization.Roles;
using Wu.MyProject.MultiTenancy;
using Wu.MyProject.Users;

namespace Wu.MyProject.Authorization.Roles
{
    public class Role : AbpRole<Tenant, User>
    {
        public Role()
        {

        }

        public Role(int? tenantId, string displayName)
            : base(tenantId, displayName)
        {

        }

        public Role(int? tenantId, string name, string displayName)
            : base(tenantId, name, displayName)
        {

        }
    }
}
using Abp.Application.Features;
using Wu.MyProject.Authorization.Roles;
using Wu.MyProject.MultiTenancy;
using Wu.MyProject.Users;

namespace Wu.MyProject.Features
{
    public class FeatureValueStore : AbpFeatureValueStore<Tenant, Role, User>
    {
        public FeatureValueStore(TenantManager tenantManager)
            : base(tenantManager)
        {
        }
    }
}
using Wu.MyProject.EntityFramework;
using EntityFramework.DynamicFilters;

namespace Wu.MyProject.Migrations.SeedData
{
    public class InitialDataBuilder
    {
        private readonly MyProjectDbContext _context;

        public InitialDataBuilder(MyProjectDbContext context)
        {
            _context = context;
        }

        public void Build()
        {
            _context.DisableAllFilters();

            new DefaultEditionsBuilder(_context).Build();
            new DefaultTenantRoleAndUserBuilder(_context).Build();
            new DefaultLanguagesBuilder(_context).Build();
        }
    }
}

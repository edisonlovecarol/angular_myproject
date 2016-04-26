using System.Data.Entity.Migrations;
using Wu.MyProject.Migrations.SeedData;

namespace Wu.MyProject.Migrations
{
    internal sealed class Configuration : DbMigrationsConfiguration<MyProject.EntityFramework.MyProjectDbContext>
    {
        public Configuration()
        {
            AutomaticMigrationsEnabled = false;
            ContextKey = "MyProject";
        }

        protected override void Seed(MyProject.EntityFramework.MyProjectDbContext context)
        {
            new InitialDataBuilder(context).Build();
        }
    }
}

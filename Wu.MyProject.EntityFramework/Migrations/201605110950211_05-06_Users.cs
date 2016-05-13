namespace Wu.MyProject.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class _0506_Users : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.AbpUsers", "ShouldChangePasswordOnNextLogin", c => c.Boolean(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("dbo.AbpUsers", "ShouldChangePasswordOnNextLogin");
        }
    }
}

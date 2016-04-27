namespace Wu.MyProject.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class adddd : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("dbo.StsTasks", "AssignedPersonId", "dbo.StsPeople");
            DropIndex("dbo.StsTasks", new[] { "AssignedPersonId" });
            DropTable("dbo.StsPeople");
            DropTable("dbo.StsTasks");
        }
        
        public override void Down()
        {
            CreateTable(
                "dbo.StsTasks",
                c => new
                    {
                        Id = c.Long(nullable: false, identity: true),
                        AssignedPersonId = c.Int(),
                        Description = c.String(),
                        CreationTime = c.DateTime(nullable: false),
                        State = c.Byte(nullable: false),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.StsPeople",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Name = c.String(),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateIndex("dbo.StsTasks", "AssignedPersonId");
            AddForeignKey("dbo.StsTasks", "AssignedPersonId", "dbo.StsPeople", "Id");
        }
    }
}

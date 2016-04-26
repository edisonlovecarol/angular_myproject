using System.Linq;
using Abp.Application.Editions;
using Wu.MyProject.Editions;
using Wu.MyProject.EntityFramework;

namespace Wu.MyProject.Migrations.SeedData
{
    public class DefaultEditionsBuilder
    {
        private readonly MyProjectDbContext _context;

        public DefaultEditionsBuilder(MyProjectDbContext context)
        {
            _context = context;
        }

        public void Build()
        {
            CreateEditions();
        }

        private void CreateEditions()
        {
            var defaultEdition = _context.Editions.FirstOrDefault(e => e.Name == EditionManager.DefaultEditionName);
            if (defaultEdition == null)
            {
                defaultEdition = new Edition { Name = EditionManager.DefaultEditionName, DisplayName = EditionManager.DefaultEditionName };
                _context.Editions.Add(defaultEdition);
                _context.SaveChanges();

                //TODO: Add desired features to the standard edition, if wanted!
            }   
        }
    }
}
using System.ComponentModel;
using System.Linq;
using Wu.MyProject.Utility.Query;

namespace Wu.MyProject.Utility.Extensions
{
    public static class CollectionExtensions
    {
        public static IQueryable<TEntity> Where<TEntity>(this IQueryable<TEntity> source,
            int pageIndex,
            int pageSize,
            out int total,
            SortCondition[] sortConditions = null)
        {
            //进行参数检查
            total = source.Count();
            if (sortConditions==null||sortConditions.Length==0)
            {
                source = source.OrderBy("Id");

            }
            else
            {
                int count = 0;
                IOrderedQueryable<TEntity> orderSource = null;
                foreach (var sortCondition in sortConditions)
                {
                    
                    orderSource = count == 0
                      ? CollectionPropertySorter<TEntity>.OrderBy(source, sortCondition.SortField, sortCondition.ListSortDirection)
                      : CollectionPropertySorter<TEntity>.ThenBy(orderSource, sortCondition.SortField, sortCondition.ListSortDirection);
                    count++;

                }
                source = orderSource;
            }
            return source != null
               ? source.Skip((pageIndex - 1) * pageSize).Take(pageSize)
               : Enumerable.Empty<TEntity>().AsQueryable();

        }

        public static IOrderedQueryable<T> OrderBy<T>(this IQueryable<T> source, string propertyName,
            ListSortDirection sortDirection = ListSortDirection.Ascending)
        {
            //参数检查
            return CollectionPropertySorter<T>.OrderBy(source, propertyName, sortDirection);
        }

    }
}

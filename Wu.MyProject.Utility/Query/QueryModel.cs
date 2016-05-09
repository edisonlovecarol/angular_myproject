using System;
using System.Collections.Generic;
using System.ComponentModel;
using Wu.MyProject.Utility.Extensions;

namespace Wu.MyProject.Utility.Query
{
    public class QueryModel
    {
        /// <summary>
        /// 获取 查询条件组
        /// </summary>
        public FilterGroup FilterGroup { get; private set; }

        public QueryModel(FilterGroup filter)
        {
            this.FilterGroup = filter;
            string sortFields = null;
            string sortOrders = null;
            if (filter.Pages.SortString!=null)
            {
               sortFields= filter.Pages.SortString.SortFields;
               sortOrders=filter.Pages.SortString.SortOrders;
            }
             
            PageIndex = filter.Pages.PageIndex;
            PageSize = filter.Pages.PageSize;
            PageCondition = new PageCondition(filter.Pages.PageIndex.CastTo<int>(),filter.Pages.PageSize);
            if (!string.IsNullOrEmpty(sortOrders)&&!string.IsNullOrEmpty(sortFields))
            {
                string[] fields = sortFields.Split(',');
                string[] orders = sortOrders.Split(',');
                if (fields.Length!=orders.Length)
                {
                    throw new ArgumentException("查询列表的排序参数个数不一致。");
                }
                
                List<SortCondition> sortConditions=new List<SortCondition>();
                for (int i = 0; i < fields.Length; i++)
                {
                    ListSortDirection direction = orders[i].ToLower() == "desc"
                        ? ListSortDirection.Descending
                        : ListSortDirection.Ascending;
                    sortConditions.Add(new SortCondition(fields[i],direction));
                }
                PageCondition.SortConditions = sortConditions.ToArray();

            }
            else
            {
                PageCondition.SortConditions = new SortCondition[]{};
            }


        }



        /// <summary>
        /// 获取 分页查询条件信息
        /// </summary>
        public PageCondition PageCondition { get; private set; }

        public int PageIndex { get; set; }

        public int PageSize { get; set; }

    }
}

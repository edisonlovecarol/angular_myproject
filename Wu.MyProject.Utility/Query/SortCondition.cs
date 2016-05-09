using System;
using System.ComponentModel;
using System.Linq;
using System.Linq.Expressions;

namespace Wu.MyProject.Utility.Query
{
    /// <summary>
    /// 列表字段排序条件
    /// </summary>
    public class SortCondition
    {
        /// 获取或设置 排序字段名称
        public string SortField { get; set; }
        /// <summary>
        /// 获取或设置排序方向
        /// </summary>
        public ListSortDirection ListSortDirection { get; set; }

        /// <summary>
        /// 构造一个指定字段名称
        /// </summary>
        /// <param name="sortField"></param>
        public SortCondition(string sortField)
            : this(sortField, ListSortDirection.Ascending)
        {

        }
        public SortCondition(string sortField, ListSortDirection listSortDirection)
        {
            SortField = sortField;
            ListSortDirection = listSortDirection;
        }
    }

    public class SortCondition<T> : SortCondition
    {
        public SortCondition(Expression<Func<T, object>> keySelector)
            : this(keySelector, ListSortDirection.Ascending)
        {

        }
        public SortCondition(Expression<Func<T, object>> keySelector, ListSortDirection listSortDirection)
            : base(GetPropertyName(keySelector), listSortDirection)
        { }


        /// <summary>
        /// 从泛型委托获取属性名
        /// </summary>
        /// <param name="keySelector"></param>
        /// <returns></returns>
        private static string GetPropertyName(Expression<Func<T, object>> keySelector)
        {
            string param = keySelector.Parameters.First().Name;
            string operand = (((dynamic)keySelector.Body).Operand).ToString();
            operand = operand.Substring(param.Length + 1, operand.Length - param.Length - 1);
            return operand;

        }
    }
}

using Abp.Dependency;
using Abp.Events.Bus.Exceptions;
using Abp.Events.Bus.Handlers;

namespace Wu.MyProject.Web.Exception
{
    public class MyExceptionHandler : IEventHandler<AbpHandledExceptionData>, ITransientDependency
    {
        public static System.Exception LastException { get; private set; }
        public void HandleEvent(AbpHandledExceptionData eventData)
        {
            LastException = eventData.Exception;
        }
    }
}
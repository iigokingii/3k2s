var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

app.UseStaticFiles();

app.MapGet("/", () => "Hello World!");

app.Run();
//1 Статика
//Referer Заголовок запроса Referer содержит URL исходной страницы, с которой был осуществлён переход на текущую страницу. 
//1,22 1.22 от чего зависит культура

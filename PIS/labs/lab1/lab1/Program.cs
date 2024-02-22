using Newtonsoft.Json;
using System.Text;

var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

//http://localhost:5170/1.sva?ParmA=asdasd&ParmB=asdasd
//{
//    "ParmA":"zxczxczxc",
//    "ParmB":"asda"
//}

string CreateResponse(string requestedMethod,string parmA, string parmB){
    string responseString = "";
    if (parmA != null && parmB != null)
    {
        return requestedMethod + "-HTTP-SVA:ParmA = " + parmA + " ParmB = " + parmB;
    }
    else if (parmA != null)
    {
        return requestedMethod + "-HTTP-SVA:ParmA = " + parmA + " ParmB = не задан";
    }
    else
    {
        return requestedMethod + "-HTTP-SVA:ParmA = не задан" + " ParmB = не задан";
    }
}

app.MapGet("{id}.sva", (string? ParmA, string? ParmB) => CreateResponse("GET", ParmA, ParmB));

/*app.MapPost("{id}.sva", async (HttpContext context) =>
{
    string? ParmA = null;
    string? ParmB = null;
    var body = await new StreamReader(context.Request.Body).ReadToEndAsync();

    if (!string.IsNullOrEmpty(body))
    {
        var data = JsonConvert.DeserializeObject<dynamic>(body);
        ParmA = data.X;
        ParmB = data.Y;
    }

    var response = CreateResponse("POST", ParmA, ParmB);
    context.Response.ContentType = "text/plain";
    await context.Response.WriteAsync(JsonConvert.SerializeObject(response));
});
*/
app.MapPost("{id}.sva", (string? ParmA, string? ParmB) => CreateResponse("POST", ParmA, ParmB));


/*app.MapPut("{id}.sva", async (HttpContext context) =>
{
    string? ParmA = null;
    string? ParmB = null;

    var body = await new StreamReader(context.Request.Body).ReadToEndAsync();
    if (!string.IsNullOrEmpty(body))
    {
        var data = JsonConvert.DeserializeObject<dynamic>(body);
        ParmA = data.X;
        ParmB = data.Y;
    }

    var response = CreateResponse("PUT", ParmA, ParmB);

    context.Response.ContentType = "text/plain";
    await context.Response.WriteAsync(JsonConvert.SerializeObject(response));
});*/

app.MapPut("{id}.sva", (string? ParmA, string? ParmB) => CreateResponse("PUT", ParmA, ParmB));


app.MapPost("SUMMARY", async (HttpContext context) =>
{
    string? ParmX = null;
    string? ParmY = null;
    var body = await new StreamReader(context.Request.Body).ReadToEndAsync();

    if (!string.IsNullOrEmpty(body))
    {
        var data = JsonConvert.DeserializeObject<dynamic>(body);
        ParmX = data.X;
        ParmY = data.Y;
    }
    if (ParmX is null) await context.Response.WriteAsync(JsonConvert.SerializeObject("значение x не передано"));
    if (ParmY is null) await context.Response.WriteAsync(JsonConvert.SerializeObject("значение y не передано")); ;
    if (!int.TryParse(ParmX, out var xValue)) await context.Response.WriteAsync(JsonConvert.SerializeObject("значение x не является числом"));
    if (!int.TryParse(ParmY, out var yValue)) await context.Response.WriteAsync(JsonConvert.SerializeObject("значение y не является числом"));

    await context.Response.WriteAsync(JsonConvert.SerializeObject((xValue + yValue).ToString()));
});

app.MapGet("/", async (HttpContext context) =>
{
    context.Response.ContentType = "text/html; charset=utf-8";
    await context.Response.SendFileAsync("html/index.html");
});
app.MapPost("/", async (HttpContext context) =>
{
    if (context.Request.HasFormContentType)
    {
        int x, y;
        if (Int32.TryParse(context.Request.Form["x"], out x) && Int32.TryParse(context.Request.Form["y"], out y))
        {
            int result = x * y;
            await context.Response.WriteAsync(result.ToString());
        }
        else
        {
            await context.Response.WriteAsync("Ошибка: Некорректные параметры x и y");
        }
    }
    else
    {
        await context.Response.WriteAsync("Ошибка: Некорректный тип содержимого запроса");
    }
});

app.MapGet("/multiply", async (HttpContext context) =>
{
    if (context.Request.Method == "GET")
    {
        context.Response.ContentType = "text/html; charset=utf-8";
        await context.Response.SendFileAsync("html/task6.html");
    }
});

app.MapPost("/multiply", async (HttpContext context) =>
{
    if (context.Request.HasFormContentType)
    {
        var form = context.Request.Form;
        string parmX = form["x"];
        string parmY = form["y"];

        if (parmX is null)
        {
          
            string htmlResult1 = $"<!DOCTYPE html><html><head><title>Результат</title></head><body><h1>Результат:</h1><p>Значение x не передано</p></body></html>";
            context.Response.ContentType = "text/html; charset=utf-8";
            await context.Response.WriteAsync(htmlResult1, Encoding.UTF8);
        }
        if (parmY is null)
        {
           
            string htmlResult1 = $"<!DOCTYPE html><html><head><title>Результат</title></head><body><h1>Результат:</h1><p>Значение y не передано</p></body></html>";
            context.Response.ContentType = "text/html; charset=utf-8";
            await context.Response.WriteAsync(htmlResult1, Encoding.UTF8);
        }
        if (!int.TryParse(parmX, out var xValue))
        {
            
            string htmlResult1 = $"<!DOCTYPE html><html><head><title>Результат</title></head><body><h1>Результат:</h1><p>Значение x не является числом</p></body></html>";
            context.Response.ContentType = "text/html; charset=utf-8";
            await context.Response.WriteAsync(htmlResult1, Encoding.UTF8);
        }
        if (!int.TryParse(parmY, out var yValue))
        {
            
            string htmlResult1 = $"<!DOCTYPE html><html><head><title>Результат</title></head><body><h1>Результат:</h1><p>Значение y не является числом</p></body></html>";
            context.Response.ContentType = "text/html; charset=utf-8";
            await context.Response.WriteAsync(htmlResult1, Encoding.UTF8);
        }

        var result = xValue * yValue;

        string htmlResult = $"<!DOCTYPE html><html><head><title>Результат</title></head><body><h1>Результат:</h1><p>{xValue} * {yValue} = {result}</p></body></html>";
        context.Response.ContentType = "text/html; charset=utf-8";
        await context.Response.WriteAsync(htmlResult, Encoding.UTF8);
    }
});



/*app.Run(async (context) =>
{
    if (context.Request.Path == "/index" ||context.Request.Path=="/")
    {
        if(context.Request.Method == "GET")
        {
            context.Response.ContentType = "text/html; charset=utf-8";
            await context.Response.SendFileAsync("html/index.html");
        }
        if (context.Request.Method == "POST")
        {
            if (context.Request.HasFormContentType)
            {
                int x, y;
                if (Int32.TryParse(context.Request.Form["x"], out x) && Int32.TryParse(context.Request.Form["y"], out y))
                {
                    int result = x * y;
                    await context.Response.WriteAsync(result.ToString());
                }
                else
                {
                    await context.Response.WriteAsync("Ошибка: Некорректные параметры x и y");
                }
            }
            else
            {
                await context.Response.WriteAsync("Ошибка: Некорректный тип содержимого запроса");
            }
        }
    }
    if(context.Request.Path == "/multiply")
    {
        if (context.Request.Method == "GET")
        {
            context.Response.ContentType = "text/html; charset=utf-8";
            await context.Response.SendFileAsync("html/task6.html");
        }
        else if (context.Request.Method == "POST")
        {
            // Обработка POST-запроса на пути "/multiply" - вычисляем произведение x и y
            if (context.Request.HasFormContentType)
            {
                var form = context.Request.Form;
                string parmX = form["x"];
                string parmY = form["y"];

                if (parmX is null)
                {
                    *//*await context.Response.WriteAsync(JsonConvert.SerializeObject("Значение x не передано"));
                    return;*//*
                    string htmlResult1 = $"<!DOCTYPE html><html><head><title>Результат</title></head><body><h1>Результат:</h1><p>Значение x не передано</p></body></html>";
                    context.Response.ContentType = "text/html; charset=utf-8";
                    await context.Response.WriteAsync(htmlResult1, Encoding.UTF8);
                }
                if (parmY is null)
                {
                    *//*await context.Response.WriteAsync(JsonConvert.SerializeObject("Значение y не передано"));
                    return;*//*
                    string htmlResult1 = $"<!DOCTYPE html><html><head><title>Результат</title></head><body><h1>Результат:</h1><p>Значение y не передано</p></body></html>";
                    context.Response.ContentType = "text/html; charset=utf-8";
                    await context.Response.WriteAsync(htmlResult1, Encoding.UTF8);
                }
                if (!int.TryParse(parmX, out var xValue))
                {
                    *//*await context.Response.WriteAsync(JsonConvert.SerializeObject("Значение x не является числом"));
                    return;*//*
                    string htmlResult1 = $"<!DOCTYPE html><html><head><title>Результат</title></head><body><h1>Результат:</h1><p>Значение x не является числом</p></body></html>";
                    context.Response.ContentType = "text/html; charset=utf-8";
                    await context.Response.WriteAsync(htmlResult1, Encoding.UTF8);
                }
                if (!int.TryParse(parmY, out var yValue))
                {
                    *//*await context.Response.WriteAsync(JsonConvert.SerializeObject("Значение y не является числом"));
                    return;*//*
                    string htmlResult1 = $"<!DOCTYPE html><html><head><title>Результат</title></head><body><h1>Результат:</h1><p>Значение y не является числом</p></body></html>";
                    context.Response.ContentType = "text/html; charset=utf-8";
                    await context.Response.WriteAsync(htmlResult1, Encoding.UTF8);
                }

                var result = xValue * yValue;

                string htmlResult = $"<!DOCTYPE html><html><head><title>Результат</title></head><body><h1>Результат:</h1><p>{xValue} * {yValue} = {result}</p></body></html>";
                context.Response.ContentType = "text/html; charset=utf-8";
                await context.Response.WriteAsync(htmlResult, Encoding.UTF8);
            }
        }
    }
});*/

app.Run();
var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

app.UseStaticFiles();

app.MapGet("/", () => "Hello World!");

app.Run();
//1 �������
//Referer ��������� ������� Referer �������� URL �������� ��������, � ������� ��� ���������� ������� �� ������� ��������. 
//1,22 1.22 �� ���� ������� ��������

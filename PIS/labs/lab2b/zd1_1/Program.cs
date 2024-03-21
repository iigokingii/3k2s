var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthorization();

//Action1

app.MapControllerRoute(
    name: "mresearch_m01_with_id",
    pattern: "MResearch/M01/{id:int}",
    defaults: new { controller = "TMResearch", action = "M01" }
);

app.MapControllerRoute(
    name: "mresearch_m01_without_id",
    pattern: "MResearch/M01",
    defaults: new { controller = "TMResearch", action = "M01" }
);

app.MapControllerRoute(
    name: "mresearch",
    pattern: "MResearch",
    defaults: new { controller = "TMResearch", action = "M01" }
);

app.MapControllerRoute(
    name: "root",
    pattern: "/",
    defaults: new { controller = "TMResearch", action = "M01" }
);

app.MapControllerRoute(
    name: "v2_mresearch_m01",
    pattern: "V2/MResearch/M01",
    defaults: new { controller = "TMResearch", action = "M01" }
);

app.MapControllerRoute(
    name: "v3_mresearch_m01",
    pattern: "V3/MResearch/{stringValue}/M01",
    defaults: new { controller = "TMResearch", action = "M01", stringValue = "" }
);


//Action2

app.MapControllerRoute(
    name: "v2",
    pattern: "V2",
    defaults: new { controller = "TMResearch", action = "M02" }
);

app.MapControllerRoute(
    name: "v2_mresearch",
    pattern: "V2/MResearch",
    defaults: new { controller = "TMResearch", action = "M02" }
);


app.MapControllerRoute(
    name: "v2_mresearch_m02",
    pattern: "V2/MResearch/M02",
    defaults: new { controller = "TMResearch", action = "M02" }
);

app.MapControllerRoute(
    name: "mresearch_m02",
    pattern: "MResearch/M02",
    defaults: new { controller = "TMResearch", action = "M02" }
);

app.MapControllerRoute(
    name: "v3_mresearch_m02",
    pattern: "V3/MResearch/{string}/M02",
    defaults: new { controller = "TMResearch", action = "M02", str = "" }
);

//Action 3

app.MapControllerRoute(
    name: "v3",
    pattern: "V3",
    defaults: new { controller = "TMResearch", action = "M03"}
);
app.MapControllerRoute(
    name: "v3_mresearch",
    pattern: "V3/MResearch/{string}",
    defaults: new { controller = "TMResearch", action = "M03", str = "" }
);
app.MapControllerRoute(
    name: "v3_mresearch_m03",
    pattern: "V3/MResearch/{string}/M03",
    defaults: new { controller = "TMResearch", action = "M03", str = "" }
);

//Action 4

app.MapControllerRoute(
    name: "default",
    pattern: "{*uri}",
    defaults: new { controller = "TMResearch", action = "MXX" }
);

app.Run();
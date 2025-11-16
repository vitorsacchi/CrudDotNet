using CrudProdutos.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// 🔹 Configurações ANTES do Build()
builder.WebHost.ConfigureKestrel(options =>
{
    options.ListenAnyIP(8080); // Porta interna do container
});

// Banco SQLite
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite("Data Source=produtos.db"));

// Controllers / Swagger
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// 🔹 Pipeline

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Serve index.html automaticamente e outros arquivos estáticos
app.UseDefaultFiles();   // index.html como padrão
app.UseStaticFiles();    // css, js e outros arquivos estáticos

// Não precisa redirecionar HTTPS no Docker
// app.UseHttpsRedirection();

app.MapControllers();

// Migrar banco
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();
}

app.Run();

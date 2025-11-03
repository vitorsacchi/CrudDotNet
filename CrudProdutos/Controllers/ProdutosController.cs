using CrudProdutos.Data;
using CrudProdutos.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CrudProdutos.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProdutosController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ProdutosController(AppDbContext context)
        {
            _context = context;
        }

        // GET pega todos
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Produto>>> Get()
        {
            return await _context.Produtos.ToListAsync();
        }

        // GET  pega ID
        [HttpGet("{id}")]
        public async Task<ActionResult<Produto>> Get(int id)
        {
            var produto = await _context.Produtos.FindAsync(id);
            if (produto == null) return NotFound();
            return produto;
        }

        // POST cria ID produto
        [HttpPost]
        public async Task<ActionResult<Produto>> Post(Produto produto)
        {
            _context.Produtos.Add(produto);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(Get), new { id = produto.Id }, produto);
        }

        // PUT retorna ID
        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, Produto produto)
        {
            if (id != produto.Id) return BadRequest();

            _context.Entry(produto).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var produto = await _context.Produtos.FindAsync(id);
            if (produto == null) return NotFound();

            _context.Produtos.Remove(produto);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
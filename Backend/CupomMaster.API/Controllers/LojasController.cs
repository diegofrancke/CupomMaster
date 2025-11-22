using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using CupomMaster.API.DTOs;
using CupomMaster.API.Services;

namespace CupomMaster.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LojasController : ControllerBase
    {
        private readonly ILojaService _lojaService;

        public LojasController(ILojaService lojaService)
        {
            _lojaService = lojaService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var lojas = await _lojaService.GetAllAsync();
            return Ok(lojas);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var loja = await _lojaService.GetByIdAsync(id);
            
            if (loja == null)
            {
                return NotFound(new { message = "Loja não encontrada" });
            }

            return Ok(loja);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateLojaRequest request)
        {
            try
            {
                var loja = await _lojaService.CreateAsync(request);
                return CreatedAtAction(nameof(GetById), new { id = loja.Id }, loja);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Erro ao criar loja", error = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateLojaRequest request)
        {
            try
            {
                var loja = await _lojaService.UpdateAsync(id, request);
                
                if (loja == null)
                {
                    return NotFound(new { message = "Loja não encontrada" });
                }

                return Ok(loja);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Erro ao atualizar loja", error = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _lojaService.DeleteAsync(id);
            
            if (!result)
            {
                return NotFound(new { message = "Loja não encontrada" });
            }

            return NoContent();
        }
    }
}

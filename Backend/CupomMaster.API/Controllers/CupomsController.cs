using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using CupomMaster.API.DTOs;
using CupomMaster.API.Services;

namespace CupomMaster.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CupomsController : ControllerBase
    {
        private readonly ICupomService _cupomService;

        public CupomsController(ICupomService cupomService)
        {
            _cupomService = cupomService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var cupons = await _cupomService.GetAllAsync();
            return Ok(cupons);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var cupom = await _cupomService.GetByIdAsync(id);
            
            if (cupom == null)
            {
                return NotFound(new { message = "Cupom não encontrado" });
            }

            return Ok(cupom);
        }

        [HttpGet("codigo/{codigo}")]
        public async Task<IActionResult> GetByCodigo(string codigo)
        {
            var cupom = await _cupomService.GetByCodigoAsync(codigo);
            
            if (cupom == null)
            {
                return NotFound(new { message = "Cupom não encontrado" });
            }

            return Ok(cupom);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateCupomRequest request)
        {
            try
            {
                var cupom = await _cupomService.CreateAsync(request);
                return CreatedAtAction(nameof(GetById), new { id = cupom.Id }, cupom);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Erro ao criar cupom", error = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateCupomRequest request)
        {
            try
            {
                var cupom = await _cupomService.UpdateAsync(id, request);
                
                if (cupom == null)
                {
                    return NotFound(new { message = "Cupom não encontrado" });
                }

                return Ok(cupom);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Erro ao atualizar cupom", error = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _cupomService.DeleteAsync(id);
            
            if (!result)
            {
                return NotFound(new { message = "Cupom não encontrado" });
            }

            return NoContent();
        }

        [HttpPost("validar")]
        public async Task<IActionResult> ValidarCupom([FromBody] ValidacaoCupomRequest request)
        {
            var response = await _cupomService.ValidarCupomAsync(request);
            
            if (!response.Valido)
            {
                return BadRequest(response);
            }

            return Ok(response);
        }

        [HttpPost("{id}/usar")]
        public async Task<IActionResult> UsarCupom(int id, [FromBody] UsarCupomRequest request)
        {
            var result = await _cupomService.UsarCupomAsync(id, request.LojaId, request.ValorPedido);
            
            if (!result)
            {
                return NotFound(new { message = "Cupom não encontrado" });
            }

            return Ok(new { message = "Cupom utilizado com sucesso" });
        }
    }

    public class UsarCupomRequest
    {
        public int? LojaId { get; set; }
        public decimal ValorPedido { get; set; }
    }
}

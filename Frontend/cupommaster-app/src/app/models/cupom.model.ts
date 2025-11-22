export interface Cupom {
  id?: number;
  codigo: string;
  valorDesconto: number;
  tipoDesconto: TipoDesconto;
  dataValidade: Date;
  quantidadeDisponivel: number;
  quantidadeUtilizada?: number;
  ativo: boolean;
  regrasUso?: string;
  lojaId?: number;
  loja?: Loja;
  createdAt?: Date;
  updatedAt?: Date;
}

export enum TipoDesconto {
  PERCENTUAL = 'PERCENTUAL',
  VALOR_FIXO = 'VALOR_FIXO'
}

export interface Loja {
  id?: number;
  nome: string;
  cnpj: string;
  email: string;
  telefone?: string;
  endereco?: string;
  ativo: boolean;
  createdAt?: Date;
}

export interface HistoricoUso {
  id?: number;
  cupomId: number;
  cupom?: Cupom;
  dataUso: Date;
  valorPedido: number;
  valorDesconto: number;
  lojaId?: number;
  loja?: Loja;
  observacao?: string;
}

export interface ValidacaoCupomRequest {
  codigo: string;
  valorPedido: number;
  lojaId?: number;
}

export interface ValidacaoCupomResponse {
  valido: boolean;
  mensagem: string;
  cupom?: Cupom;
  valorDesconto?: number;
}

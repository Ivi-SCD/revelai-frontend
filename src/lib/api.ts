import { 
  Cliente, 
  Produto, 
  Analise, 
  Task, 
  Progresso, 
  Treinamento, 
  Uso, 
  Evolucao, 
  Jornada,
  ReuniaoInput,
  DocumentoInput,
  AIGenerationRequest,
  ClienteCreateRequest,
  ProdutoCreateRequest,
  HistoricoItem
} from '@/types/api';

const API_BASE_URL = 'http://localhost:8000/api/v1';

class ApiService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} - ${response.statusText}`);
    }

    return response.json();
  }

  // Clientes e Produtos
  async getClientes(): Promise<Cliente[]> {
    return this.request<Cliente[]>('/clientes/');
  }

  async getProdutos(): Promise<Produto[]> {
    return this.request<Produto[]>('/clientes/produtos');
  }

  // Análises (Contratação)
  async getAnaliseUltima(idCliente: string, idProduto: string): Promise<Analise> {
    return this.request<Analise>(`/analises/cliente/${idCliente}/produto/${idProduto}/ultima`);
  }

  async gerarAnalise(data: AIGenerationRequest): Promise<Analise> {
    return this.request<Analise>('/analises/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Implementação
  async getTasks(idCliente: string, idProduto: string): Promise<Task[]> {
    return this.request<Task[]>(`/implementacao/tasks/cliente/${idCliente}/produto/${idProduto}`);
  }

  async getProgressoTasks(idCliente: string, idProduto: string): Promise<Progresso> {
    return this.request<Progresso>(`/implementacao/tasks/progresso/cliente/${idCliente}/produto/${idProduto}`);
  }

  async getTreinamentos(idCliente: string, idProduto: string): Promise<Treinamento[]> {
    return this.request<Treinamento[]>(`/implementacao/treinamentos/cliente/${idCliente}/produto/${idProduto}`);
  }

  async updateTaskStatus(idTask: string, status: 'pendente' | 'em_andamento' | 'concluido'): Promise<Task> {
    return this.request<Task>(`/implementacao/tasks/${idTask}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  async gerarImplementacao(data: AIGenerationRequest): Promise<{ tasks: Task[]; treinamentos: Treinamento[] }> {
    return this.request<{ tasks: Task[]; treinamentos: Treinamento[] }>('/implementacao/gerar', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Uso
  async getUso(idCliente: string, idProduto: string): Promise<Uso> {
    return this.request<Uso>(`/uso/cliente/${idCliente}/produto/${idProduto}`);
  }

  async gerarUso(data: AIGenerationRequest): Promise<Uso> {
    return this.request<Uso>('/uso/gerar', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Evolução
  async getEvolucao(idCliente: string, idProduto: string): Promise<Evolucao> {
    return this.request<Evolucao>(`/evolucao/cliente/${idCliente}/produto/${idProduto}`);
  }

  async gerarEvolucao(data: AIGenerationRequest): Promise<Evolucao> {
    return this.request<Evolucao>('/evolucao/gerar', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Jornada Completa
  async getJornada(idCliente: string, idProduto: string): Promise<Jornada> {
    return this.request<Jornada>(`/jornada/cliente/${idCliente}/produto/${idProduto}`);
  }

  // Dados (Input)
  async addReuniao(data: ReuniaoInput): Promise<void> {
    return this.request<void>('/dados/reunioes', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async addDocumento(data: DocumentoInput): Promise<void> {
    return this.request<void>('/dados/documentos', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Criar Cliente e Produto
  async criarCliente(data: ClienteCreateRequest): Promise<Cliente> {
    return this.request<Cliente>('/clientes/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async criarProduto(data: ProdutoCreateRequest): Promise<Produto> {
    return this.request<Produto>('/clientes/produtos', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Check tasks completion
  async verificarTasksConcluidas(idCliente: string, idProduto: string): Promise<{ todas_concluidas: boolean }> {
    return this.request<{ todas_concluidas: boolean }>(`/implementacao/tasks/concluidas/cliente/${idCliente}/produto/${idProduto}`);
  }

  async getHistoricoUnificado(idCliente: string): Promise<{ historico: HistoricoItem[]; total: number }> {
    return this.request<{ historico: HistoricoItem[]; total: number }>(`/dados/historico/cliente/${idCliente}`);
  }

  async getHistoricoUnificadoProduto(idCliente: string, idProduto: string): Promise<{ historico: HistoricoItem[]; total: number }> {
    return this.request<{ historico: HistoricoItem[]; total: number }>(`/dados/historico/cliente/${idCliente}/produto/${idProduto}`);
  }
}

export const apiService = new ApiService();

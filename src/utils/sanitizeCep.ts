export function sanitizeCep(cep: string | undefined | null): string {
    if (!cep || typeof cep !== 'string') {
      throw new Error('CEP inválido ou não informado!');
    }
  
    return cep.replace(/\D/g, '');
  }
  
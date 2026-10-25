import { useEffect } from 'react';

// A pagina de teste da Marina agora e a landing estatica /marina-sdr.
// O servidor ja responde 301 em /marina-teste; este componente cobre navegacao interna.
export function MarinaTeste() {
  useEffect(() => {
    window.location.replace('/marina-sdr');
  }, []);
  return (
    <p style={{ padding: 24 }}>
      Redirecionando para <a href="/marina-sdr">Marina SDR</a>...
    </p>
  );
}

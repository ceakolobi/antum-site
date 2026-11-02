import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

// Campo de senha com o "olhinho" para mostrar/ocultar o que foi digitado.
type Props = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'>;

export const SenhaInput: React.FC<Props> = ({ className = '', ...resto }) => {
  const [ver, setVer] = useState(false);
  return (
    <div className="relative">
      <input {...resto} type={ver ? 'text' : 'password'} className={`${className} pr-11`} />
      <button
        type="button"
        onClick={() => setVer((v) => !v)}
        aria-label={ver ? 'Ocultar senha' : 'Mostrar senha'}
        title={ver ? 'Ocultar senha' : 'Mostrar senha'}
        className="absolute inset-y-0 right-0 px-3 text-slate-400 hover:text-white"
      >
        {ver ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
      </button>
    </div>
  );
};

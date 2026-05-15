import { useState } from 'react'
import { uploadText } from '../services/api'
import './UploadScreen.css'

const BASE_TEXT = `Manual Operacional e de Segurança – Elevador Manual de Carga (Modelo MC-70)
Edição Revisada – 1978
Departamento de Engenharia Mecânica – Fábrica Industrial Metzger & Filhos

1. Finalidade do Equipamento
O Elevador Manual de Carga Modelo MC-70 foi projetado para transporte vertical de materiais em pequenos depósitos, oficinas, mercados e fábricas de baixa escala. É indicado para cargas entre 25 kg e 180 kg, operado exclusivamente por acionamento manual através de manivela e sistema de guincho mecânico.
Este equipamento não é destinado ao transporte de pessoas em hipótese alguma.

2. Princípio de Funcionamento
O MC-70 funciona por meio de um conjunto de:
• Guincho de tambor metálico, acionado manualmente por uma manivela de 42 cm.
• Cabo de aço trançado de 6 mm, com resistência de ruptura de 580 kgf.
• Embreagem de fricção, responsável por controlar descidas.
• Trava de segurança dentada, que impede retorno involuntário da carga.
• Guia lateral de madeira tratada ou metal, onde a cabine se desloca verticalmente.
A operação consiste na elevação da carga pela rotação da manivela, enrolando o cabo no tambor. Para descida, a embreagem é acionada parcialmente, permitindo controle fino da velocidade.

3. Capacidade e Limites Operacionais
3.1 Peso Máximo
• Capacidade nominal: 120 kg
• Capacidade máxima absoluta: 180 kg
O valor máximo deve ser utilizado apenas em situações excepcionais.

3.2 Tipos de Cabos Compatíveis
Aço trançado 6x7 – 6 mm – 180 kg (cabo padrão do equipamento)
Aço trançado 6x19 – 6,5 mm – 250 kg (pode ser usado, mas reduz fluidez no tambor)
Corda sintética – Não permitido (proibido por risco de ruptura)

3.3 Velocidade Recomendada
• Elevação: 4 a 6 m/min
• Descida: controlada pela embreagem

4. Procedimentos de Operação
4.1 Elevação
1. Posicione a cabine no pavimento inferior.
2. Verifique se a trava dentada está engatada.
3. Centralize a carga na cabine.
4. Execute duas voltas de teste na manivela.
5. Gire no sentido horário.
6. Nunca solte a manivela abruptamente.

4.2 Descida
1. Desengate a trava dentada.
2. Acione a embreagem gradualmente.
3. Gire a manivela no sentido anti-horário.
4. Controle a velocidade pela embreagem.
5. Reengate a trava ao final.

5. Travamento e Segurança
5.1 Trava Dentada Automática
• Engata durante a subida.
• Deve produzir som metálico a cada dente.
• Se silenciosa, há risco de quebra da mola.

5.2 Freio de Emergência
• Atua se a descida exceder 1,8 m/s.
• Aquecimento > 60°C indica desgaste.

5.3 Travamento para Manutenção
• Utilizar o pino frontal no eixo da manivela.

6. Inspeção Diária
Verificar:
• Integridade do cabo (fios rompidos, ferrugem, lubrificação)
• Mandíbula da trava (alinhamento e mola)
• Embreagem (odor, ruído, suavidade)
• Cabine e estrutura (parafusos, trilhos, rodanas)
• Sons anormais durante operação

7. Manutenção Preventiva
30 dias: Engraxar rolamentos, Lubrificar cabo, Testar freio de emergência
6 meses: Trocar mola da trava, Revisar lonas da embreagem, Apertar suportes do tambor
12 meses: Trocar o cabo de aço, Revisão estrutural completa

8. Superaquecimento da Embreagem
Ocorre por: Descidas longas, Controle inadequado, Carga excessiva, Lonas desgastadas
Sinais: Cheiro de queimado, Tambor muito quente, Solavancos na descida
Procedimento:
1. Parar operação.
2. Engatar trava dentada.
3. Aguardar 10–15 min.
4. Testar tambor com carga leve.
5. Continuar operação apenas sem sintomas.

9. Emergências
1. Travar equipamento com pino
2. Remover carga se seguro
3. Não liberar embreagem
4. Isolar área
5. Registrar ocorrência

10. Avisos Importantes
• Proibido transporte de pessoas
• Não usar cabos improvisados
• Operador não deve estar sob efeito de sedativos
• Uso obrigatório de luvas
• Não retirar proteções
• Afastar curiosos da área`

interface Props {
  onSuccess: () => void
}

export default function UploadScreen({ onSuccess }: Props) {
  const [text, setText] = useState(BASE_TEXT)
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async () => {
    if (!text.trim()) {
      setStatus('error')
      setMessage('O campo de texto não pode estar vazio.')
      return
    }
    setStatus('loading')
    setMessage('')
    try {
      const res = await uploadText(text)
      setStatus('success')
      setMessage(`✓ ${res.message} (${res.length.toLocaleString()} caracteres)`)
      setTimeout(() => onSuccess(), 900)
    } catch (err: unknown) {
      setStatus('error')
      setMessage(err instanceof Error ? err.message : 'Erro ao enviar texto.')
    }
  }

  return (
    <div className="upload-screen">
      <div className="screen-header">
        <div className="screen-tag">ETAPA 01 / 02</div>
        <h1 className="screen-title">Carregar Base de Conhecimento</h1>
        <p className="screen-subtitle">
          Cole ou edite o manual operacional abaixo. Este texto será enviado à IA como base exclusiva de respostas.
        </p>
      </div>

      <div className="upload-card">
        <div className="card-top-bar">
          <span className="file-label">
            <span className="file-icon">▣</span>
            MC-70_Manual_Operacional.txt
          </span>
          <span className="char-count">{text.length.toLocaleString()} chars</span>
        </div>

        <textarea
          className="text-editor"
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Cole o texto do manual aqui..."
          spellCheck={false}
        />

        <div className="card-actions">
          {message && (
            <div className={`status-msg ${status}`}>
              {message}
            </div>
          )}
          <button
            className={`btn-primary ${status === 'loading' ? 'loading' : ''}`}
            onClick={handleSubmit}
            disabled={status === 'loading'}
          >
            {status === 'loading' ? (
              <>
                <span className="spinner" />
                Enviando...
              </>
            ) : status === 'success' ? (
              <>✓ Enviado! Redirecionando...</>
            ) : (
              <>
                <span className="btn-arrow">▶</span>
                Enviar Texto para a IA
              </>
            )}
          </button>
        </div>
      </div>

      <div className="info-grid">
        <div className="info-card">
          <span className="info-icon">⚙</span>
          <div>
            <strong>Modelo MC-70</strong>
            <p>Manual de 1978 – Metzger & Filhos</p>
          </div>
        </div>
        <div className="info-card">
          <span className="info-icon">🔒</span>
          <div>
            <strong>Respostas Restritas</strong>
            <p>IA responde apenas com base no texto</p>
          </div>
        </div>
        <div className="info-card">
          <span className="info-icon">⚡</span>
          <div>
            <strong>Gemini 1.5 Flash</strong>
            <p>Modelo de IA utilizado no backend</p>
          </div>
        </div>
      </div>
    </div>
  )
}

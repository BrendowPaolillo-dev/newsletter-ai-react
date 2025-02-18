import MarkdownIt from 'markdown-it';
import * as emoji from 'markdown-it-emoji';
import footnote from 'markdown-it-footnote';
import sub from 'markdown-it-sub';
import sup from 'markdown-it-sup';
import abbr from 'markdown-it-abbr';
import mark from 'markdown-it-mark';
import ins from 'markdown-it-ins';
import deflist from 'markdown-it-deflist';
import container from 'markdown-it-container';

// Configuração do `markdown-it`
const markdownIt = new MarkdownIt({
  html: true, // Permitir tags HTML no Markdown
  linkify: true, // Converter URLs automaticamente em links clicáveis
  breaks: true, // Quebras de linha simples são convertidas para <br>
  typographer: true, // Ativar conversões tipográficas automáticas
});

// Adicionar plugins
markdownIt.use(emoji.full); // Emojis
markdownIt.use(footnote); // Notas de rodapé
markdownIt.use(sub); // Subscrito (H~2~O)
markdownIt.use(sup); // Sobrescrito (19^th^)
markdownIt.use(abbr); // Abreviações
markdownIt.use(mark); // Texto marcado (==Marked text==)
markdownIt.use(ins); // Texto inserido (++Inserted text++)
markdownIt.use(deflist); // Listas de definições

// Adicionar suporte a containers personalizados
markdownIt.use(container, 'warning', {
  render: (tokens: any, idx: any) => {
    const token = tokens[idx];
    if (token.nesting === 1) {
      // Abertura do container
      return '<div class="custom-container warning">\n';
    } else {
      // Fechamento do container
      return '</div>\n';
    }
  },
});

export default markdownIt;

import { useState } from 'react';
import { ArrowUpRight, Instagram, Mail, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Brand } from './Brand';
import { Modal } from './Modal';
import { INSTAGRAM_URL, MAP_URL } from '../data/park';

export function Footer() {
  const [privacyOpen, setPrivacyOpen] = useState(false);
  return (
    <>
      <footer id="contato" className="site-footer">
        <div className="container footer-main">
          <div className="footer-brand">
            <Brand />
            <p>
              Um destino. Três eras.
              <br />
              Histórias que ficam com você.
            </p>
            <a className="footer-instagram" href={INSTAGRAM_URL} target="_blank" rel="noreferrer">
              <Instagram size={17} aria-hidden="true" /> Siga a aventura{' '}
              <ArrowUpRight size={14} aria-hidden="true" />
            </a>
          </div>
          <div className="footer-column">
            <h2>Descubra</h2>
            <Link to="/#hero">O parque</Link>
            <Link to="/#eras">As três eras</Link>
            <Link to="/#atracoes">Nossas atrações</Link>
            <Link to="/cardapio">Gastronomia</Link>
          </div>
          <div className="footer-column">
            <h2>Sua visita</h2>
            <Link to="/#visita">Planeje sua aventura</Link>
            <Link to="/#localizacao">Mapa interativo</Link>
            <Link to="/#duvidas">Dúvidas frequentes</Link>
            <a href={MAP_URL} target="_blank" rel="noreferrer">
              Como chegar <ArrowUpRight size={13} aria-hidden="true" />
            </a>
            <button onClick={() => setPrivacyOpen(true)}>Privacidade</button>
          </div>
          <div className="footer-column footer-contact">
            <h2>Vamos conversar</h2>
            <a href={MAP_URL} target="_blank" rel="noreferrer">
              <MapPin size={16} aria-hidden="true" /> Caldas Novas, Goiás
            </a>
            <a href="mailto:contato@setland.com.br">
              <Mail size={16} aria-hidden="true" /> contato@setland.com.br
            </a>
            <span>Terça a domingo · 9h às 18h</span>
            <a href={INSTAGRAM_URL} className="text-link" target="_blank" rel="noreferrer">
              Fale com a equipe <ArrowUpRight size={14} aria-hidden="true" />
            </a>
          </div>
        </div>
        <div className="container footer-bottom">
          <span>© {new Date().getFullYear()} Setland. Todos os direitos reservados.</span>
          <span>
            Caldas Novas, Goiás <span className="tiny-diamond" /> Brasil
          </span>
        </div>
      </footer>
      <Modal
        isOpen={privacyOpen}
        onClose={() => setPrivacyOpen(false)}
        titleId="privacy-title"
        className="privacy-modal"
      >
        <span className="eyebrow">Transparência</span>
        <h2 id="privacy-title">Sua privacidade importa.</h2>
        <p>
          A preferência de atmosfera é salva apenas no armazenamento local do seu navegador. Você
          pode apagá-la nas configurações do navegador.
        </p>
        <p>
          O planejador de ingressos é uma simulação. Os dados preenchidos ficam temporariamente na
          memória da página e são apagados ao fechar o planejador. Nenhum pagamento é cobrado e
          nenhum ingresso é emitido nesta versão.
        </p>
        <p>
          O guia virtual usa respostas locais quando não há um serviço conectado. Se um endpoint de
          atendimento for configurado, as perguntas serão enviadas a esse serviço. Não envie dados
          pessoais ou de pagamento pelo chat.
        </p>
        <p>
          O vídeo é servido pelo Cloudinary. Ao reproduzi-lo, seu navegador se conecta a esse
          provedor. Links para Instagram e Google Maps abrem serviços externos, sujeitos às
          respectivas políticas de privacidade.
        </p>
        <p>
          Para esclarecer dúvidas, escreva para{' '}
          <a href="mailto:contato@setland.com.br">contato@setland.com.br</a>.
        </p>
      </Modal>
    </>
  );
}

Projeto de Sistema de Agendamento para Barbeiros

Descrição

Este projeto é um sistema de agendamento para barbeiros que permite aos usuários registrar-se, fazer login, agendar serviços e aos administradores gerenciar barbeiros e horários. O sistema foi desenvolvido com foco na facilidade de uso e segurança.

Funcionalidades
Requisitos Funcionais
ID   |	Descrição	                                                                       | Prioridade |	Módulo/Tela
RF01 |	Permitir que o usuário faça login                                                | Alta	      | Tela de Login
RF02 |	Permitir que o usuário se registre	                                             | Alta	      | Tela de Registro
RF03 |	Permitir que o usuário recupere a senha	                                         | Média	    | Tela de Resetar Senha
RF04 |	Permitir que o administrador adicione barbeiros                                  | Alta	      | Tela de Administração
RF05 |	Permitir que o administrador remova barbeiros	                                   | Alta	      | Tela de Administração
RF06 |	Permitir que o administrador edite barbeiros	                                   | Alta	      | Tela de Administração
RF07 |	Permitir que o administrador defina horários de trabalho e datas não disponíveis | Alta	      | Tela de Administração
RF08 |	Permitir que o administrador visualize os agendamentos dos clientes	             | Alta	      | Tela de Administração
RF09 |	Permitir que o usuário edite sua foto de perfil	                                 | Média	    | Tela Home do Usuário
RF10 |	Permitir que o usuário agende serviços	                                         | Alta	      | Tela Home do Usuário
RF11 |	Permitir que o usuário visualize seus agendamentos confirmados	                 | Alta	      | Tela Home do Usuário
Requisitos Não Funcionais
ID	 | Descrição	                                                                       | Prioridade	| Dependências
RNF01| O sistema deve ser responsivo e funcionar em dispositivos móveis Android e iOS	   | Alta	      | Uso de Ionic e Capacitor
RNF02| O sistema deve utilizar autenticação segura	                                     | Alta	      | Uso de Firebase
RNF03| O sistema deve ter tempo de resposta inferior a 2 segundos para ações principais	 | Média	    | Infraestrutura do Firebase
RNF04| O sistema deve armazenar dados de forma segura e confiável	                       | Alta	      | Uso de Firebase
RNF05| A interface do usuário deve ser intuitiva e fácil de usar	                       | Alta	      | Uso de Angular Material
RNF06| O sistema deve suportar múltiplos usuários simultaneamente	                       | Alta	      | Infraestrutura do Firebase
RNF07| O sistema deve ser escalável para suportar crescimento futuro	                   | Média	    | Arquitetura do sistema

Instalação

Para clonar e executar este projeto, siga as etapas abaixo:

    Clone o repositório:

HTTPS: https://github.com/RicardoValus/Rockers.git
SSH: git@github.com:RicardoValus/Rockers.git

cd Rockers

Instale as dependências:

npm install

Inicie o servidor de desenvolvimento:

    npm start

Uso

    Página de Login: Permite que usuários façam login no sistema.
    Página de Registro: Permite que novos usuários se registrem.
    Página de Recuperação de Senha: Permite que usuários recuperem suas senhas.
    Página de Administração: Administradores podem adicionar, remover e editar barbeiros, bem como definir horários de trabalho e visualizar agendamentos.
    Página do Usuário: Usuários podem agendar serviços, editar suas fotos de perfil e visualizar agendamentos confirmados.

Tecnologias Utilizadas

    Frontend:
        Ionic
        Angular
        Angular Material

    Backend:
        Firebase

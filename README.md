Projeto de Sistema de Agendamento para Barbeiros

Este projeto é um sistema de agendamento para barbeiros que permite aos usuários registrar-se, fazer login, agendar serviços e aos administradores gerenciar barbeiros e horários. O sistema foi desenvolvido com foco na facilidade de uso e segurança.

Instalação

Para baixar o aplicativo em seu celular, baixe o "app-debug.apk" que está anexado neste projeto e execute-o para instalá-lo.

Para clonar e executar este projeto, siga as etapas abaixo:

  Clone o repositório:

    HTTPS: https://github.com/RicardoValus/Rockers.git

    SSH: git@github.com:RicardoValus/Rockers.git

    cd Rockers

Instale as dependências:

    npm install

Inicie o servidor de desenvolvimento:

    ionic serve

Execução no Celular

Caso queira executar o projeto no celular, siga os passos abaixo:

  Abra seu Android Studio.

  Abra o projeto no arquivo Android pela raiz do projeto.

  Ative o modo desenvolvedor do seu celular.

  Conecte seu celular através da depuração por Wi-Fi:
      Vá para Developer Options > Wireless Debugging > Pair using QR Code.
      Escaneie o QR Code para parear seu dispositivo.

  Em seu terminal do projeto na pasta raiz, utilize o comando abaixo para executar o projeto em seu celular em tempo real:

    ionic cap run android -l --external

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

Diagrama UML:
![image](https://github.com/RicardoValus/Rockers/assets/100782392/779e44e4-e7aa-43d3-a2ad-cfdcae565ef4)

Tabela de Levantamento de Requisitos:

Requisitos Funcionais:
![image](https://github.com/RicardoValus/Rockers/assets/100782392/aa932171-3b7a-4357-acf7-099ba7cf3034)

Requisitos Não Funcionais:
![image](https://github.com/RicardoValus/Rockers/assets/100782392/77ddaec3-bf79-4309-b8e1-ce623b95afe2)

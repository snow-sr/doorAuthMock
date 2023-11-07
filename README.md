# doorAuthMock
## Sistema base de autenticação para a porta da fábrica de software - IFC Araquari.


O sistema, desenvolvido em node.js + Express conta com as seguintes rotas para autenticação das chaves RFID:

```
/rfid/
```
Que aceita Requisições do tipo POST com os seguintes paramêtros:
* rfid # Contém a uid da tag a ser validada

```
/rfid/create
```
Aceita requisições do tipo POST com os seguintes paramêtros:
* rfid # Deve ser a uid da tag a ser registrada
* user # ID do utilizador da tag

```
/createUser/
```
Aceita requisições do tipo POST com os seguintes paramêtros:
* name # Nome do utilizador do sistema
* email # Email do utilizador


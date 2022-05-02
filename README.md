1 El forecast solo encontre un servicio que daba los 5 dias, pero cada 3 hs.,
2 Use Supertes para poder hacer pruebas automaticas.
3 El login, solamente genere un token "fijo" para simular algo de seguridad para poder usar la API.
4 Dejo las API_KEY ya que todas son de pruebas, para que las puedan correr.
5 Para pruebas ejecutar node "npm run test" (Supertest no lo use nunca, tuve que investigar.)
6 para probarlo desde alguna herramienta como postman o alguna para testear api, "npm run start" y hacerle peticiones a los endpoint.
    primero : <ipserver>:8080/v1/login para obtener el token. luego :

    <ipserver>:8080/v1/location
    <ipserver>:8080/v1/v1/current/[nombre ciudad opcional, si no toma IP publico]
    <ipserver>:8080/v1/v1/forecast/[nombre ciudad opcional, si no toma IP publico]
    
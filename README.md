## Cómo ver la app

### Ver la app en ordenador

1. Instala [Node.js](https://nodejs.org/dist/v22.6.0/node-v22.6.0-x64.msi), selecciona la versión v22. Asegúrate de que la versión es esa usando el comando `node -v` en el símbolo del sistema
2. Instala git
3. Abre el símbolo del sistema
4. Pon los siguientes comandos en el símbolo del sistema, uno a la vez:
```bash
git clone https://github.com/davider0/g30-prototype.git
cd g30-prototype
```
5. Pon el siguiente comando:
```bash
npm install -g expo expo-cli metro babel
```
Con esto instalas Expo, el entorno de desarrollo con el que se ha hecho la aplicación y lo que vas a necesitar para instalar la app

6. Una vez estés dentro del fichero del proyecto en el símbolo del sistema instala las dependencias:
```bash
npm install
```
7. Para ejecutar la aplicación, asegúrate que el símbolo del sistema está dentro de la misma carpeta donde se ubica `index.js` y pon el siguiente comando:
```bash
npx expo start
```
8. Cuando haya completado de cargarse la aplicación pulsa la tecla `W`

### Ver la app en móvil
1. Descarga una aplicación llamada *Expo Go*
2. En tu ordenador, haz el mismo proceso que Ver la app en el ordenador
3. Cuando haya completado de cargarse, escanea el código QR que te aparece en el símbolo del sistema con la aplicación de Cámara

import React, { lazy, useState, useEffect, useRef } from "react";
import { Appearance, StyleSheet, Text, View, TouchableOpacity, ScrollView, SafeAreaView, TextInput, Image, Platform, Alert, Linking } from "react-native";
import Constants from "expo-constants";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import JSONcode from "../server/models/cuadernoExplotacion/tratamientoFitosanitarios.json";
import RenderJson from "./RenderJson";
import CuadernoButtons from "./CuadernoButtons";
import Voice from "@react-native-voice/voice";
import Permissions from "expo";
export function Main() {
    const [str, setStr] = useState("..."); // Almacena el texto provisional del reconocimiento de voz
    const [str2, setStr2] = useState("..."); // Almacena el texto resultado del reconocimiento de voz   
    const [grabando, setGrabando] = useState(false); // Alternancia entre si graba el micrófono o no
    const insets = useSafeAreaInsets(); // Hook que sirve para controlar cómo se mueven los componentes cuando rotas el movil de vertical a horizontal
    const [forceUpdateKey, setForceUpdateKey] = useState(0); // Variable que se usa para renderizar las cajas de texto

    // Inicialización del reconocimiento de voz en el navegador
    let recognition;
    const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = useRef(new SpeechRecognition()).current;


    useEffect(() => {

        // Función para comprobar si en Android tiene permisos de voz, en caso contrario, redirige a la tienda para descargar la aplicacion de google
        (async () => {
            if (Platform.OS === "android") {
                const texto = await Voice.getSpeechRecognitionServices()
                if (!texto.includes("com.google.android.googlequicksearchbox")) { // Funciona la función igual para string que para string[]?
                    return (
                        Alert.alert('Permisos Android', 'No se ha detectado el reconocimiento de voz instalado en tu móvil. Este problema se puede solucionar instalando la aplicación de Google Search App. ¿Desea ir a la tienda para instalarlo?', [
                            {
                                text: 'Cancelar',
                                onPress: () => Alert.alert('No se instalará la aplicación Google'),
                                style: 'cancel',
                            },
                            {
                                text: 'Aceptar',
                                onPress: async () => { // Puede el componente Alert ejecutar funciones asíncronas?
                                    const condicion = await Linking.canOpenURL("https://play.google.com/store/apps/details?id=com.google.android.googlequicksearchbox&hl=es_419&pli=1")
                                    if (condicion) {
                                        Linking.openURL("https://play.google.com/store/apps/details?id=com.google.android.googlequicksearchbox&hl=es_419&pli=1");
                                    } else {
                                        Alert.alert("No se pudo abrir la URL. Prueba a reiniciar la aplicación");
                                    }
                                },
                            }
                        ], {
                            cancelable: true,
                            onDismiss: () => Alert.alert('No se instalará la aplicación de Google'),
                        }
                        )

                    );

                } else return;
            } else return;
        });

        // Inicialización de reconocimiento de voz en iOS y Android, junto con la edición de las variables
        if (Platform.OS === "ios" || Platform.OS === "android") {

            Voice.onSpeechStart = () => setGrabando(true);
            Voice.onSpeechEnd = () => setGrabando(false);
            Voice.onSpeechResults = (event) => {
                const results = event?.value;
                if (results.length > 0) {
                    setStr2(results?.[0]);
                    setStr(results?.[0]);
                }
            };
            Voice.onSpeechError = (event) => {
                console.error("Error en el reconocimiento de voz: ", event.error);
            };

            return () => {
                Voice.destroy().then(Voice.removeAllListeners);
            };
        } else { // Almacenamiento de los textos resultados del reconocimiento de voz

            if (SpeechRecognition) {
                recognition.continuous = true;
                recognition.interimResults = true;

                recognition.onresult = (event) => {
                    let interimTranscript = "...";
                    let finalTranscript = "";

                    for (let i = event.resultIndex; i < event.results.length; i++) {

                        let transcript = event.results[i][0].transcript;
                        console.log(transcript);
                        if (event.results[i].isFinal) {

                            finalTranscript += transcript;


                        } else {
                            interimTranscript += transcript;
                        }
                    }


                    setStr(interimTranscript);
                    setStr2(finalTranscript);

                };

                recognition.onerror = (event) => {
                    console.error("Error en el reconocimiento de voz: ", event.error);
                };
            } else {
                alert("SpeechRecognition no es compatible con este navegador.");
            }

        }

    }, []);

    // Función del botón verde (alterna el booleano 'grabando')
    const handleButtonClick = async () => {
        if (!grabando) {
            if (Platform.OS === "android" || Platform.OS === "ios") {
                await Voice.start('es-ES').then(() => console.log("Reconocimiento de voz iniciado")).catch(e => console.error("Error al iniciar el reconocimiento de voz: ", e));
            } else recognition.start();
        } else {
            if (Platform.OS === "android" || Platform.OS === "ios") {
                await Voice.stop().then(() => console.log("Reconocimiento de voz detenido")).catch(e => console.error("Error al detener el reconocimiento de voz: ", e));
            } else recognition.stop();
        }
        return setGrabando(!grabando);
    };

    // Función del botón azul (quita la última palabra del resultado final)
    const handleRemoveWord = async () => {
        setStr2(str2.substring(0, str2.lastIndexOf(' ')));

    }

    // Función del botón morado (quita el texto de todas las textboxes)
    const handleClear = async () => {

        setForceUpdateKey(forceUpdateKey + 1);

    }

    // jsx
    return (
        <>
            <Text style={styles.titleText}>Cuaderno Digital</Text>

            <ScrollView bounces={false}>
                <View style={styles.container}>
                    <SafeAreaView style={{ margin: 12 }}>
                        <CuadernoButtons />
                        <Text style={styles.text}>{"\n" + str}</Text>
                        <Text style={styles.text}>Resultado final: {str2}</Text>

                        <View style={styles.card}>

                            <RenderJson jsonData={JSONcode} forceUpdateKey={forceUpdateKey} />
                        </View>
                    </SafeAreaView>
                </View>
            </ScrollView>

            <View style={styles.buttonContainer}>

                <TouchableOpacity
                    style={[
                        styles.button3,
                        { opacity: (grabando ? 0.1 : 1) }]}
                    onPress={grabando ? () => { } : handleClear}
                >
                    <Image source={require(`../assets/clear.png`)} resizeMode='contain' style={{

                        width: 110,
                        height: 110,
                    }} />
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        styles.button,
                        grabando ? styles.buttonRecording : styles.buttonNotRecording,
                    ]}
                    onPress={handleButtonClick}
                >
                    <Image source={grabando ? require(`../assets/micro_true.png`) : require(`../assets/micro_false.png`)} resizeMode='contain' style={{
                        width: 170,
                        height: 170,
                    }} />
                </TouchableOpacity>
                <TouchableOpacity
                    style={[
                        styles.button2,
                        { opacity: (grabando ? 0.1 : 1) }]}
                    onPress={grabando ? () => { } : handleRemoveWord}
                >
                    <Image source={require(`../assets/return.png`)} resizeMode='contain' style={{

                        width: 127,
                        height: 127,
                    }} />
                </TouchableOpacity>

            </View>


        </>
    );
}

// Estilos
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#E8ffbf", // Color de fondo neumorfista
        paddingTop: Constants.statusBarHeight,
    },
    text: {
        color: "#333", // Color del texto
        fontSize: 18, // Tamaño del texto
        textAlign: "center",
    },
    titleText: {
        marginTop: Platform.OS === 'ios' ? Constants.statusBarHeight : 20,
        color: "#333", // Color título
        fontSize: 24, // Tamaño título
        textAlign: "center",
        marginVertical: 20,
        fontWeight: "bold",
    },
    card: {
        marginTop: 20,
        width: 400,
        padding: 20,
        backgroundColor: "#bdf0bb",
        borderRadius: 15,
        shadowOffset: { width: -5, height: -5 },
        shadowOpacity: 0.2,
        shadowRadius: 15,
        shadowColor: "white",
        elevation: 10,
    },
    buttonContainer: {
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 35,
        marginTop: 15,
        flexDirection: 'row',

    },
    button: {
        padding: 5,
        borderRadius: 100,
        width: 135,
        height: 135,
        alignItems: "center",
        justifyContent: "center",
        shadowOffset: { width: 5, height: 5 },
        shadowOpacity: 0.2,
        shadowRadius: 15,
        shadowColor: "black",
        elevation: 10,
        horizontalAlign: "middle",
        marginLeft: 10,
    },
    buttonRecording: {
        backgroundColor: "#F56565", // Rojo

    },
    buttonNotRecording: {
        backgroundColor: "#48BB78", // Verde

    },
    buttonText: {
        color: "#fff",
        fontSize: 18,
        textAlign: "center",
    },
    button2: {

        borderRadius: 100,
        width: 90,
        height: 90,
        alignItems: "center",
        justifyContent: "center",
        shadowOffset: { width: 5, height: 5 },
        shadowOpacity: 0.2,
        shadowRadius: 15,
        shadowColor: "black",
        elevation: 10,
        horizontalAlign: "middle",
        backgroundColor: "#FFFFFF",
        marginLeft: 10,
        marginRight: 20,
    },
    button3: {

        borderRadius: 100,
        width: 90,
        height: 90,
        alignItems: "center",
        justifyContent: "center",
        shadowOffset: { width: 5, height: 5 },
        shadowOpacity: 0.2,
        shadowRadius: 15,
        shadowColor: "black",
        elevation: 10,
        horizontalAlign: "middle",
        backgroundColor: "#FFFFFF",
        marginLeft: 20,
    }
});

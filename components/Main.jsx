import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect, useRef } from "react";
import Constants from "expo-constants";
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
    TextInput,
    Image
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function Main() {
    const [str, setStr] = useState("...");
    const [str2, setStr2] = useState("...");
    const [grabando, setGrabando] = useState(false);
    const insets = useSafeAreaInsets();
    const [valor, onChangeText] = useState('Escribe aquí');

    let recognition;
    const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = useRef(new SpeechRecognition()).current;

    useEffect(() => {
        if (SpeechRecognition) {
            recognition.continuous = true;
            recognition.interimResults = true;

            recognition.onresult = (event) => {
                let interimTranscript = "";
                let finalTranscript = "";

                for (let i = event.resultIndex; i < event.results.length; i++) {
                    const transcript = event.results[i][0].transcript;
                    if (event.results[i].isFinal) {
                        finalTranscript += transcript;
                    } else {
                        interimTranscript += transcript;
                    }
                }
                setStr2(finalTranscript);
                setStr(interimTranscript);
            };

            recognition.onerror = (event) => {
                console.error("Error en el reconocimiento de voz: ", event.error);
            };
        } else {
            console.error("SpeechRecognition no es compatible con este navegador.");
        }

        return () => {
            if (recognition) {
                recognition.stop();
            }
        };
    }, []);

    const handleButtonClick = () => {
        setGrabando((prevGrabando) => {
            if (!prevGrabando) {
                recognition.start();
            } else {
                recognition.stop();
            }
            return !prevGrabando;
        });
    };


    return (
        <>
            <Text style={styles.titleText}>Formulario con reconocimiento de voz</Text>
            <ScrollView>
                <View style={styles.container}>
                    <SafeAreaView style={{ margin: 12 }}>
                        <Text style={styles.text}>{"\n" + str}</Text>
                        <Text style={styles.text}>Resultado final: {str2}</Text>

                        <View style={styles.card}>
                            <TextInput
                                editable
                                multiline
                                numberOfLines={4}
                                maxLength={400}
                                onChangeText={text => onChangeText(text)}
                                value={valor}
                                style={[
                                    styles.input,
                                    { borderColor: valor.length === 400 ? "red" : "black" },
                                ]}
                            />
                            <TextInput
                                editable
                                multiline
                                numberOfLines={4}
                                maxLength={400}
                                style={styles.input}
                            />
                            <TextInput
                                editable
                                multiline
                                numberOfLines={4}
                                maxLength={400}
                                style={styles.input}
                            />
                            <TextInput
                                editable
                                multiline
                                numberOfLines={4}
                                maxLength={400}
                                style={styles.input}
                            />
                            <TextInput
                                editable
                                multiline
                                numberOfLines={4}
                                maxLength={400}
                                style={styles.input}
                            />
                            <TextInput
                                editable
                                multiline
                                numberOfLines={4}
                                maxLength={400}
                                style={styles.input}
                            />
                            <TextInput
                                editable
                                multiline
                                numberOfLines={4}
                                maxLength={400}
                                style={styles.input}
                            />
                        </View>
                    </SafeAreaView>
                </View>
            </ScrollView>
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={[
                        styles.button,
                        grabando ? styles.buttonRecording : styles.buttonNotRecording,
                    ]}
                    onPress={handleButtonClick}
                >

                    <Image source={grabando ? require(`../assets/micro_true.png`) : require(`../assets/micro_false.png`)} resizeMode='contain' style={{
                        flex: 1,
                    }} />
                </TouchableOpacity>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#E0E5EC", // Background color for neumorphism
        paddingTop: Constants.statusBarHeight,
    },
    text: {
        alignItems: "center",
        color: "#333", // Text color
        width: "90%",
        fontSize: 18, // Text size
        textAlign: "center",
    },
    titleText: {
        marginTop: Constants.statusBarHeight,
        color: "#333", // Title color
        fontSize: 24, // Title size
        textAlign: "center",
        marginVertical: 20,
        fontWeight: "bold",
    },
    card: {
        marginTop: 20,
        width: 400,
        padding: 20,
        backgroundColor: "#E0E5EC",
        borderRadius: 15,
        shadowOffset: { width: -5, height: -5 },
        shadowOpacity: 0.2,
        shadowRadius: 15,
        shadowColor: "white",
        elevation: 10,
    },
    input: {
        padding: 15,
        borderWidth: 1,
        borderRadius: 10,
        marginBottom: 15,
        backgroundColor: "#E0E5EC",
        shadowOffset: { width: 5, height: 5 },
        shadowOpacity: 0.2,
        shadowRadius: 15,
        shadowColor: "black",
        elevation: 10,
    },
    buttonContainer: {
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 40,
        marginTop: 40,
    },
    button: {
        padding: 5,
        borderRadius: 100,
        width: 200,
        height: 200,
        alignItems: "center",
        justifyContent: "center",
        shadowOffset: { width: 5, height: 5 },
        shadowOpacity: 0.2,
        shadowRadius: 15,
        shadowColor: "black",
        elevation: 10,
        horizontalAlign: "middle",
    },
    buttonRecording: {
        backgroundColor: "#F56565", // Red color

    },
    buttonNotRecording: {
        backgroundColor: "#48BB78", // Green color

    },
    buttonText: {
        color: "#fff",
        fontSize: 18,
        textAlign: "center",
    },
});
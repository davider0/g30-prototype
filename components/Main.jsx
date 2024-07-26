import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect, useRef, useMemo } from "react";
import Constants from "expo-constants";
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Button,
    Pressable,
    ScrollView,
    SafeAreaView,
    TextInput,
    FlatList
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Canvas, extend, useFrame, useThree } from '@react-three/fiber';
import { GLView } from 'expo-gl';
import { Renderer } from 'expo-three';
import { useGLTF, OrbitControls } from '@react-three/drei';
export function Main() {
    const [str, setStr] = useState("...");
    const [str2, setStr2] = useState("...");
    const [grabando, setGrabando] = useState(false);
    let recognition;
    const insets = useSafeAreaInsets();
    const [valor, onChangeText] = React.useState('Escribe aquí');

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
            <View style={styles.container}>
                <SafeAreaView style={{ margin: 12 }}>
                    <ScrollView>

                        <Text style={styles.text}>Formulario con reconocimiento de voz</Text>


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
                                style={{ padding: 10, border: "2px solid", "border-radius": "10px", marginBottom: "10px", "border-color": (valor.length == 400 ? "red" : "black") }}
                            />
                            <TouchableOpacity
                                style={[
                                    styles.button,
                                    grabando ? styles.buttonRecording : styles.buttonNotRecording,
                                ]}
                                onPress={handleButtonClick}
                            >
                                <Text style={styles.buttonText}>
                                    {grabando ? "Parar de grabar" : "Grabar"}
                                </Text>
                            </TouchableOpacity>

                        </View>
                        <Canvas>
                            <Shader />
                            <OrbitControls />
                        </Canvas>
                    </ScrollView>

                </SafeAreaView>
            </View>
        </>
    );
}


function Shader() {
    const shaderMaterial = useRef();
    const time = useRef(0);
    useFrame(() => {
        time.current += 0.01;
        shaderMaterial.current.uniforms.time.value = time.current;
    });

    return (
        <mesh>
            <planeGeometry args={[5, 5]} />
            <shaderMaterial ref={shaderMaterial} attach="material" args={[{
                uniforms: { time: { value: 0 } },
                vertexShader: `
                    varying vec2 vUv;
                    void main() {
                        vUv = uv;
                        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                    }
                `,
                fragmentShader: `
                    uniform float time;
                    varying vec2 vUv;
                    void main() {
                        vec3 color = 0.5 + 0.5 * cos(time + vUv.xyx + vec3(0, 2, 4));
                        gl_FragColor = vec4(color, 1.0);
                    }
                `
            }]} />
        </mesh>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    text: {
        color: "#000000", // gray-100 equivalent
        fontSize: 36, // 6xl equivalent (approximated)
        textAlign: "center",
    },
    card: {
        marginTop: 20,
    },
    button: {
        padding: 10,
        borderRadius: 5,
    },
    buttonRecording: {
        backgroundColor: "#F56565", // bg-red-500 equivalent
    },
    buttonNotRecording: {
        backgroundColor: "#48BB78", // bg-green-500 equivalent
    },
    buttonText: {
        color: "#fff",
        fontSize: 18,
        textAlign: "center",
    },
});

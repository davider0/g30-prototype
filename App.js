import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";

export default function App() {
  const [str, setStr] = useState("...");
  const [str2, setStr2] = useState("...");
  const [grabando, setGrabando] = useState(false);
  let recognition;

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      recognition = new SpeechRecognition();

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
        <Text style={styles.text}>Reconocimiento de voz</Text>

        <Text style={styles.text}>{"\n" + str}</Text>
        <Text style={styles.text}>Resultado final: {str2}</Text>
        <View style={styles.card}>
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
      </View>
    </>
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

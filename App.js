import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { TailwindProvider } from "tailwind-rn";
import utilities from "./tailwind.json";
import { useState, useEffect } from "react";
import "./App.css";
import clsx from "clsx";
export default function App() {
  const [str, setStr] = useState("...");
  const [str2, setStr2] = useState("...");
  const [grabando, setGrabando] = useState(false);
  let recognition;

  useEffect(() => {
    // Compatibilidad con navegadores
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      recognition = new SpeechRecognition();

      recognition.continuous = true; // Continuar reconociendo, incluso si hay pausas
      recognition.interimResults = true; // Mostrar resultados parciales

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
        <div></div>
        
        <h1 className="font-sans hover:text-neutral-50">
          Reconocimiento de voz
        </h1>
        <h2 className="">{"\n" + str}</h2>
        <h2 className="">Resultado final: {str2}</h2>
        <div className="card">
          <button
            className={clsx({
              "bg-red-500": grabando === true,
              "bg-green-500": grabando === false,
            })}
            onClick={handleButtonClick}
          >
            {grabando ? "Parar de grabar" : "Grabar"}
          </button>
          <p></p>
        </div>
      </>
  );
}

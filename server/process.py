import json
import spacy
import torch
from transformers import pipeline, AutoTokenizer, AutoModelForSequenceClassification
import speech_recognition as sr

with open('dataInput.json') as file:
    dataOutput = json.load(file)

# Cargar modelo de lenguaje preentrenado para clasificación de texto
tokenizer = AutoTokenizer.from_pretrained("distilbert-base-uncased")
model = AutoModelForSequenceClassification.from_pretrained("distilbert-base-uncased")
classifier = pipeline("zero-shot-classification", model=model, tokenizer=tokenizer)

# Cargar modelo de NLP en español
nlp = spacy.load("es_core_news_md")

# Definir los modelos posibles
modelos_posibles = ["Identificacion de parcelas", "Informacion general", "registro cosecha comercializada", 
                    "registro fertilizacion", "Registro fitosanitarios", "tratamientofitosanitarios"]

def clasificar_modelo(text):
    # Clasificar texto para seleccionar el modelo correcto
    result = classifier(text, modelos_posibles)
    return result['labels'][0]  # Devolver la etiqueta con mayor probabilidad

def extraer_entidades(text):
    # Procesar el texto con spaCy para extraer entidades
    doc = nlp(text)
    entidades = {ent.label_: ent.text for ent in doc.ents}
    return entidades

def llenar_json(modelo, entidades):
    if modelo == "Registro fitosanitarios":
        return llenar_registro_fitosanitarios(entidades)
    elif modelo == "Informacion general":
        return llenar_informacion_general(entidades)
    #TO DO: añadir mas
    

def llenar_registro_fitosanitarios(entidades):
    # Diccionario con los campos del JSON
    registros = {
        "fecha": entidades.get("DATE", ""),
        "materialAnalizado": entidades.get("MATERIAL", ""),
        "cultivoOCosechasMuestreados": entidades.get("CULTIVO", ""),
        "nBoletinDeAnalisis": entidades.get("BOLETIN", ""),
        "laboratorio": entidades.get("ORG", ""),
        "sustanciasActivasDetectadas": entidades.get("SUSTANCIAS", "")
    }
    return registros

def llenar_informacion_general(entidades):
    registros = {
        "fecha": entidades.get("DATE", ""),
        "nombreYApellidos": entidades.get("PERSON", ""),
        "NIF": entidades.get("NIF", ""),
        "nRegistroNacional": entidades.get("REGISTRO", ""),
        "nRegistroAutonomico": "",
        "direccion": entidades.get("LOC", ""),
        "localidad": entidades.get("LOC", ""),
        "cPostal": entidades.get("POSTAL", ""),
        "provincia": entidades.get("LOC", ""),
        "telefonoFijo": entidades.get("TELEFONO", ""),
        "telefonoMovil": entidades.get("TELEFONO", ""),
        "email": entidades.get("EMAIL", ""),
        "titularExplotacion": {
            "nombreYApellidos": entidades.get("PERSON", ""),
            "NIF": entidades.get("NIF", ""),
            "nRegistroNacional": "",
            "nRegistroAutonomico": "",
            "direccion": entidades.get("LOC", ""),
            "localidad": entidades.get("LOC", ""),
            "cPostal": entidades.get("POSTAL", ""),
            "provincia": entidades.get("LOC", ""),
            "telefonoFijo": entidades.get("TELEFONO", ""),
            "telefonoMovil": entidades.get("TELEFONO", ""),
            "email": entidades.get("EMAIL", "")
        }
        # Otros campos anidados pueden ser llenados de manera similar
    }
    return registros

def transcribir_audio_a_texto(audio_file):
    r = sr.Recognizer()
    with sr.AudioFile(audio_file) as source:
        audio = r.record(source)
    text = r.recognize_google(audio, language='es-ES')
    return text

# Lectura del archivo JSON de entrada
with open('dataInput.json') as file:
    dataInput = json.load(file)

# Extraer texto y modelo del archivo de entrada
transcripcion = dataInput.get("text", "")
modelo_detectado = dataInput.get("model", "")

# Paso 2: Clasificar el modelo si no está definido en el JSON
if not modelo_detectado:
    modelo_detectado = clasificar_modelo(transcripcion)

print(f"Modelo detectado: {modelo_detectado}")

# Paso 3: Extraer entidades del texto usando NLP
entidades = extraer_entidades(transcripcion)

print(f"Entidades extraídas: {entidades}")

# Paso 4: Llenar el JSON con las entidades extraídas
datos_json = llenar_json(modelo_detectado, entidades)

# Guardar los datos procesados en un archivo de salida
with open('dataOutput.json', 'w') as output_file:
    json.dump(datos_json, output_file, indent=2, ensure_ascii=False)

print("Datos procesados y guardados en dataOutput.json")

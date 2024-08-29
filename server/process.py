import json

with open('dataInput.json') as file:
    dataOutput = json.load(file)

import re
from datetime import datetime

def convertir_texto_a_registros(texto):
    # Diccionario para almacenar los valores extraídos
    registros = {
        "fecha": "",
        "materialAnalizado": "",
        "cultivoOCosechasMuestreados": "",
        "nBoletinDeAnalisis": "",
        "laboratorio": "",
        "sustanciasActivasDetectadas": ""
    }

    # Extract date
    fecha_match = re.search(r'fecha (\d+ \w+ \d+)', texto)
    if fecha_match:
        fecha_str = fecha_match.group(1)
        fecha_dt = datetime.strptime(fecha_str, "%d %B %Y")
        registros["fecha"] = fecha_dt.strftime("%Y/%m/%d")

    # Extract laboratory name and address
    lab_match = re.search(r'laboratorio (.+?) sustancias', texto)
    if lab_match:
        registros["laboratorio"] = lab_match.group(1).replace('calle', 'C/').replace('número', 'nº').strip()

    # Extract substances detected
    sustancias_match = re.search(r'sustancias activas detectadas (.+)', texto)
    if sustancias_match:
        sustancias = sustancias_match.group(1)
        if sustancias.lower() == "ninguna":
            registros["sustanciasActivasDetectadas"] = ""
        else:
            registros["sustanciasActivasDetectadas"] = sustancias

    # Other fields are assumed to be "nada", hence they will be empty
    return registros
'''
# Ejemplo de uso
json_input = {
    "text": "fecha 1 enero 2024 material analizado nada cultivos muestreados nada numero de boletin nada laboratorio nombre de laboratorio calle San Francisco número 2 y sustancias activas detectadas ninguna",
    "model": "registroFitosanitarios"
}

registros = convertir_texto_a_registros(json_input["text"])
print(registros)
'''

// CuadernoButtons.jsx
import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Platform } from 'react-native';

const CuadernoButtons = () => {
    const [files, setFiles] = useState([]);
    const [selectedFile, setSelectedFile] = useState('');

    useEffect(() => {
        // Simular la lectura de archivos desde una carpeta
        const jsonFiles = ['file1.json', 'file2.json', 'file3.json']; // Lista de archivos JSON
        setFiles(jsonFiles);
        setSelectedFile(jsonFiles[0]); // Selecciona el primer archivo por defecto
        CuadernoButtons.selectedFile = jsonFiles[0]; // Establecer el archivo seleccionado por defecto
    }, []);

    const handleValueChange = (itemValue) => {
        setSelectedFile(itemValue);
        CuadernoButtons.selectedFile = itemValue; // Actualizar la variable estática
    };

    return (
        <View style={styles.container2}>
            <View style={styles.pickerWrapper}>
                <Picker
                    selectedValue={selectedFile}
                    onValueChange={handleValueChange}
                    style={styles.picker}
                >
                    {files.map((fileName, index) => (
                        <Picker.Item key={index} label={fileName.replace('.json', '')} value={fileName} />
                    ))}
                </Picker>
            </View>
        </View>
    );
};

// Definir la propiedad estática
CuadernoButtons.selectedFile = null;

const styles = StyleSheet.create({
    container2: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
    },
    pickerWrapper: {
        width: '80%',
        height: 50,
        backgroundColor: '#E0E5EC',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 6,
            height: 6,
        },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 12,
        justifyContent: 'center',
        marginBottom: 30,
    },
    picker: {
        width: '100%',
        height: '100%',
        marginBottom: Platform.OS === 'ios' ? 165 : 0,
    },
});

export default CuadernoButtons;

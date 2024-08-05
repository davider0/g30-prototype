// SelectCuaderno.jsx
import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const CuadernoButtons = () => {
    const [files, setFiles] = useState([]);
    const [selectedFile, setSelectedFile] = useState('');

    useEffect(() => {
        // Simular la lectura de archivos desde una carpeta
        const jsonFiles = ['file1.json', 'file2.json', 'file3.json']; // Lista de archivos JSON
        setFiles(jsonFiles);
        setSelectedFile(jsonFiles[0]); // Selecciona el primer archivo por defecto
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.pickerWrapper}>
                <Picker
                    selectedValue={selectedFile}
                    onValueChange={(itemValue) => setSelectedFile(itemValue)}
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

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
    },
    pickerWrapper: {
        width: '80%',
        height: 50,
        backgroundColor: '#E0E5EC',
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 6,
            height: 6,
        },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 12,
        justifyContent: 'center',
    },
    picker: {
        width: '100%',
        height: '100%',
    },
});

export default CuadernoButtons;

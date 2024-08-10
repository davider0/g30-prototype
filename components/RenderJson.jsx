import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput } from 'react-native';
import Constants from "expo-constants";

const RenderJson = ({ jsonData }) => {
    const [data, setData] = useState(jsonData);

    const handleChange = (text, itemKey) => {
        const keys = itemKey.split('.');
        const updatedData = { ...data };

        let temp = updatedData;

        for (let i = 0; i < keys.length - 1; i++) {
            temp = temp[keys[i]];
        }

        temp[keys[keys.length - 1]] = text;
        RenderJson.jsonData = updatedData;
        setData(updatedData);
    };

    const renderItems = (data, parentKey = '') => {
        return Object.keys(data).map((key) => {
            const itemKey = parentKey ? `${parentKey}.${key}` : key;
            if (typeof data[key] === 'object' && !Array.isArray(data[key])) {
                return (
                    <View key={itemKey} >
                        <Text style={styles.text}>{key}</Text>
                        {renderItems(data[key], itemKey)}
                    </View>
                );
            } else {
                return (
                    <View key={itemKey}>
                        <Text style={styles.text}>{key}</Text>
                        <TextInput
                            editable
                            multiline
                            numberOfLines={1}
                            maxLength={400}
                            style={styles.input}
                            value={String(data[key])}
                            onChangeText={(text) => handleChange(text, itemKey)}
                        />
                    </View>
                );
            }
        });
    };

    return (
        <ScrollView>
            {renderItems(data)}
        </ScrollView>
    );
};
RenderJson.jsonData = null;
const styles = StyleSheet.create({
    text: {
        color: "#333", // Text color
        fontSize: 16, // Text size
        textAlign: "center",
    },
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#E0E5EC", // Background color for neumorphism
        paddingTop: Constants.statusBarHeight,
    },
    input: {
        padding: 15,
        borderWidth: 1,
        borderRadius: 4,
        marginBottom: 15,
        backgroundColor: "#f3f6f4",
        shadowOffset: { width: 5, height: 5 },
        shadowOpacity: 0.2,
        shadowRadius: 15,
        shadowColor: "black",
        elevation: 10,
    },
});

export default RenderJson;

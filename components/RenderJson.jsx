import React from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput } from 'react-native';
import Constants from "expo-constants";

const RenderJson = ({ jsonData }) => {
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
                            onChangeText={(text) => data[key] = text}
                        />
                    </View>
                );
            }
        });
    };

    return (
        <ScrollView>
            {renderItems(jsonData)}
        </ScrollView>
    );
};


const styles = StyleSheet.create({

    text: {
        color: "#333", // Text color
        fontSize: 18, // Text size
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
        borderRadius: 10,
        marginBottom: 15,
        backgroundColor: "#E0E5EC",
        shadowOffset: { width: 5, height: 5 },
        shadowOpacity: 0.2,
        shadowRadius: 15,
        shadowColor: "black",
        elevation: 10,
    },
});

export default RenderJson;
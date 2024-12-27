import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList, Alert, Button } from 'react-native';
import axios from 'axios';

export default function App() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [ocrData, setOcrData] = useState(null);

  // Liste des images dans votre dossier
  const images = [
    require('./assets/images/image1.jpg'),
    require('./assets/images/image2.jpg'),
    require('./assets/images/image3.jpg'),
  ];

  // Fonction pour traiter l'image sélectionnée
  const uploadImage = async (endpoint) => {
    if (!selectedImage) {
      Alert.alert('Erreur', 'Veuillez d’abord sélectionner une image.');
      return;
    }

    const formData = new FormData();
    formData.append('image', {
      uri: selectedImage.uri,
      type: 'image/jpeg',
      name: 'image.jpg',
    });

    try {
      console.log('Envoi de l’image à :', `http://192.168.1.50:5000/upload_combined`);
const response = await axios.post(`http://192.168.1.50:5000/upload_combined`, formData, {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});
console.log('Réponse du serveur:', response.data);

    } catch (error) {
      console.error('Erreur lors de l’envoi au backend:', error);
      Alert.alert('Erreur', 'Échec du traitement OCR. Veuillez vérifier votre connexion ou le serveur.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>OCR React Native</Text>
      <FlatList
        data={images}
        keyExtractor={(item, index) => index.toString()}
        horizontal
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => setSelectedImage(item)}>
            <Image
              source={item}
              style={[
                styles.image,
                selectedImage === item ? styles.selectedImage : null,
              ]}
            />
          </TouchableOpacity>
        )}
      />
      {selectedImage && <Image source={selectedImage} style={styles.preview} />}
      <Button title="Traiter en Anglais" onPress={() => uploadImage('upload')} />
      <Button title="Traiter en Arabe" onPress={() => uploadImage('upload_arabic')} />
      <Button title="Traiter en Anglais + Arabe" onPress={() => uploadImage('upload_combined')} />
      {ocrData && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultTitle}>Résultat OCR :</Text>
          <Text>{JSON.stringify(ocrData, null, 2)}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  image: {
    width: 100,
    height: 100,
    marginRight: 10,
    borderRadius: 10,
  },
  selectedImage: {
    borderWidth: 2,
    borderColor: 'blue',
  },
  preview: {
    width: '100%',
    height: 200,
    marginVertical: 20,
  },
  resultContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

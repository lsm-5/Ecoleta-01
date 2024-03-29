import React, { useEffect, useState } from 'react';
import { View, Image, ImageBackground, Text, StyleSheet } from 'react-native';
import { Feather as Icon } from '@expo/vector-icons';
import { RectButton } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';
import axios from 'axios';


interface IBGEUFResponse {
  sigla: string;
}

interface IBGECITYResponse {
  nome: string;
}

const Home = () => {
  const navigation = useNavigation();
  
  const [ufs, setUfs] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedUf, setSelectedUf] = useState('');
  
  useEffect(()=> { // load ufs
    axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
    .then(response => {
      const ufInitials = response.data.map(uf => uf.sigla)
      setUfs(ufInitials);
    })
    .catch(err=> console.log(err))
  }, []);
  
  useEffect(()=> { // load items 
    if (selectedUf === '0'){
      return;
    }
    axios.get<IBGECITYResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`)
    .then(response => {
      const cityNames = response.data.map(city => city.nome)
      setCities(cityNames);
    })
    .catch(err=> console.log(err))
    
  }, [selectedUf]);

  function handleNavigateToPoints(){
    navigation.navigate('Points', {
      uf: selectedUf,
      city: selectedCity
    })
  }
  
  return (
    <ImageBackground 
      style={styles.container} 
      source={require('../../assets/home-background.png')}
      resizeMode="contain"
      imageStyle={{ width: 274, height: 368 }}
    >
      <View style={styles.main}>
        <Image source={require('../../assets/logo.png')} />
        <Text style={styles.title}>Seu marketplace de coleta de resíduos</Text>
        <Text style={styles.description}>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente</Text>
      </View>
      <View style={styles.footer}>
        <View style={styles.select}>
          <RNPickerSelect
            placeholder={{ label: 'Selecione um estado'}}
            onValueChange={(value) => setSelectedUf(value)}
            items={ufs.map(uf=> ({
              value: uf,
              label: uf
            }))}
          />
        </View>  

        {!!selectedUf && cities.length > 0 && (
          <View style={styles.select}>
            <RNPickerSelect
            placeholder={{ label: 'Selecione uma cidade'}}
            onValueChange={(value) => setSelectedCity(value)}
            items={cities.map(city=> ({
              value: city,
              label: city
            }))}
          />
          </View>
          )}
          <RectButton style={styles.button} onPress={handleNavigateToPoints}>
            <View style={styles.buttonIcon}>
              <Text>
                <Icon name="arrow-right" color="#FFF" size={24} />
              </Text>
            </View>
            <Text style={styles.buttonText}>
            Entrar
            </Text>
          </RectButton>
        </View>
      </ImageBackground>
      );
    };
    
    const styles = StyleSheet.create({
      container: {
        flex: 1,
        padding: 32,
        backgroundColor: "#f0f0f5"
      },
      
      main: {
        flex: 1,
        justifyContent: 'center',
      },
      
      title: {
        color: '#322153',
        fontSize: 32,
        fontFamily: 'Ubuntu_700Bold',
        maxWidth: 260,
        marginTop: 64,
      },
      
      description: {
        color: '#6C6C80',
        fontSize: 16,
        marginTop: 16,
        fontFamily: 'Roboto_400Regular',
        maxWidth: 260,
        lineHeight: 24,
      },
      
      footer: {},
      
      select: {
        paddingVertical: 8      
      },
      
      input: {
        height: 60,
        backgroundColor: '#FFF',
        borderRadius: 10,
        marginBottom: 8,
        paddingHorizontal: 24,
        fontSize: 16,
      },
      
      button: {
        backgroundColor: '#34CB79',
        height: 60,
        flexDirection: 'row',
        borderRadius: 10,
        overflow: 'hidden',
        alignItems: 'center',
        marginTop: 8,
      },
      
      buttonIcon: {
        height: 60,
        width: 60,
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        justifyContent: 'center',
        alignItems: 'center'
      },
      
      buttonText: {
        flex: 1,
        justifyContent: 'center',
        textAlign: 'center',
        color: '#FFF',
        fontFamily: 'Roboto_500Medium',
        fontSize: 16,
      }
    });
    
    export default Home;
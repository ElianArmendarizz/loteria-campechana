import { View, Text, StyleSheet, Animated } from 'react-native';
import { useEffect, useRef } from 'react';

export default function LoadingScreen() {
  // Esto controla la animación de opacidad (fade in/out)
  const fadeAnim = useRef(new Animated.Value(0)).current;
  // Esto controla la animación de escala (zoom in/out)
  const scaleAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    // Cuando el componente se monta, inicia las animaciones
    Animated.parallel([
      // Animación de opacidad: de 0 a 1
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      // Animación de escala: de 0.3 a 1
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      {/* Círculo decorativo de fondo */}
      <View style={styles.circle} />
      
      {/* Contenedor animado */}
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {/* Emoji de fichas */}
        <Text style={styles.emoji}>🎲</Text>
        
        {/* Título */}
        <Text style={styles.title}>Lotería</Text>
        <Text style={styles.subtitle}>Campechana</Text>
        
        {/* Indicador de carga */}
        <View style={styles.dotsContainer}>
          <Text style={styles.loadingText}>Cargando</Text>
          <Text style={styles.dots}>...</Text>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a472a', 
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: '#234d32',
    opacity: 0.3,
  },
  content: {
    alignItems: 'center',
  },
  emoji: {
    fontSize: 80,
    marginBottom: 20,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#f4e5d3', 
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 28,
    fontWeight: '600',
    color: '#d4af37', 
    marginTop: 5,
    letterSpacing: 4,
  },
  dotsContainer: {
    flexDirection: 'row',
    marginTop: 40,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#f4e5d3',
    opacity: 0.7,
  },
  dots: {
    fontSize: 20,
    color: '#d4af37',
    marginLeft: 5,
  },
});
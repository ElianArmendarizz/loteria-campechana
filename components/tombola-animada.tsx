import { Ficha } from "@/fichas-data";
import * as Speech from "expo-speech";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View, ImageBackground } from "react-native";
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";

interface TombolaAnimadaProps {
  ficha: Ficha | null;
  estaGirando: boolean;
}

export default function TombolaAnimada({
  ficha,
  estaGirando,
}: TombolaAnimadaProps) {
  const [mostrandoNumero, setMostrandoNumero] = useState(true);

  // Valores animados
  const rotacion = useSharedValue(0);
  const escala = useSharedValue(1);
  const opacidad = useSharedValue(1);

  // Animación de giro
  useEffect(() => {
    if (estaGirando && ficha) {
      // Reiniciar estados
      setMostrandoNumero(true);
      opacidad.value = 1;

      // FASE 1: Girar y mostrar número
      rotacion.value = withSequence(
        withTiming(360, { duration: 800, easing: Easing.out(Easing.cubic) }),
        withTiming(0, { duration: 0 }),
      );

      escala.value = withSequence(
        withSpring(1.2, { damping: 10 }),
        withSpring(1),
      );

      // Decir el número en voz alta
      setTimeout(() => {
        Speech.speak(ficha.numero.toString(), {
          language: "es-MX",
          pitch: 1.0,
          rate: 0.85,
        });
      }, 400);

      // FASE 2: Transición a imagen después de 2 segundos
      setTimeout(() => {
        // Fade out
        opacidad.value = withTiming(0, { duration: 300 }, (finished) => {
          if (finished) {
            // Cambiar a mostrar imagen (ejecutar en JS thread)
            runOnJS(setMostrandoNumero)(false);
            // Fade in
            opacidad.value = withTiming(1, { duration: 300 });
          }
        });

        // Decir el nombre de la ficha
        setTimeout(() => {
          Speech.speak(ficha.nombre, {
            language: "es-MX",
            pitch: 1.0,
            rate: 0.85,
          });
        }, 400);
      }, 2000);
    }
  }, [estaGirando, ficha]);

  // Estilos animados
  const estiloAnimado = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotacion.value}deg` }, { scale: escala.value }],
    opacity: opacidad.value,
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.tombola, estiloAnimado]}>
        {ficha ? (
          mostrandoNumero ? (
            // FASE 1: Solo el número
            <View style={styles.contenido}>
              <Text style={styles.numero}>{ficha.numero}</Text>
            </View>
          ) : (
            // FASE 2: Imagen como fondo del círculo
            <ImageBackground 
              source={ficha.imagen}
              style={styles.imagenFondo}
              imageStyle={styles.imagenFondoStyle}
              resizeMode="cover"
            >
              <View style={styles.overlay}>
                <Text style={styles.numeroChico}>{ficha.numero}</Text>
                <Text style={styles.nombre}>{ficha.nombre}</Text>
              </View>
            </ImageBackground>
          )
        ) : (
          // Estado inicial
          <View style={styles.contenido}>
            <Text style={styles.numero}>?</Text>
            <Text style={styles.label}>Gira la tómbola</Text>
          </View>
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginTop: 30,
    marginBottom: 20,
  },
  tombola: {
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "#f4e5d3",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 8,
    borderColor: "#d4af37",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
    overflow: 'hidden',
  },
  contenido: {
    alignItems: "center",
    justifyContent: "center",
  },
  numero: {
    fontSize: 80,
    fontWeight: "bold",
    color: "#1a472a",
  },
  numeroChico: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
  },
  imagenFondo: {
    width: 120,
    height: 104,
    borderRadius: 0,
    overflow: 'hidden',
    justifyContent: 'flex-end',
    paddingBottom: 15,
  },
  imagenFondoStyle: {
    borderRadius: 0,
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingVertical: 18,
    paddingHorizontal: 10,
    borderBottomLeftRadius: 110,
    borderBottomRightRadius: 110,
    alignItems: 'center',
  },
  nombre: {
    fontSize: 14,
    color: "#fff",
    fontWeight: "600",
    textAlign: "center",
    marginTop: 3,
    paddingHorizontal: 5,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  label: {
    fontSize: 14,
    color: "#666",
    marginTop: 10,
  },
});
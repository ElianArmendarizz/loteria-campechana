import { obtenerFichaPorNumero } from "@/fichas-data";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Dimensions,
  Image,  // ← AGREGAR
  Modal,
  PanResponder,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import TombolaAnimada from "./tombola-animada";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

interface ModoAutomaticoProps {
  numerosDisponibles: number[];
  setNumerosDisponibles: (numeros: number[]) => void;
  numeroActual: number | null;
  setNumeroActual: (numero: number | null) => void;
  historial: number[];
  setHistorial: (historial: number[]) => void;
  onVolverMenu: () => void;
  onReiniciar: () => void;
}

type Velocidad = "lento" | "normal" | "rapido" | "muy-rapido";

const VELOCIDADES = {
  lento: 6000,
  normal: 5000,
  rapido: 4000,
  "muy-rapido": 3000,
};

export default function ModoAutomatico({
  numerosDisponibles,
  setNumerosDisponibles,
  numeroActual,
  setNumeroActual,
  historial,
  setHistorial,
  onVolverMenu,
  onReiniciar,
}: ModoAutomaticoProps) {
  const [estaReproduciendo, setEstaReproduciendo] = useState(false);
  const [estaGirando, setEstaGirando] = useState(false);
  const [velocidad, setVelocidad] = useState<Velocidad>("normal");
  const [modalVisible, setModalVisible] = useState(false);
  const intervaloRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const numerosDisponiblesRef = useRef(numerosDisponibles);
  const historialRef = useRef(historial);

  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    numerosDisponiblesRef.current = numerosDisponibles;
  }, [numerosDisponibles]);

  useEffect(() => {
    historialRef.current = historial;
  }, [historial]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return gestureState.dy < -10;
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy < 0) {
          translateY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy < -100) {
          setModalVisible(true);
          translateY.setValue(0);
        } else {
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    }),
  ).current;

  const cantarSiguienteNumero = () => {
    const numerosActuales = numerosDisponiblesRef.current;
    const historialActual = historialRef.current;

    if (numerosActuales.length === 0) {
      detenerAutomatico();
      Alert.alert("¡Lotería Completa! 🎉", "Se cantaron todos los números.", [
        { text: "OK" },
      ]);
      return;
    }

    setEstaGirando(true);

    const numeroExtraido = numerosActuales[0];
    setNumeroActual(numeroExtraido);
    setHistorial([numeroExtraido, ...historialActual]);
    setNumerosDisponibles(numerosActuales.slice(1));

    setTimeout(() => {
      setEstaGirando(false);
    }, 4000);
  };

  const iniciarAutomatico = () => {
    if (numerosDisponibles.length === 0) {
      Alert.alert(
        "No hay números",
        "Presiona REINICIAR para comenzar un nuevo juego.",
        [{ text: "OK" }],
      );
      return;
    }

    setEstaReproduciendo(true);
    cantarSiguienteNumero();

    intervaloRef.current = setInterval(() => {
      cantarSiguienteNumero();
    }, VELOCIDADES[velocidad]);
  };

  const detenerAutomatico = () => {
    setEstaReproduciendo(false);
    if (intervaloRef.current) {
      clearInterval(intervaloRef.current);
      intervaloRef.current = null;
    }
  };

  const cambiarVelocidad = (nuevaVelocidad: Velocidad) => {
    if (!estaReproduciendo) {
      setVelocidad(nuevaVelocidad);
    }
  };

  const togglePlayPause = () => {
    if (estaReproduciendo) {
      detenerAutomatico();
    } else {
      iniciarAutomatico();
    }
  };

  useEffect(() => {
    return () => {
      if (intervaloRef.current) {
        clearInterval(intervaloRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (estaReproduciendo) {
      if (intervaloRef.current) {
        clearInterval(intervaloRef.current);
      }
      intervaloRef.current = setInterval(() => {
        cantarSiguienteNumero();
      }, VELOCIDADES[velocidad]);
    }

    return () => {
      if (intervaloRef.current && !estaReproduciendo) {
        clearInterval(intervaloRef.current);
      }
    };
  }, [velocidad, estaReproduciendo]);

  const fichaActual = numeroActual
    ? (obtenerFichaPorNumero(numeroActual) ?? null)
    : null;

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onVolverMenu} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Menú</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>⚡ Automático</Text>
        <Text style={styles.headerSubtitle}>
          Quedan: {numerosDisponibles.length} / 90
        </Text>
      </View>

      {/* TÓMBOLA */}
      <TombolaAnimada ficha={fichaActual} estaGirando={estaGirando} />

      {/* CONTROL DE VELOCIDAD */}
      <View style={styles.velocidadContainer}>
        <Text style={styles.velocidadLabel}>Velocidad:</Text>
        <View style={styles.velocidadBotones}>
          <TouchableOpacity
            style={[
              styles.velocidadBoton,
              velocidad === "lento" && styles.velocidadBotonActivo,
              estaReproduciendo && styles.velocidadBotonDisabled,
            ]}
            onPress={() => cambiarVelocidad("lento")}
            disabled={estaReproduciendo}
          >
            <Text style={styles.velocidadEmoji}>🐢</Text>
            <Text style={styles.velocidadTexto}>Lento</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.velocidadBoton,
              velocidad === "normal" && styles.velocidadBotonActivo,
              estaReproduciendo && styles.velocidadBotonDisabled,
            ]}
            onPress={() => cambiarVelocidad("normal")}
            disabled={estaReproduciendo}
          >
            <Text style={styles.velocidadEmoji}>🚶</Text>
            <Text style={styles.velocidadTexto}>Normal</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.velocidadBoton,
              velocidad === "rapido" && styles.velocidadBotonActivo,
              estaReproduciendo && styles.velocidadBotonDisabled,
            ]}
            onPress={() => cambiarVelocidad("rapido")}
            disabled={estaReproduciendo}
          >
            <Text style={styles.velocidadEmoji}>🏃</Text>
            <Text style={styles.velocidadTexto}>Rápido</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.velocidadBoton,
              velocidad === "muy-rapido" && styles.velocidadBotonActivo,
              estaReproduciendo && styles.velocidadBotonDisabled,
            ]}
            onPress={() => cambiarVelocidad("muy-rapido")}
            disabled={estaReproduciendo}
          >
            <Text style={styles.velocidadEmoji}>⚡</Text>
            <Text style={styles.velocidadTexto}>Muy Rápido</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* BOTONES DE CONTROL */}
      <View style={styles.botonesControl}>
        <TouchableOpacity
          style={[
            styles.botonPrincipal,
            estaReproduciendo ? styles.botonPausar : styles.botonIniciar,
            numerosDisponibles.length === 0 && styles.botonDisabled,
          ]}
          onPress={togglePlayPause}
          disabled={numerosDisponibles.length === 0}
        >
          <Text style={styles.botonPrincipalTexto}>
            {estaReproduciendo ? "⏸️ PAUSAR" : "▶️ INICIAR"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.botonReiniciar}
          onPress={() => {
            detenerAutomatico();
            onReiniciar();
          }}
        >
          <Text style={styles.botonReiniciarTexto}>🔄 REINICIAR</Text>
        </TouchableOpacity>
      </View>

      {/* HISTORIAL CON GESTO DE DESLIZAR */}
      <Animated.View
        style={[styles.historialContainer, { transform: [{ translateY }] }]}
        {...panResponder.panHandlers}
      >
        <View style={styles.historialHandle}>
          <View style={styles.handleBar} />
          <Text style={styles.historialTitle}>
            📋 Números Cantados ({historial.length})
          </Text>
          <Text style={styles.historialHint}>Desliza hacia arriba ↑</Text>
        </View>

        <ScrollView style={styles.historialScroll} scrollEnabled={false}>
          {historial.length === 0 ? (
            <Text style={styles.historialEmpty}>
              Presiona INICIAR para comenzar
            </Text>
          ) : (
            <View style={styles.historialGrid}>
              {historial.slice(0, 6).map((numero, index) => {
                const ficha = obtenerFichaPorNumero(numero);
                return (
                  <View key={index} style={styles.historialItem}>
                    {ficha?.imagen && (
                      <Image 
                        source={ficha.imagen}
                        style={styles.historialImagen}
                        resizeMode="contain"
                      />
                    )}
                    <Text style={styles.historialNumero}>{numero}</Text>
                    <Text style={styles.historialNombre}>{ficha?.nombre}</Text>
                  </View>
                );
              })}
            </View>
          )}
        </ScrollView>
      </Animated.View>

      {/* MODAL DE HISTORIAL COMPLETO */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          {/* Header del Modal */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>📋 Todos los Números Cantados</Text>
            <Text style={styles.modalSubtitle}>
              {historial.length} de 90 números
            </Text>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalCloseText}>✕ Cerrar</Text>
            </TouchableOpacity>
          </View>

          {/* Lista Completa */}
          <ScrollView
            style={styles.modalScroll}
            contentContainerStyle={styles.modalScrollContent}
          >
            {historial.length === 0 ? (
              <Text style={styles.modalEmpty}>
                Aún no se han cantado números
              </Text>
            ) : (
              <View style={styles.modalGrid}>
                {historial.map((numero, index) => {
                  const ficha = obtenerFichaPorNumero(numero);
                  return (
                    <View key={index} style={styles.modalItem}>
                      <View style={styles.modalItemBadge}>
                        <Text style={styles.modalItemOrden}>#{index + 1}</Text>
                      </View>
                      {ficha?.imagen && (
                        <Image 
                          source={ficha.imagen}
                          style={styles.modalItemImagen}
                          resizeMode="contain"
                        />
                      )}
                      <Text style={styles.modalItemNumero}>{numero}</Text>
                      <Text style={styles.modalItemNombre}>
                        {ficha?.nombre}
                      </Text>
                    </View>
                  );
                })}
              </View>
            )}
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a472a",
  },

  header: {
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: "#0f2818",
    alignItems: "center",
    borderBottomWidth: 3,
    borderBottomColor: "#ffd700",
  },
  backButton: {
    position: "absolute",
    left: 15,
    top: 65,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  backButtonText: {
    color: "#ffd700",
    fontSize: 16,
    fontWeight: "bold",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#f4e5d3",
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#ffd700",
    marginTop: 5,
  },

  velocidadContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  velocidadLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#f4e5d3",
    marginBottom: 10,
    textAlign: "center",
  },
  velocidadBotones: {
    flexDirection: "row",
    gap: 8,
  },
  velocidadBoton: {
    flex: 1,
    backgroundColor: "#0f2818",
    padding: 10,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#234d32",
  },
  velocidadBotonActivo: {
    backgroundColor: "#234d32",
    borderColor: "#ffd700",
  },
  velocidadBotonDisabled: {
    opacity: 0.5,
  },
  velocidadEmoji: {
    fontSize: 24,
    marginBottom: 5,
  },
  velocidadTexto: {
    fontSize: 11,
    color: "#d4af37",
    fontWeight: "600",
  },

  botonesControl: {
    flexDirection: "row",
    gap: 15,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  botonPrincipal: {
    flex: 1,
    paddingVertical: 18,
    borderRadius: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  botonIniciar: {
    backgroundColor: "#28a745",
  },
  botonPausar: {
    backgroundColor: "#ffc107",
  },
  botonPrincipalTexto: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  botonReiniciar: {
    flex: 1,
    backgroundColor: "#8b4513",
    paddingVertical: 18,
    borderRadius: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  botonReiniciarTexto: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#f4e5d3",
  },
  botonDisabled: {
    backgroundColor: "#666",
    opacity: 0.5,
  },

  historialContainer: {
    flex: 1,
    backgroundColor: "#0f2818",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 10,
    paddingHorizontal: 20,
  },
  historialHandle: {
    alignItems: "center",
    paddingBottom: 10,
  },
  handleBar: {
    width: 40,
    height: 5,
    backgroundColor: "#666",
    borderRadius: 3,
    marginBottom: 10,
  },
  historialTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffd700",
    textAlign: "center",
  },
  historialHint: {
    fontSize: 12,
    color: "#888",
    marginTop: 5,
    fontStyle: "italic",
  },
  historialScroll: {
    flex: 1,
  },
  historialEmpty: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
    fontStyle: "italic",
    marginTop: 20,
  },
  historialGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    paddingBottom: 20,
  },
  historialItem: {
    width: 100,
    backgroundColor: "#ffd700",
    borderRadius: 12,
    alignItems: "center",
    padding: 10,
    borderWidth: 2,
    borderColor: "#f4e5d3",
  },
  historialImagen: {
    width: 40,
    height: 40,
    marginBottom: 5,
  },
  historialNumero: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1a472a",
  },
  historialNombre: {
    fontSize: 11,
    color: "#1a472a",
    fontWeight: "600",
    textAlign: "center",
    marginTop: 3,
  },

  modalContainer: {
    flex: 1,
    backgroundColor: "#1a472a",
  },
  modalHeader: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: "#0f2818",
    borderBottomWidth: 3,
    borderBottomColor: "#ffd700",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#f4e5d3",
    marginBottom: 5,
  },
  modalSubtitle: {
    fontSize: 16,
    color: "#ffd700",
  },
  modalCloseButton: {
    position: "absolute",
    right: 20,
    top: 65,
    backgroundColor: "#8b4513",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  modalCloseText: {
    color: "#f4e5d3",
    fontSize: 14,
    fontWeight: "bold",
  },
  modalScroll: {
    flex: 1,
  },
  modalScrollContent: {
    padding: 20,
  },
  modalEmpty: {
    fontSize: 18,
    color: "#888",
    textAlign: "center",
    marginTop: 50,
  },
  modalGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 15,
    justifyContent: "center",
  },
  modalItem: {
    width: 105,
    backgroundColor: "#ffd700",
    borderRadius: 15,
    alignItems: "center",
    padding: 12,
    borderWidth: 3,
    borderColor: "#f4e5d3",
    position: "relative",
  },
  modalItemBadge: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: "#ff6b35",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 2,
    borderColor: "#fff",
  },
  modalItemOrden: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#fff",
  },
  modalItemImagen: {
    width: 50,
    height: 50,
    marginBottom: 5,
  },
  modalItemNumero: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1a472a",
  },
  modalItemNombre: {
    fontSize: 12,
    color: "#1a472a",
    fontWeight: "600",
    textAlign: "center",
    marginTop: 3,
  },
});
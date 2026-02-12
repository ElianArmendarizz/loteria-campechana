import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,  // ← AGREGAR
} from "react-native";
import { useState, useEffect } from "react";
import LoadingScreen from "@/components/loading-screen";
import MenuSeleccion from "@/components/menu-seleccion";
import TombolaAnimada from "@/components/tombola-animada";
import ModoAutomatico from "@/components/modo-automatico";
import { obtenerFichaPorNumero } from "@/fichas-data";
import { shuffleConHistorial } from "@/shuffle-utils";

// Tipos de modo de juego
type ModoJuego = "menu" | "manual" | "automatico";

export default function LoteriaScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [modoJuego, setModoJuego] = useState<ModoJuego>("menu");

  // Estados del sorteo
  const [numerosDisponibles, setNumerosDisponibles] = useState<number[]>([]);
  const [numeroActual, setNumeroActual] = useState<number | null>(null);
  const [historial, setHistorial] = useState<number[]>([]);
  const [historialAnterior, setHistorialAnterior] = useState<number[]>([]);
  const [estaGirando, setEstaGirando] = useState(false);

  // Al iniciar la app
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  // Inicializar números con shuffle inteligente
  const inicializarNumeros = () => {
    const numeros = Array.from({ length: 90 }, (_, i) => i + 1);
    const numerosMezclados = shuffleConHistorial(numeros, historialAnterior, 5);
    setNumerosDisponibles(numerosMezclados);
  };

  // Función para cambiar de modo
  const seleccionarModoManual = () => {
    setModoJuego("manual");
    inicializarNumeros();
  };

  const seleccionarModoAutomatico = () => {
    setModoJuego("automatico");
    inicializarNumeros();
  };

  // Girar tómbola (manual)
  const girarTombola = () => {
    if (numerosDisponibles.length === 0) {
      Alert.alert(
        "¡Lotería Completa! 🎉",
        "Ya se cantaron todos los números. Presiona REINICIAR para jugar de nuevo.",
        [{ text: "OK" }],
      );
      return;
    }

    // Evitar clicks múltiples mientras está girando
    if (estaGirando) return;

    // Iniciar animación
    setEstaGirando(true);

    const numeroExtraido = numerosDisponibles[0];
    setNumeroActual(numeroExtraido);
    setHistorial([numeroExtraido, ...historial]);
    setNumerosDisponibles(numerosDisponibles.slice(1));

    // Detener animación después de 4 segundos (2s número + 2s imagen)
    setTimeout(() => {
      setEstaGirando(false);
    }, 4000);
  };

  // Reiniciar juego
  const reiniciarJuego = () => {
    Alert.alert(
      "¿Reiniciar Juego?",
      "¿Estás seguro? Se borrarán todos los números cantados.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Reiniciar",
          style: "destructive",
          onPress: () => {
            setHistorialAnterior(historial);
            setNumeroActual(null);
            setHistorial([]);
            inicializarNumeros();
          },
        },
      ],
    );
  };

  // Volver al menú
  const volverAlMenu = () => {
    Alert.alert("¿Volver al Menú?", "¿Deseas cambiar de modo de juego?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Volver",
        onPress: () => {
          setModoJuego("menu");
          setNumeroActual(null);
          setHistorial([]);
          setNumerosDisponibles([]);
        },
      },
    ]);
  };

  // RENDERIZADO CONDICIONAL
  if (isLoading) {
    return <LoadingScreen />;
  }

  if (modoJuego === "menu") {
    return (
      <MenuSeleccion
        onSeleccionarManual={seleccionarModoManual}
        onSeleccionarAutomatico={seleccionarModoAutomatico}
      />
    );
  }

  // MODO AUTOMÁTICO
  if (modoJuego === "automatico") {
    return (
      <ModoAutomatico
        numerosDisponibles={numerosDisponibles}
        setNumerosDisponibles={setNumerosDisponibles}
        numeroActual={numeroActual}
        setNumeroActual={setNumeroActual}
        historial={historial}
        setHistorial={setHistorial}
        onVolverMenu={volverAlMenu}
        onReiniciar={reiniciarJuego}
      />
    );
  }

  // MODO MANUAL
  const fichaActual = numeroActual
    ? (obtenerFichaPorNumero(numeroActual) ?? null)
    : null;

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={volverAlMenu} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Menú</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>🎲 Manual</Text>
        <Text style={styles.headerSubtitle}>
          Quedan: {numerosDisponibles.length} / 90
        </Text>
      </View>

      {/* TÓMBOLA */}
      <TombolaAnimada ficha={fichaActual} estaGirando={estaGirando} />

      {/* BOTONES */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={[
            styles.buttonGirar,
            numerosDisponibles.length === 0 && styles.buttonDisabled,
          ]}
          onPress={girarTombola}
          disabled={numerosDisponibles.length === 0}
        >
          <Text style={styles.buttonGirarText}>🎰 GIRAR</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.buttonReiniciar}
          onPress={reiniciarJuego}
        >
          <Text style={styles.buttonReiniciarText}>🔄 REINICIAR</Text>
        </TouchableOpacity>
      </View>

      {/* HISTORIAL */}
      <View style={styles.historialContainer}>
        <Text style={styles.historialTitle}>
          📋 Números Cantados ({historial.length})
        </Text>
        <ScrollView style={styles.historialScroll}>
          {historial.length === 0 ? (
            <Text style={styles.historialEmpty}>
              Aún no se han cantado números
            </Text>
          ) : (
            <View style={styles.historialGrid}>
              {historial.map((numero, index) => {
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
      </View>
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
    borderBottomColor: "#d4af37",
  },
  backButton: {
    position: "absolute",
    left: 15,
    top: 65,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  backButtonText: {
    color: "#d4af37",
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
    color: "#d4af37",
    marginTop: 5,
  },

  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 15,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  buttonGirar: {
    flex: 1,
    backgroundColor: "#d4af37",
    paddingVertical: 18,
    borderRadius: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonGirarText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1a472a",
  },
  buttonReiniciar: {
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
  buttonReiniciarText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#f4e5d3",
  },
  buttonDisabled: {
    backgroundColor: "#666",
    opacity: 0.5,
  },

  historialContainer: {
    flex: 1,
    backgroundColor: "#0f2818",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  historialTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#d4af37",
    marginBottom: 15,
    textAlign: "center",
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
  },
  historialItem: {
    width: 100,
    backgroundColor: "#d4af37",
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
});